
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DollarSign, FileCheck, Clock, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { InvoiceData, DashboardStats } from '../types';

interface DashboardProps {
  invoices: InvoiceData[];
}

const Dashboard: React.FC<DashboardProps> = ({ invoices }) => {
  const stats: DashboardStats = {
    totalSpent: invoices.reduce((acc, inv) => acc + inv.summary.totalAmount, 0),
    invoiceCount: invoices.length,
    pendingCount: invoices.filter(inv => inv.invoice.status === 'pending').length || 0,
    monthlyTrend: [
      { month: 'Jan', amount: 1200 },
      { month: 'Feb', amount: 1900 },
      { month: 'Mar', amount: 1500 },
      { month: 'Apr', amount: 2100 },
      { month: 'May', amount: 1800 },
      { month: 'Jun', amount: 2400 },
    ]
  };

  const statCards = [
    { label: 'Total Spent', value: `฿${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%', isUp: true },
    { label: 'Total Invoices', value: stats.invoiceCount.toString(), icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+4.3%', isUp: true },
    { label: 'Pending Review', value: stats.pendingCount.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2.1%', isUp: false },
    { label: 'Avg. Invoice', value: `฿${(stats.totalSpent / (stats.invoiceCount || 1)).toFixed(2)}`, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+0.4%', isUp: true },
  ];

  const categoryData = [
    { name: 'SaaS', value: 400, color: '#6366f1' },
    { name: 'Rent', value: 1200, color: '#10b981' },
    { name: 'Supplies', value: 300, color: '#f59e0b' },
    { name: 'Marketing', value: 500, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${card.isUp ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'}`}>
                {card.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expenditure Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Monthly Expenditure</h3>
            <select className="text-sm border-slate-200 rounded-lg bg-slate-50 px-3 py-1 text-slate-600 outline-none">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrend}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `฿${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`฿${value}`, 'Expenditure']}
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Spend by Category</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: cat.color}}></div>
                  <span className="text-slate-600">{cat.name}</span>
                </div>
                <span className="font-semibold text-slate-900">฿{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
