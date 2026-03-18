import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { firebaseService } from '../services/firebaseService';
import type { Lead } from '../types';
import { weeklyLeadData, salesFunnelData, leadsSourceData, monthlyRevenueData } from '../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Download, TrendingUp, FileBarChart, Calendar, Users, Activity } from 'lucide-react';

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
    <div className="space-y-8 animate-slide-up">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue}L`, sub: 'Q1 2026 PERFORMANCE', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', shadow: 'shadow-emerald-100' },
          { label: 'Total Bookings', value: totalBookings, sub: '+12% FROM LAST MONTH', icon: FileBarChart, color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100', shadow: 'shadow-primary-100' },
          { label: 'Total Leads', value: totalLeads, sub: 'ACROSS ALL CHANNELS', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', shadow: 'shadow-purple-100' },
          { label: 'Avg. Deal Size', value: `₹${avgDealSize}L`, sub: 'PER CONFIRMED BOOKING', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', shadow: 'shadow-amber-100' },
        ].map(({ label, value, sub, icon: Icon, color, bg, border }, i) => (
          <div key={label} className="card-premium p-6 group hover:-translate-y-1 transition-all duration-500 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-soft-lg group-hover:scale-110 transition-transform", bg, border)}>
              <Icon className={clsx("w-7 h-7", color)} />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">{label}</p>
              <div className="flex items-center gap-1.5 mt-4">
                <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", color.replace('text', 'bg'))}></span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sub}</p>
              </div>
            </div>
            <div className={clsx("absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity", color.replace('text', 'bg'))}></div>
          </div>
        ))}
      </div>

      {/* Export Actions */}
      <div className="card-premium p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-none bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
            <Calendar className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-black tracking-wide uppercase">Fiscal Quarter Report</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Q1 2026 — JAN TO MAR · ALL REGIONS</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md border border-white/10 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary-500 hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2">
            <FileBarChart className="w-4 h-4" /> Generate PDF
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-premium p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Lead Inflow Velocity</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Weekly volume distribution</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5" /> High Performance
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyLeadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadsGradRep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickMargin={15} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#3b82f6" strokeWidth={3} fill="url(#leadsGradRep)" animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-premium p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Revenue Trajectory</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Monthly booking value (₹ Lakhs)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickMargin={15} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue (₹L)" fill="#10b981" radius={[6, 6, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-premium p-8">
          <div className="mb-8">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Channel Attribution</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Acquisition source breakdown</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12 py-4">
            <div className="relative">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie 
                    data={leadsSourceData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={8} 
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {leadsSourceData.map((entry, idx) => <Cell key={idx} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                 <p className="text-2xl font-black text-slate-900">100%</p>
                 <p className="text-[8px] font-black text-slate-400 tracking-widest uppercase">Coverage</p>
              </div>
            </div>
            <div className="flex-1 w-full space-y-4">
              {leadsSourceData.map(item => (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}></span>
                      <span className="text-slate-500">{item.name}</span>
                    </div>
                    <span className="text-slate-900">{item.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-premium p-8">
          <div className="mb-8">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Marketing Funnel Health</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Conversion efficiency by stage</p>
          </div>
          <div className="space-y-6">
            {salesFunnelData.map((item, i) => {
              const maxCount = salesFunnelData[0].count;
              const width = (item.count / maxCount) * 100;
              return (
                <div key={item.stage} className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Stage {i + 1}</p>
                      <p className="text-sm font-bold text-slate-800">{item.stage}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-slate-900">{item.count}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Leads Flowing</p>
                    </div>
                  </div>
                  <div className="bg-slate-100 rounded-2xl h-5 overflow-hidden shadow-inner border border-slate-50">
                    <div 
                      className="h-full rounded-2xl transition-all duration-[1.5s] relative group-hover:brightness-110" 
                      style={{ width: `${width}%`, background: item.color }}
                    >
                      <div className="absolute inset-0 bg-white/10 overflow-hidden">
                        <div className="h-full w-20 bg-white/20 -skew-x-[45deg] animate-pulse"></div>
                      </div>
                    </div>
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
