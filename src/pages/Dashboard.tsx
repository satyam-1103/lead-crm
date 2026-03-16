import {
  AreaChart, Area, PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Users, UserCheck, TrendingUp, MapPin, CheckCircle, Percent, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { mockLeads, leadsSourceData, salesFunnelData, weeklyLeadData } from '../data/mockData';

const stats = [
  { label: 'Total Leads', value: '248', change: '+18%', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-100' },
  { label: 'Leads Assigned', value: '197', change: '+12%', up: true, icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50 border border-purple-100' },
  { label: 'Qualified Leads', value: '124', change: '+9%', up: true, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 border border-indigo-100' },
  { label: 'Site Visits Scheduled', value: '68', change: '+22%', up: true, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-100' },
  { label: 'Bookings Closed', value: '18', change: '-3%', up: false, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
  { label: 'Conversion Rate', value: '7.3%', change: '+1.2%', up: true, icon: Percent, color: 'text-pink-600', bg: 'bg-pink-50 border border-pink-100' },
];

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
  const recentLeads = mockLeads.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card col-span-1">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Lead Growth */}
        <div className="card p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Weekly Lead Growth</h3>
              <p className="text-xs text-slate-400 mt-0.5">Leads received vs converted over 8 weeks</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-primary-500"></span>Leads</span>
              <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Converted</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyLeadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="convertedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#0ea5e9" strokeWidth={2} fill="url(#leadsGrad)" />
              <Area type="monotone" dataKey="converted" name="Converted" stroke="#10b981" strokeWidth={2} fill="url(#convertedGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Source */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Leads by Source</h3>
          <p className="text-xs text-slate-400 mb-4">Distribution across channels</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={leadsSourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {leadsSourceData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Share']} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {leadsSourceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }}></span>
                  <span className="text-slate-500">{item.name}</span>
                </div>
                <span className="text-slate-700 font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Funnel */}
        <div className="card p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Sales Funnel</h3>
              <p className="text-xs text-slate-400 mt-0.5">Lead journey from inquiry to booking</p>
            </div>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-2">
            {salesFunnelData.map((item, idx) => {
              const maxCount = salesFunnelData[0].count;
              const width = (item.count / maxCount) * 100;
              return (
                <div key={item.stage} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-28 text-right flex-shrink-0">{item.stage}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-7 overflow-hidden relative">
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700"
                      style={{ width: `${width}%`, background: item.color }}
                    >
                      <span className="text-xs font-semibold text-white drop-shadow-sm">{item.count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-8 flex-shrink-0">{idx === 0 ? '100%' : `${Math.round((item.count / salesFunnelData[0].count) * 100)}%`}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Recent Leads</h3>
            <a href="/leads" className="text-xs text-primary-600 hover:text-primary-500 transition-colors">View all →</a>
          </div>
          <div className="space-y-3">
            {recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{lead.name}</p>
                  <p className="text-xs text-slate-400 truncate">{lead.propertyInterest} · {lead.source}</p>
                </div>
                <span className={`badge ${
                  lead.status === 'New Lead' ? 'badge-new' :
                  lead.status === 'Contacted' ? 'badge-contacted' :
                  lead.status === 'Interested' ? 'badge-interested' :
                  lead.status === 'Booked' ? 'badge-booked' :
                  lead.status === 'Lost' ? 'badge-lost' : 'badge-sitevisit'
                } text-[10px]`}>
                  {lead.status === 'Site Visit Scheduled' ? 'Visit' : lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
