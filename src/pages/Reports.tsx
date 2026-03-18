import { useEffect, useState } from 'react';
import { firebaseService } from '../services/firebaseService';
import type { Lead } from '../types';
import { weeklyLeadData, salesFunnelData, leadsSourceData, monthlyRevenueData } from '../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Download, TrendingUp, FileBarChart, Calendar } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xl text-xs">
        <p className="text-slate-500 mb-1 font-medium">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      const fetched = await firebaseService.getLeads();
      setLeads(fetched);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const totalRevenue = 1450; // Lakhs (Keep static for now or calculate if revenue field exists)
  const totalBookings = leads.filter(l => l.status === 'Booked').length;
  const totalLeads = leads.length;
  const avgDealSize = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue}L`, sub: 'Q1 2026', color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
          { label: 'Total Bookings', value: totalBookings, sub: 'This quarter', color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-100' },
          { label: 'Total Leads', value: totalLeads, sub: 'All channels', color: 'text-purple-600', bg: 'bg-purple-50 border border-purple-100' },
          { label: 'Avg. Deal Size', value: `₹${avgDealSize}L`, sub: 'Per booking', color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-100' },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <TrendingUp className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Export Actions */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Q1 2026 — Jan to Mar</span>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs h-9"><Download className="w-3.5 h-3.5" /> Export CSV</button>
          <button className="btn-secondary text-xs h-9"><FileBarChart className="w-3.5 h-3.5" /> Export PDF</button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Weekly Lead Volume</h3>
          <p className="text-xs text-slate-400 mb-4">New leads received per week</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyLeadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadsGradR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#0ea5e9" strokeWidth={2} fill="url(#leadsGradR)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Monthly Revenue Comparison</h3>
          <p className="text-xs text-slate-400 mb-4">Revenue (₹L) from bookings over months</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyRevenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue (₹L)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Source Performance Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Channel-wise percentage distribution</p>
          <div className="flex flex-col md:flex-row items-center gap-8 py-2">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={leadsSourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {leadsSourceData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 w-full space-y-2.5">
              {leadsSourceData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}></span>
                    <span className="text-slate-500 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-700">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Conversion Funnel Efficiency</h3>
          <p className="text-xs text-slate-400 mb-4">Success percentage at each stage</p>
          <div className="space-y-3 py-2">
            {salesFunnelData.map((item) => {
              const maxCount = salesFunnelData[0].count;
              const width = (item.count / maxCount) * 100;
              return (
                <div key={item.stage} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>{item.stage}</span>
                    <span>{item.count} Leads</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${width}%`, background: item.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
