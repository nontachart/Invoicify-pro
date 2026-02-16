
import React, { useState } from 'react';
import { ChevronLeft, Download, Printer, Edit3, Trash2, Calendar, FileText, Tag, ExternalLink, Building2, UserCircle, MapPin, CreditCard, FileJson, Layout, Wallet, Cpu, CheckCircle2, List } from 'lucide-react';
import { InvoiceData } from '../types';

interface InvoiceDetailProps {
  invoice: InvoiceData;
  onClose: () => void;
  onEdit?: (invoice: InvoiceData) => void;
}

const convertToThaiBaht = (amount: number): string => {
  if (amount === 0) return 'ศูนย์บาทถ้วน';
  const numbers = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
  const [integerPart, decimalPart] = amount.toFixed(2).split('.');
  const convert = (numStr: string) => {
    let result = '';
    const len = numStr.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(numStr[i]);
      const pos = len - i - 1;
      if (digit !== 0) {
        if (pos === 0 && digit === 1 && len > 1) result += 'เอ็ด';
        else if (pos === 1 && digit === 1) result += 'สิบ';
        else if (pos === 1 && digit === 2) result += 'ยี่สิบ';
        else result += numbers[digit] + units[pos % 6];
      }
      if (pos >= 6 && pos % 6 === 0) result += 'ล้าน';
    }
    return result;
  };
  let thaiText = convert(integerPart) + 'บาท';
  if (parseInt(decimalPart) === 0) thaiText += 'ถ้วน';
  else thaiText += convert(decimalPart) + 'สตางค์';
  return thaiText.replace('หนึ่งสิบ', 'สิบ');
};

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onClose, onEdit }) => {
  const [activeView, setActiveView] = useState<'document' | 'json' | 'summary'>('document');

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'verified': return 'bg-emerald-500 text-white shadow-lg shadow-emerald-200';
      case 'paid': return 'bg-blue-500 text-white shadow-lg shadow-blue-200';
      default: return 'bg-amber-500 text-white shadow-lg shadow-amber-200';
    }
  };

  const summaryRows = [
    { label: 'เลขที่เอกสาร (Invoice Number)', value: invoice.invoice.invoiceNumber },
    { label: 'วันที่ (Date)', value: invoice.invoice.date },
    { label: 'วันครบกำหนด (Due Date)', value: invoice.invoice.dueDate || '-' },
    { label: 'ประเภทเอกสาร (Document Type)', value: invoice.invoice.isReceipt ? 'ใบกำกับภาษี/ใบเสร็จรับเงิน' : 'ใบกำกับภาษี' },
    { label: 'ชื่อผู้ขาย (Seller Name)', value: invoice.seller.name },
    { label: 'เลขประจำตัวผู้เสียภาษีผู้ขาย (Seller Tax ID)', value: invoice.seller.taxId || '-' },
    { label: 'สาขาผู้ขาย (Seller Branch)', value: invoice.seller.branch || '-' },
    { label: 'ที่อยู่ผู้ขาย (Seller Address)', value: invoice.seller.address || '-' },
    { label: 'ชื่อผู้ซื้อ (Customer Name)', value: invoice.customer.name || '-' },
    { label: 'เลขประจำตัวผู้เสียภาษีผู้ซื้อ (Customer Tax ID)', value: invoice.customer.taxId || '-' },
    { label: 'สาขาผู้ซื้อ (Customer Branch)', value: invoice.customer.branch || '-' },
    { label: 'ที่อยู่ผู้ซื้อ (Customer Address)', value: invoice.customer.address || '-' },
    { label: 'หมวดหมู่ (Category)', value: invoice.invoice.category || '-' },
    { label: 'สกุลเงิน (Currency)', value: invoice.invoice.currency },
    { label: 'จำนวนเงินก่อนภาษี (Subtotal)', value: invoice.summary.subtotal?.toLocaleString() },
    { label: 'ภาษีมูลค่าเพิ่ม (VAT 7%)', value: invoice.summary.taxAmount?.toLocaleString() },
    { label: 'จำนวนเงินรวมทั้งสิ้น (Grand Total)', value: invoice.summary.totalAmount?.toLocaleString() },
    { label: 'สถานะ (Status)', value: invoice.invoice.status },
  ];

  const isPdf = invoice.invoice.imageUrl?.startsWith('data:application/pdf');

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-20 space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-slate-400 hover:text-indigo-600 border border-slate-200 transition-all hover:shadow-xl hover:-translate-x-1"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <button 
              onClick={() => setActiveView('document')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeView === 'document' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Layout className="w-4 h-4" />
              DOCUMENT VIEW
            </button>
            <button 
              onClick={() => setActiveView('summary')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeView === 'summary' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-4 h-4" />
              FIELD SUMMARY
            </button>
            <button 
              onClick={() => setActiveView('json')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeView === 'json' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <FileJson className="w-4 h-4" />
              JSON DATA
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-5 h-5" />
          </button>
          <div className="h-10 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          <button 
            onClick={() => onEdit?.(invoice)}
            className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 font-black text-sm"
          >
            <Edit3 className="w-5 h-5" />
            EDIT RECORD
          </button>
          <button className="flex items-center gap-2 px-4 py-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 hover:bg-rose-100 transition-all font-bold">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Document Body (Left) */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[800px] flex flex-col">
            {activeView === 'document' ? (
              <div className="flex-1 flex flex-col">
                {/* Header Block */}
                <div className="p-12 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                    <div className="space-y-6">
                       <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100">
                         <FileText className="w-4 h-4" /> Official Tax Document
                       </div>
                       <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                         {invoice.invoice.isReceipt ? 'ใบกำกับภาษี/ใบเสร็จรับเงิน' : 'ใบกำกับภาษี'}
                       </h1>
                       <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2 text-slate-400">
                           <Calendar className="w-5 h-5" />
                           <p className="text-sm font-bold uppercase tracking-widest">{new Date(invoice.invoice.date).toLocaleDateString('th-TH', { dateStyle: 'long' })}</p>
                         </div>
                         <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                           <CheckCircle2 className="w-4 h-4" />
                           <p className="text-[10px] font-black uppercase tracking-widest">{invoice.invoice.status}</p>
                         </div>
                       </div>
                    </div>
                    
                    <div className="text-right space-y-4">
                      <div className={`inline-block px-5 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px] ${getStatusStyle(invoice.invoice.status)}`}>
                        {invoice.invoice.status}
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">เลขที่ (No.)</p>
                        <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{invoice.invoice.invoiceNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-12 space-y-12 flex-1">
                  {/* Parties Information Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                      <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-3">
                        <Building2 className="w-5 h-5" /> ข้อมูลผู้ขาย (SELLER)
                      </h4>
                      <div className="space-y-4">
                        <p className="font-black text-slate-900 text-xl leading-tight">{invoice.seller.name}</p>
                        <div className="flex items-start gap-3 text-slate-600 text-sm">
                          <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-slate-300" />
                          <p className="leading-relaxed font-medium">{invoice.seller.address || '-'}</p>
                        </div>
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-50">
                           <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Tax ID</p>
                             <p className="text-xs font-mono font-black text-slate-800 tracking-wider">{invoice.seller.taxId || 'N/A'}</p>
                           </div>
                           <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Branch</p>
                             <p className="text-xs font-black text-slate-800">{invoice.seller.branch || '-'}</p>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                      <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-3">
                        <UserCircle className="w-5 h-5" /> ข้อมูลผู้ซื้อ (BUYER)
                      </h4>
                      <div className="space-y-4">
                        <p className="font-black text-slate-900 text-xl leading-tight">{invoice.customer.name || 'ทั่วไป'}</p>
                        <div className="flex items-start gap-3 text-slate-600 text-sm">
                          <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-slate-300" />
                          <p className="leading-relaxed font-medium">{invoice.customer.address || '-'}</p>
                        </div>
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-50">
                           <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Tax ID</p>
                             <p className="text-xs font-mono font-black text-slate-800 tracking-wider">{invoice.customer.taxId || '-'}</p>
                           </div>
                           <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Branch</p>
                             <p className="text-xs font-black text-slate-800">{invoice.customer.branch || '-'}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item List Table */}
                  <div className="bg-slate-50 p-1 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-inner">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">No.</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-20">Qty</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-28">Price</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-24">Discount</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-36">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {invoice.lineItems?.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6 text-xs font-black text-slate-300 text-center">{i + 1}</td>
                            <td className="px-8 py-6">
                              <p className="text-sm font-black text-slate-800 leading-tight">{item.description}</p>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <p className="text-sm font-bold text-slate-600 font-mono">{item.quantity}</p>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <p className="text-sm font-bold text-slate-600 font-mono">{item.unitPrice?.toLocaleString()}</p>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <p className="text-sm font-bold text-rose-500 font-mono">-{item.discount?.toLocaleString() || 0}</p>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <p className="text-sm font-black text-slate-900 font-mono">{invoice.invoice.currency} {item.total?.toLocaleString()}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Block */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
                    <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem] shadow-sm">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">จำนวนเงินรวม (ตัวอักษร)</p>
                      <p className="text-lg font-black text-indigo-700 leading-relaxed">{convertToThaiBaht(invoice.summary.totalAmount)}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-8 text-slate-400">
                        <span className="text-xs font-black uppercase tracking-widest">Subtotal</span>
                        <span className="text-sm font-black font-mono">{invoice.invoice.currency} {invoice.summary.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center px-8 text-slate-400">
                        <span className="text-xs font-black uppercase tracking-widest">VAT 7%</span>
                        <span className="text-sm font-black font-mono">{invoice.invoice.currency} {invoice.summary.taxAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200">
                        <span className="text-xs font-black uppercase tracking-[0.4em]">GRAND TOTAL</span>
                        <span className="text-3xl font-black font-mono text-indigo-400">{invoice.invoice.currency} {invoice.summary.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeView === 'summary' ? (
              <div className="p-12 h-full flex flex-col space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">สรุปรายละเอียดเขตข้อมูล</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Extracted Field Summary Table</p>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-20">No.</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-64">Label</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {summaryRows.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4 text-xs font-black text-slate-300 text-center">{i + 1}</td>
                          <td className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-tight">{row.label}</td>
                          <td className="px-8 py-4 text-sm font-bold text-slate-900">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-12 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Data Object</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Audit record: {invoice.invoice.id}</p>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(invoice, null, 2));
                      alert('Copied!');
                    }}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[10px] uppercase rounded-xl border border-slate-200"
                  >
                    COPY RAW DATA
                  </button>
                </div>
                <div className="bg-slate-900 rounded-[2.5rem] p-10 overflow-auto flex-1 font-mono text-xs shadow-2xl custom-scrollbar">
                  <pre className="text-emerald-400 leading-relaxed">
                    {JSON.stringify(invoice, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Box 4 Footer: API Costs */}
            <div className="p-12 bg-slate-50 border-t border-slate-100 mt-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">SECURE EXTRACTION</span>
                    <span className="text-xs font-black text-slate-900 uppercase">Invoicify AI Intelligence</span>
                  </div>
                </div>
                
                {invoice.extractionMeta && (
                  <div className="flex items-center gap-10 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                     <div className="flex items-center gap-4 border-r border-slate-100 pr-10">
                       <Cpu className="w-6 h-6 text-indigo-500" />
                       <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Model Type</p>
                         <p className="text-xs font-black text-slate-800">{invoice.extractionMeta.model}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-4">
                       <Wallet className="w-6 h-6 text-emerald-500" />
                       <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">API Processing Cost</p>
                         <div className="flex flex-col">
                           <p className="text-xl font-black text-slate-900 font-mono">
                             {invoice.extractionMeta.costTHB?.toLocaleString(undefined, { minimumFractionDigits: 4 })} <span className="text-xs text-slate-400 ml-1">THB</span>
                           </p>
                           <p className="text-[10px] font-bold text-slate-400 font-mono text-right">
                             ≈ ${invoice.extractionMeta.costUSD?.toLocaleString(undefined, { minimumFractionDigits: 6 })} USD
                           </p>
                         </div>
                       </div>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Source Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 flex items-center gap-2">
              <Layout className="w-4 h-4" /> ORIGINAL DOCUMENT SOURCE
            </h4>
            <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl aspect-[3/4.2] flex items-center justify-center relative border-8 border-white group">
              {invoice.invoice.imageUrl ? (
                <div className="w-full h-full">
                  {isPdf ? (
                    <iframe 
                      src={invoice.invoice.imageUrl} 
                      className="w-full h-full" 
                      title="PDF Source"
                    />
                  ) : (
                    <>
                      <img 
                        src={invoice.invoice.imageUrl} 
                        alt="Invoice" 
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-12">
                        <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-2xl">
                          <ExternalLink className="w-4 h-4" /> View Full Image
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-slate-700 flex flex-col items-center gap-6">
                  <FileText className="w-24 h-24 opacity-20" />
                  <p className="font-black text-xs uppercase tracking-widest">No Document Found</p>
                </div>
              )}
            </div>
            
            <div className="bg-indigo-600 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 space-y-4">
               <h5 className="font-black text-sm uppercase tracking-widest">Financial Audit Record</h5>
               <p className="text-xs text-indigo-100 leading-relaxed font-medium">This record has been digitally processed and verified. It is ready for export to your accounting software.</p>
               <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors border border-white/10">
                 DOWNLOAD AUDIT LOG
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
