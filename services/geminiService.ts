
import { GoogleGenAI, Type } from "@google/genai";
import { InvoiceData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Pricing Configuration (USD per 1M tokens)
const MODEL_PRICING: Record<string, { in: number; out: number }> = {
  'gemini-3-flash-preview': { in: 0.10, out: 0.40 },
  'gemini-3-pro-preview': { in: 1.25, out: 5.00 },
  'gemini-flash-lite-latest': { in: 0.075, out: 0.30 }
};

const USD_TO_THB = 35.0;

const INVOICE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    invoice: {
      type: Type.OBJECT,
      properties: {
        invoiceNumber: { type: Type.STRING, description: "Invoice number (เลขที่)" },
        date: { type: Type.STRING, description: "Invoice date (YYYY-MM-DD)" },
        dueDate: { type: Type.STRING, description: "Payment due date (YYYY-MM-DD)" },
        category: { type: Type.STRING },
        isReceipt: { type: Type.BOOLEAN, description: "True if document is 'Tax Invoice/Receipt'" },
        currency: { type: Type.STRING, default: "THB" }
      },
      required: ["invoiceNumber", "date"]
    },
    seller: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Company name issuing the invoice" },
        taxId: { type: Type.STRING, description: "13-digit Thai Tax ID of the vendor" },
        branch: { type: Type.STRING, description: "Vendor branch (e.g., Head Office or 5-digit code)" },
        address: { type: Type.STRING }
      },
      required: ["name"]
    },
    customer: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Customer name" },
        taxId: { type: Type.STRING, description: "13-digit Thai Tax ID of the customer" },
        branch: { type: Type.STRING, description: "Customer branch" },
        address: { type: Type.STRING }
      }
    },
    lineItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unitPrice: { type: Type.NUMBER, description: "Price before discount" },
          discount: { type: Type.NUMBER, description: "Discount per item or total line discount" },
          total: { type: Type.NUMBER, description: "Final total for this line (qty * unitPrice - discount)" }
        },
        required: ["description", "total"]
      }
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        subtotal: { type: Type.NUMBER },
        taxAmount: { type: Type.NUMBER, description: "VAT amount (usually 7% in Thailand)" },
        totalAmount: { type: Type.NUMBER }
      },
      required: ["totalAmount"]
    }
  },
  required: ["invoice", "seller", "lineItems", "summary"]
};

export async function extractInvoiceData(base64Image: string, mimeType: string, modelName: string = 'gemini-3-flash-preview'): Promise<Partial<InvoiceData>> {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image.split(',')[1]
            },
          },
          {
            text: `Extract information from this Thai Tax Invoice. 
            Identify: 
            1. Vendor (Seller) and Customer details: Name, Tax ID (13 digits), and Branch (Head Office/สำนักงานใหญ่ or code).
            2. Invoice details: Number, Date, Due Date.
            3. Detailed Line Items, specifically looking for Quantity, Unit Price and any Discounts (ส่วนลด).
            4. Summary: Subtotal, VAT 7%, and Total Amount.
            If labels are in Thai, translate values accurately (e.g. 'สำนักงานใหญ่' to 'Head Office'). 
            Organize output into the specified nested JSON groups.`
          }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: INVOICE_SCHEMA,
        temperature: 0.1,
      },
    });

    const result = JSON.parse(response.text || '{}');
    const usage = response.usageMetadata;
    
    const tokensIn = usage?.promptTokenCount || 0;
    const tokensOut = usage?.candidatesTokenCount || 0;
    
    // Calculate cost based on selected model
    const pricing = MODEL_PRICING[modelName] || MODEL_PRICING['gemini-3-flash-preview'];
    const costUSD = ((tokensIn / 1000000) * pricing.in) + ((tokensOut / 1000000) * pricing.out);
    const costTHB = costUSD * USD_TO_THB;
    
    // Inject generated metadata and status
    const finalResult: Partial<InvoiceData> = {
      ...result,
      invoice: {
        ...result.invoice,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        imageUrl: base64Image,
      },
      extractionMeta: {
        model: modelName,
        tokensIn: tokensIn,
        tokensOut: tokensOut,
        totalTokens: usage?.totalTokenCount || 0,
        costTHB: Number(costTHB.toFixed(4)),
        costUSD: Number(costUSD.toFixed(6))
      }
    };
    console.log("Extraction result:", finalResult);
    return finalResult;
  } catch (error) {
    console.error("Extraction error:", error);
    throw error;
  }
}
