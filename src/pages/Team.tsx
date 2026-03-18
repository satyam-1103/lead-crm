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
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: agents.reduce((s, a) => s + a.bookings, 0), icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
          { label: 'Total Site Visits', value: agents.reduce((s, a) => s + a.siteVisits, 0), icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-100' },
          { label: 'Avg Conversion Rate', value: `${agents.length > 0 ? (agents.reduce((s, a) => s + a.conversionRate, 0) / agents.length).toFixed(1) : 0}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 border border-purple-100' },
          { label: 'Avg Response Time', value: '33 min', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-100' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bg)}>
              <Icon className={clsx('w-5 h-5', color)} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Leads vs Performance per Agent</h3>
          <p className="text-xs text-slate-400 mb-4">Leads Assigned, Site Visits, Bookings</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={agentChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Leads" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Site Visits" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Bookings" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Monthly Revenue from Bookings</h3>
          <p className="text-xs text-slate-400 mb-4">Revenue in Lakhs</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="Revenue (₹L)" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
              <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Agent Leaderboard</h3>
          <span className="badge badge-new text-[10px]">Q1 2026</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/30">
              {['Rank', 'Agent', 'Role', 'Leads Assigned', 'Site Visits', 'Bookings', 'Conversion Rate', 'Avg Response', 'Revenue'].map(h => (
                <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((agent, idx) => (
              <tr key={agent.id} className="table-row-hover">
                <td className="px-4 py-3.5">
                  <span className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                    idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                    idx === 1 ? 'bg-slate-100 text-slate-500' :
                    idx === 2 ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400'
                  )}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={clsx('w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0', AGENT_COLORS[agent.name])}>
                      {AGENT_INITIALS[agent.name]}
                    </div>
                    <span className="font-semibold text-slate-700">{agent.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-400 text-xs">{agent.role}</td>
                <td className="px-4 py-3.5 text-slate-600 font-medium text-center">{agent.leadsAssigned}</td>
                <td className="px-4 py-3.5 text-slate-600 font-medium text-center">{agent.siteVisits}</td>
                <td className="px-4 py-3.5 text-center"><span className="badge badge-booked">{agent.bookings}</span></td>
                <td className="px-4 py-3.5 text-center">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full" style={{ width: `${agent.conversionRate * 3}%` }}></div>
                    </div>
                    <span className="text-slate-600 text-xs font-medium w-10 text-right">{agent.conversionRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={clsx('text-xs font-medium', parseInt(agent.avgResponseTime) > 40 ? 'text-red-500' : parseInt(agent.avgResponseTime) > 30 ? 'text-yellow-600' : 'text-green-600')}>
                    {agent.avgResponseTime}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 text-xs font-medium text-right">₹{(agent.revenue / 10000000).toFixed(1)}Cr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
