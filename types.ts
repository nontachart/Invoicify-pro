
export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface ExtractionMetadata {
  model: string;
  tokensIn: number;
  tokensOut: number;
  totalTokens: number;
  costTHB?: number;
  costUSD?: number;
}

export interface InvoiceMeta {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  category: string;
  status: 'pending' | 'verified' | 'paid';
  isReceipt?: boolean;
  imageUrl?: string;
  currency: string;
}

export interface SellerInfo {
  name: string;
  taxId?: string;
  branch?: string;
  address?: string;
}

export interface CustomerInfo {
  name?: string;
  taxId?: string;
  branch?: string;
  address?: string;
}

export interface FinancialSummary {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export interface InvoiceData {
  invoice: InvoiceMeta;
  seller: SellerInfo;
  customer: CustomerInfo;
  lineItems: LineItem[];
  summary: FinancialSummary;
  extractionMeta?: ExtractionMetadata;
}

export interface DashboardStats {
  totalSpent: number;
  invoiceCount: number;
  pendingCount: number;
  monthlyTrend: { month: string; amount: number }[];
}
