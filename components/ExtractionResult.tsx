
import React, { useState } from 'react';
import { Save, X, Trash2, Plus, Info, Cpu, FileJson, Edit3, Building2, UserCircle, Wallet, Tag } from 'lucide-react';
import { InvoiceData, LineItem } from '../types';

interface ExtractionResultProps {
  data: InvoiceData;
  onSave: (data: InvoiceData) => void;
  onCancel: () => void;
}

function bahtText(num: number): string {
  if (!num || isNaN(num)) return "-";
  return `( ${num.toLocaleString()} บาทถ้วน )`;
}

const ExtractionResult: React.FC<ExtractionResultProps> = ({ data, onSave, onCancel }) => {
  const [editedData, setEditedData] = useState<InvoiceData>(data);
  const [activeView, setActiveView] = useState<'form' | 'json'>('form');

  const handleInvoiceChange = (field: string, value: any) => {
    setEditedData(prev => ({ 
      ...prev, 
      invoice: { ...prev.invoice, [field]: value } 
    }));
  };

  const handleSellerChange = (field: string, value: any) => {
    setEditedData(prev => ({ 
      ...prev, 
      seller: { ...prev.seller, [field]: value } 
    }));
  };

  const handleCustomerChange = (field: string, value: any) => {
    setEditedData(prev => ({ 
      ...prev, 
      customer: { ...prev.customer, [field]: value } 
    }));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...editedData.lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total if key fields change
    if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
      const q = Number(newItems[index].quantity) || 0;
      const u = Number(newItems[index].unitPrice) || 0;
      const d = Number(newItems[index].discount) || 0;
      newItems[index].total = (q * u) - d;
    }
    setEditedData(prev => ({ ...prev, lineItems: newItems }));
  };

  const addLineItem = () => {
    const newItem: LineItem = { description: '', quantity: 1, unitPrice: 0, discount: 0, total: 0 };
    setEditedData(prev => ({ ...prev, lineItems: [...(prev.lineItems || []), newItem] }));
  };

  const removeLineItem = (index: number) => {
    const newItems = editedData.lineItems.filter((_, i) => i !== index);
    setEditedData(prev => ({ ...prev, lineItems: newItems }));
  };

  const isPdf = editedData.invoice.imageUrl?.startsWith('data:application/pdf');

  return (
    <div className="max-w-7xl mx-auto bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh]">
      {/* Verification Panel (Left) */}
      <div className="w-full md:w-3/5 lg:w-4/7 flex flex-col h-full bg-white border-r border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setActiveView('form')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all ${activeView === 'form' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Edit3 className="w-4 h-4" />
              VERIFY FORM
            </button>
            <button 
              onClick={() => setActiveView('json')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all ${activeView === 'json' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <FileJson className="w-4 h-4" />
              RAW JSON
            </button>
          </div>
          <button onClick={onCancel} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/30">
          {activeView === 'form' ? (
            <div className="max-w-3xl mx-auto space-y-10">
              {/* Document Header Box */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                   <div className="space-y-1">
                     <h3 className="text-xl font-black text-slate-800">เอกสารใบกำกับภาษี</h3>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Document Header Verification</p>
                   </div>
                   <label className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                        checked={editedData.invoice.isReceipt}
                        onChange={(e) => handleInvoiceChange('isReceipt', e.target.checked)}
                      />
                      <span className="text-sm font-black text-indigo-900">เป็นใบเสร็จรับเงิน (Receipt)</span>
                   </label>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขที่เอกสาร (Invoice No.)</label>
                    <input 
                      className="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-black text-slate-800 bg-slate-50/50"
                      value={editedData.invoice.invoiceNumber}
                      onChange={(e) => handleInvoiceChange('invoiceNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่ (Invoice Date)</label>
                    <input 
                      type="date"
                      className="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-black text-slate-800 bg-slate-50/50"
                      value={editedData.invoice.date}
                      onChange={(e) => handleInvoiceChange('date', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Seller Info Box */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4" /> 1. ข้อมูลผู้ขาย (SELLER INFO)
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">ชื่อบริษัทผู้ขาย</label>
                    <input 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold bg-slate-50/50"
                      value={editedData.seller.name}
                      onChange={(e) => handleSellerChange('name', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">เลขผู้เสียภาษี (Tax ID)</label>
                      <input 
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-mono font-bold"
                        maxLength={13}
                        value={editedData.seller.taxId}
                        onChange={(e) => handleSellerChange('taxId', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">สาขา (Branch)</label>
                      <input 
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                        value={editedData.seller.branch}
                        onChange={(e) => handleSellerChange('branch', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">ที่อยู่ผู้ขาย</label>
                    <textarea 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm min-h-[60px]"
                      value={editedData.seller.address}
                      onChange={(e) => handleSellerChange('address', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Customer Info Box */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <UserCircle className="w-4 h-4" /> 2. ข้อมูลผู้ซื้อ (CUSTOMER INFO)
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">ชื่อผู้ซื้อ/ลูกค้า</label>
                    <input 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold bg-slate-50/50"
                      value={editedData.customer.name}
                      onChange={(e) => handleCustomerChange('name', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">เลขผู้เสียภาษี (Tax ID)</label>
                      <input 
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-mono font-bold"
                        maxLength={13}
                        value={editedData.customer.taxId}
                        onChange={(e) => handleCustomerChange('taxId', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">สาขา (Branch)</label>
                      <input 
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
                        value={editedData.customer.branch}
                        onChange={(e) => handleCustomerChange('branch', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Box */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-4 h-4" /> 3. รายการสินค้า (ITEM LIST)
                  </h4>
                  <button onClick={addLineItem} className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1">
                    <Plus className="w-3 h-3" /> เพิ่มรายการ
                  </button>
                </div>
                
                <div className="overflow-x-auto -mx-8">
                  <table className="w-full text-left text-sm min-w-[700px]">
                    <thead className="bg-slate-50/80 border-y border-slate-100">
                      <tr>
                        <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter w-12 text-center">ลำดับ</th>
                        <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">รายการ</th>
                        <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter text-right w-16">จำนวน</th>
                        <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter text-right w-24">ราคา/หน่วย</th>
                        <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter text-right w-20">ส่วนลด</th>
                        <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter text-right w-28">รวม</th>
                        <th className="px-4 py-4 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editedData.lineItems?.map((item, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 text-center text-slate-400 font-bold">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <input 
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 p-0" 
                              value={item.description}
                              onChange={(e) => updateLineItem(idx, 'description', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number"
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono text-right p-0" 
                              value={item.quantity}
                              onChange={(e) => updateLineItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number"
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono text-right p-0" 
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number"
                              className="w-full bg-transparent border-none focus:ring-0 text-sm font-mono text-right text-rose-500 p-0" 
                              value={item.discount}
                              onChange={(e) => updateLineItem(idx, 'discount', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                             <p className="text-sm font-black text-slate-900 font-mono">{(item.total || 0).toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => removeLineItem(idx)} className="text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Box */}
              <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                        <span className="font-mono text-sm">{editedData.invoice.currency} {editedData.summary.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[10px] font-black uppercase tracking-widest">VAT 7%</span>
                        <span className="font-mono text-sm">{editedData.invoice.currency} {editedData.summary.taxAmount?.toLocaleString()}</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end justify-center border-l border-white/10 pl-8">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Grand Total</span>
                      <span className="text-4xl font-black text-white font-mono leading-none">{editedData.invoice.currency} {editedData.summary.totalAmount?.toLocaleString()}</span>
                   </div>
                 </div>
                 <div className="pt-8 border-t border-white/10 text-center">
                    <p className="text-indigo-300 font-black text-xs uppercase tracking-widest">{bahtText(editedData.summary.totalAmount)}</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="bg-slate-900 rounded-3xl p-8 overflow-auto flex-1 font-mono text-xs shadow-inner custom-scrollbar">
                <pre className="text-emerald-400 leading-relaxed">
                  {JSON.stringify(editedData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* API COST BOX */}
          {editedData.extractionMeta && (
             <div className="max-w-3xl mx-auto bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm mt-10">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                       <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{editedData.extractionMeta.model}</p>
                      <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase">
                         <span>IN: {editedData.extractionMeta.tokensIn}</span>
                         <span>OUT: {editedData.extractionMeta.tokensOut}</span>
                         <span className="text-indigo-400">TOTAL: {editedData.extractionMeta.totalTokens}</span>
                      </div>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                      <Wallet className="w-3 h-3" /> API COST
                    </p>
                    <div className="space-y-0.5">
                      <p className="text-xl font-black text-slate-800 font-mono">
                        {editedData.extractionMeta.costTHB?.toLocaleString(undefined, { minimumFractionDigits: 4 })} <span className="text-xs text-slate-400 uppercase ml-1">THB</span>
                      </p>
                      <p className="text-xs font-bold text-slate-400 font-mono">
                        ≈ ${editedData.extractionMeta.costUSD?.toLocaleString(undefined, { minimumFractionDigits: 6 })} <span className="text-[8px] uppercase">USD</span>
                      </p>
                    </div>
                 </div>
               </div>
             </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 bg-white">
          <button 
            onClick={() => {
              const final = { ...editedData };
              final.invoice.status = 'verified';
              onSave(final);
            }}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200"
          >
            <Save className="w-6 h-6" />
            VERIFY & SAVE RECORD
          </button>
        </div>
      </div>

      {/* Document View (Right) */}
      <div className="w-full md:w-2/5 lg:w-3/7 bg-slate-900 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 opacity-50"></div>
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-[2rem] shadow-2xl w-full h-full overflow-hidden group">
            {isPdf ? (
              <iframe 
                src={editedData.invoice.imageUrl} 
                className="w-full h-full" 
                title="PDF Source"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img src={editedData.invoice.imageUrl} alt="Invoice source" className="max-h-full max-w-full object-contain rounded-2xl shadow-inner group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
            )}
          </div>
          <div className="bg-white/10 backdrop-blur-md text-white/80 p-5 rounded-2xl text-[10px] border border-white/5 flex items-center gap-4 max-w-xs text-center font-medium leading-relaxed">
             <Info className="w-6 h-6 text-indigo-400 flex-shrink-0" />
             ตรวจสอบความถูกต้องของข้อมูลจากรูปภาพต้นฉบับและแก้ไขผ่านฟอร์มทางด้านซ้าย
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionResult;
