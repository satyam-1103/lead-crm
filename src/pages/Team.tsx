import { useEffect, useState } from 'react';
import { firebaseService } from '../services/firebaseService';
import type { Agent } from '../types';
import { monthlyRevenueData } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import clsx from 'clsx';

const AGENT_COLORS: Record<string, string> = {
  'Priya Mehta': 'from-primary-500 to-cyan-500',
  'Arjun Singh': 'from-purple-500 to-violet-500',
  'Sneha Kapoor': 'from-pink-500 to-rose-500',
  'Raj Verma': 'from-amber-500 to-orange-500',
};
const AGENT_INITIALS: Record<string, string> = { 'Priya Mehta': 'PM', 'Arjun Singh': 'AS', 'Sneha Kapoor': 'SK', 'Raj Verma': 'RV' };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Team() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      const fetchedAgents = await firebaseService.getAgents();
      setAgents(fetchedAgents);
      setLoading(false);
    };
    fetchAgents();
  }, []);

  const sorted = [...agents].sort((a, b) => b.bookings - a.bookings);

  const agentChartData = agents.map(a => ({
    name: a.name.split(' ')[0],
    Leads: a.leadsAssigned,
    'Site Visits': a.siteVisits,
    Bookings: a.bookings,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: agents.reduce((s, a) => s + a.bookings, 0), icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Total Site Visits', value: agents.reduce((s, a) => s + a.siteVisits, 0), icon: Target, color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100' },
          { label: 'Avg Conversion', value: `${agents.length > 0 ? (agents.reduce((s, a) => s + a.conversionRate, 0) / agents.length).toFixed(1) : 0}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
          { label: 'Response Time', value: '33 min', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map(({ label, value, icon: Icon, color, bg, border }, i) => (
          <div key={label} className="card-premium p-6 group hover:-translate-y-1 transition-all duration-500 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-soft-lg group-hover:scale-110 transition-transform", bg, border)}>
              <Icon className={clsx("w-7 h-7", color)} />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-premium p-8">
          <h3 className="text-base font-black text-slate-900 tracking-tight mb-1">Performance Benchmarks</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Agent-wise funnel efficiency</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agentChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Leads" fill="#3b82f6" radius={[6, 6, 0, 0]} animationDuration={1500} />
              <Bar dataKey="Site Visits" fill="#a855f7" radius={[6, 6, 0, 0]} animationDuration={1500} />
              <Bar dataKey="Bookings" fill="#10b981" radius={[6, 6, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-premium p-8">
          <h3 className="text-base font-black text-slate-900 tracking-tight mb-1">Revenue Generation</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Booking value over time (₹ Lakhs)</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyRevenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#f59e0b" strokeWidth={4} dot={{ fill: '#f59e0b', r: 5, strokeWidth: 2, stroke: '#fff' }} animationDuration={2000} />
              <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }} animationDuration={2000} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-premium overflow-hidden border-none shadow-soft-xl">
        <div className="px-8 py-6 border-b border-slate-50 bg-white/50 backdrop-blur-md flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Agent Performance Leaderboard</h3>
            <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mt-1">Real-time Workspace Statistics</p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black tracking-[0.15em]">FISCAL Q1 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50">
                {['Rank', 'Agent Identity', 'Role', 'Metrics & Funnels', 'Performance Index', 'Revenue Impact'].map((h, i) => (
                  <th key={h} className={clsx("px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]", i > 2 && "text-center")}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sorted.map((agent, idx) => (
                <tr key={agent.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className={clsx('w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black shadow-soft-md group-hover:scale-110 transition-transform',
                      idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white' :
                      idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white' :
                      idx === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-600 text-white' : 'bg-slate-100 text-slate-500'
                    )}>
                      {idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={clsx('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-black shadow-lg shadow-slate-100', AGENT_COLORS[agent.name])}>
                        {AGENT_INITIALS[agent.name]}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none">{agent.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest leading-none">Employee ID · RE-{agent.id.slice(0, 4)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-100">{agent.role}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-8">
                       <div className="text-center">
                          <p className="text-base font-black text-slate-900 leading-none">{agent.leadsAssigned}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Leads</p>
                       </div>
                       <div className="text-center">
                          <p className="text-base font-black text-slate-900 leading-none">{agent.siteVisits}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Visits</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4 max-w-[140px] mx-auto">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full" style={{ width: `${agent.conversionRate * 3}%` }}></div>
                      </div>
                      <span className="text-slate-900 text-xs font-black w-10 text-right">{agent.conversionRate}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <p className="text-sm font-black text-slate-900">₹{(agent.revenue / 10000000).toFixed(1)} Cr</p>
                    <p className={clsx('text-[10px] font-black uppercase tracking-widest mt-1', parseInt(agent.avgResponseTime) > 35 ? 'text-rose-500' : 'text-emerald-500')}>
                      {agent.avgResponseTime} RESP. TIME
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
