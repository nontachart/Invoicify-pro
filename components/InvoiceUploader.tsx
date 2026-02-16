
import React, { useState } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertCircle, RefreshCw, Cpu, Zap, BrainCircuit, Sparkles } from 'lucide-react';
import { extractInvoiceData } from '../services/geminiService';
import { InvoiceData } from '../types';

interface InvoiceUploaderProps {
  onProcessed: (data: InvoiceData) => void;
}

type AIModel = {
  id: string;
  name: string;
  desc: string;
  icon: any;
  color: string;
  tier: string;
};

const MODELS: AIModel[] = [
  { 
    id: 'gemini-3-flash-preview', 
    name: 'Gemini 3 Flash', 
    desc: 'Fastest & Best Value for standard invoices', 
    icon: Zap, 
    color: 'text-amber-500',
    tier: 'Recommended'
  },
  { 
    id: 'gemini-3-pro-preview', 
    name: 'Gemini 3 Pro', 
    desc: 'Complex reasoning for handwritten or messy data', 
    icon: BrainCircuit, 
    color: 'text-indigo-600',
    tier: 'Premium'
  },
  { 
    id: 'gemini-flash-lite-latest', 
    name: 'Gemini Lite', 
    desc: 'Lightweight extraction for simple receipts', 
    icon: Sparkles, 
    color: 'text-emerald-500',
    tier: 'Budget'
  },
];

const InvoiceUploader: React.FC<InvoiceUploaderProps> = ({ onProcessed }) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
    }
  };

  const processInvoice = async () => {
    if (!preview || !file) return;
    
    setIsProcessing(true);
    setProgress(10);
    setError(null);

    try {
      const timer = setInterval(() => {
        setProgress(prev => (prev >= 90 ? 90 : prev + 5));
      }, 400);

      const extracted = await extractInvoiceData(preview, file.type, selectedModel);
      clearInterval(timer);
      setProgress(100);

      setTimeout(() => {
        onProcessed(extracted as InvoiceData);
        setIsProcessing(false);
        setFile(null);
        setPreview(null);
        setProgress(0);
      }, 500);

    } catch (err) {
      console.error(err);
      setError("Failed to extract invoice data. Please ensure the image is clear and try again.");
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {!preview ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center transition-all hover:border-indigo-300 hover:bg-slate-50">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UploadCloud className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Upload your invoice</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Drop your PDF, JPG, or PNG here, or click to browse. We'll handle the Thai Tax Invoice extraction for you.
          </p>
          <label className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            Select File
            <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
          </label>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Model Selector Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                disabled={isProcessing}
                className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                  selectedModel === m.id 
                    ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 ${m.color}`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    selectedModel === m.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {m.tier}
                  </span>
                </div>
                <h5 className={`font-bold text-sm ${selectedModel === m.id ? 'text-indigo-900' : 'text-slate-700'}`}>{m.name}</h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">{m.desc}</p>
                {selectedModel === m.id && (
                  <div className="absolute -bottom-1 -right-1 opacity-10 group-hover:scale-110 transition-transform">
                    <m.icon className="w-16 h-16" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
            {/* Document Preview */}
            <div className="bg-slate-900 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 h-[500px]">
              {file?.type === 'application/pdf' ? (
                <iframe 
                  src={preview} 
                  className="w-full h-full" 
                  title="PDF Preview"
                />
              ) : (
                <div className="p-6 w-full h-full flex items-center justify-center">
                  <img src={preview} alt="Invoice preview" className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" />
                </div>
              )}
            </div>

            {/* Action Panel */}
            <div className="p-8 flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-800">Extracting with {MODELS.find(m => m.id === selectedModel)?.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate">{file?.name}</span>
                </div>
              </div>

              {isProcessing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-indigo-600 flex items-center gap-2 font-bold">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Vision Engine Processing...
                    </span>
                    <span className="text-slate-500 font-mono">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 rounded-xl">
                    <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">
                      {selectedModel} active
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-sm flex gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </div>
                  )}
                  
                  <button 
                    onClick={processInvoice}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                    Start AI Extraction
                  </button>
                  
                  <button 
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="w-full px-6 py-3 text-slate-500 font-medium hover:text-slate-700 transition-colors"
                  >
                    Cancel and Choose Another
                  </button>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Thai Tax OCR
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Cost Tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: "No Manual Entry", desc: "Automate your bookkeeping with high-precision AI models.", icon: FileText },
          { title: "Financial Integrity", desc: "Every extraction maps back to a verifiable JSON object.", icon: RefreshCw },
          { title: "Real-time Auditing", desc: "Track usage costs per invoice for complete transparency.", icon: UploadCloud }
        ].map((item, i) => (
          <div key={i} className="bg-white/50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
            <item.icon className="w-6 h-6 text-indigo-500 mb-3" />
            <h5 className="font-bold text-slate-800 mb-1">{item.title}</h5>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceUploader;
