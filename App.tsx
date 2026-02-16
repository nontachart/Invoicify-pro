
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InvoiceUploader from './components/InvoiceUploader';
import InvoiceTable from './components/InvoiceTable';
import ExtractionResult from './components/ExtractionResult';
import InvoiceDetail from './components/InvoiceDetail';
import { InvoiceData } from './types';

// Initial Mock Data updated to nested structure
const MOCK_INVOICES: InvoiceData[] = [
  {
    invoice: {
      id: '1',
      invoiceNumber: 'INV-2023-001',
      date: '2023-11-15',
      dueDate: '2023-12-15',
      category: 'SaaS',
      status: 'paid',
      imageUrl: 'https://picsum.photos/seed/aws/600/800',
      currency: '฿',
    },
    seller: {
      name: 'AWS Cloud Services',
      taxId: '1234567890123',
      branch: 'Head Office',
      address: 'Seattle, WA'
    },
    customer: {
      name: 'My SME Co., Ltd.',
      taxId: '9876543210987',
      address: 'Bangkok, Thailand'
    },
    lineItems: [{ description: 'EC2 Instance x10', quantity: 1, unitPrice: 450, total: 450 }],
    summary: {
      subtotal: 450,
      taxAmount: 45,
      totalAmount: 495,
    }
  },
  {
    invoice: {
      id: '2',
      invoiceNumber: 'STR-993-22',
      date: '2023-11-20',
      dueDate: '2023-12-20',
      category: 'SaaS',
      status: 'verified',
      imageUrl: 'https://picsum.photos/seed/stripe/600/800',
      currency: '฿',
    },
    seller: {
      name: 'Stripe Payments',
      taxId: '5555555555555',
      branch: '00000',
    },
    customer: {},
    lineItems: [{ description: 'Platform Fee', quantity: 1, unitPrice: 120, total: 120 }],
    summary: {
      subtotal: 120,
      taxAmount: 0,
      totalAmount: 120,
    }
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [invoices, setInvoices] = useState<InvoiceData[]>(MOCK_INVOICES);
  const [processingInvoice, setProcessingInvoice] = useState<InvoiceData | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceData | null>(null);

  const handleInvoiceProcessed = (data: InvoiceData) => {
    setProcessingInvoice(data);
  };

  const handleSaveInvoice = (finalData: InvoiceData) => {
    setInvoices(prev => {
      const exists = prev.find(inv => inv.invoice.id === finalData.invoice.id);
      if (exists) {
        return prev.map(inv => inv.invoice.id === finalData.invoice.id ? finalData : inv);
      }
      return [finalData, ...prev];
    });
    setProcessingInvoice(null);
    setViewingInvoice(null);
    setActiveTab('invoices');
  };

  const handleViewInvoice = (invoice: InvoiceData) => {
    setViewingInvoice(invoice);
  };

  const handleEditInvoice = (invoice: InvoiceData) => {
    setProcessingInvoice(invoice);
    setViewingInvoice(null);
  };

  const handleCloseDetail = () => {
    setViewingInvoice(null);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {processingInvoice ? (
        <ExtractionResult 
          data={processingInvoice} 
          onSave={handleSaveInvoice}
          onCancel={() => setProcessingInvoice(null)} 
        />
      ) : viewingInvoice ? (
        <InvoiceDetail 
          invoice={viewingInvoice} 
          onClose={handleCloseDetail}
          onEdit={handleEditInvoice}
        />
      ) : (
        <>
          {activeTab === 'dashboard' && <Dashboard invoices={invoices} />}
          {activeTab === 'invoices' && (
            <InvoiceTable 
              invoices={invoices} 
              onViewInvoice={handleViewInvoice} 
            />
          )}
          {activeTab === 'upload' && <InvoiceUploader onProcessed={handleInvoiceProcessed} />}
          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
              <h3 className="text-xl font-bold">Account Settings</h3>
              <p className="text-slate-500">Integration and company profile settings would go here.</p>
              <div className="w-1/2 mx-auto pt-8 border-t border-slate-100">
                <p className="text-xs text-slate-400">Invoicify Pro v1.0.0</p>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
