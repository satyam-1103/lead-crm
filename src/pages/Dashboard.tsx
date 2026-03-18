import {
  AreaChart, Area, PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Users, TrendingUp, MapPin, CheckCircle, Percent, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { firebaseService } from '../services/firebaseService';
import type { Lead } from '../types';
import { leadsSourceData, salesFunnelData, weeklyLeadData } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-xs">
        <p className="text-slate-500 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToLeads((fetchedLeads) => {
      setLeads(fetchedLeads);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const recentLeads = leads.slice(0, 5);
  
  // Calculate dynamic stats from leads
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === 'Interested' || l.status === 'Negotiation' || l.status === 'Booked').length;
  const siteVisits = leads.filter(l => l.status === 'Site Visit Scheduled').length;
  const bookings = leads.filter(l => l.status === 'Booked').length;
  const conversionRate = totalLeads > 0 ? ((bookings / totalLeads) * 100).toFixed(1) : '0';

  const dynamicStats = [
    { label: 'Total Leads', value: totalLeads.toString(), change: '+18%', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-100' },
    { label: 'Qualified Leads', value: qualifiedLeads.toString(), change: '+9%', up: true, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 border border-indigo-100' },
    { label: 'Site Visits', value: siteVisits.toString(), change: '+22%', up: true, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-100' },
    { label: 'Bookings', value: bookings.toString(), change: '-3%', up: false, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, change: '+1.2%', up: true, icon: Percent, color: 'text-pink-600', bg: 'bg-pink-50 border border-pink-100' },
    { label: 'Avg Response', value: '28 min', change: '+5%', up: true, icon: Activity, color: 'text-slate-600', bg: 'bg-slate-50 border border-slate-100' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {dynamicStats.map(({ label, value, change, up, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className={clsx(
                "px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors",
                up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={clsx("h-full rounded-full transition-all duration-1000 delay-300", 
                  label === 'Bookings' ? 'bg-emerald-500 w-[65%]' : 
                  label === 'Total Leads' ? 'bg-primary-500 w-[80%]' : 'bg-slate-300 w-[40%]'
                )}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Lead Growth */}
        <div className="card-premium p-7 col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Weekly Lead Growth</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Growth analytics for the last 8 weeks</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
              <button className="px-4 py-1.5 rounded-lg bg-white shadow-sm text-xs font-bold text-primary-600">Leads</button>
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700">Earnings</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyLeadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0e8ce9" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0e8ce9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="convertedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#0e8ce9" strokeWidth={4} fill="url(#leadsGrad)" animationDuration={2000} />
              <Area type="monotone" dataKey="converted" name="Converted" stroke="#10b981" strokeWidth={4} fill="url(#convertedGrad)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Source */}
        <div className="card-premium p-7">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Lead Sources</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Multi-channel distribution</p>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={leadsSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                  {leadsSourceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} contentStyle={{ background: '#fff', border: 'none', borderRadius: 12, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Coverage</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-8">
            {leadsSourceData.map((item) => (
              <div key={item.name} className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }}></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Funnel */}
        <div className="card-premium p-7 col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Sales Funnel</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Lead conversion lifecycle efficiency</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <div className="space-y-4">
            {salesFunnelData.map((item, idx) => {
              const maxCount = salesFunnelData[0].count;
              const width = (item.count / maxCount) * 100;
              return (
                <div key={item.stage} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-bold text-slate-700">{item.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{item.count}</span>
                      <span className="text-[10px] font-bold text-slate-400">
                        ({idx === 0 ? '100' : Math.round((item.count / salesFunnelData[0].count) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${width}%`, background: item.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="card-premium p-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Top Prospects</h3>
            <button className="p-2 rounded-xl text-primary-600 hover:bg-primary-50 transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {recentLeads.map((lead, idx) => (
              <div key={lead.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all duration-300 cursor-pointer group animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-premium flex items-center justify-center text-white text-sm font-black shadow-md group-hover:scale-110 transition-transform">
                    {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors">{lead.name}</p>
                  <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{lead.propertyInterest} · {lead.source}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 font-sans">
                  <span className={clsx('badge-new text-[8px] sm:text-[10px]', 
                    lead.status === 'New Lead' ? 'badge-new' :
                    lead.status === 'Contacted' ? 'badge-contacted' :
                    lead.status === 'Interested' ? 'badge-interested' :
                    lead.status === 'Booked' ? 'badge-booked' :
                    lead.status === 'Lost' ? 'badge-lost' : 'badge-sitevisit'
                  )}>
                    {lead.status === 'Site Visit Scheduled' ? 'Visit' : lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
