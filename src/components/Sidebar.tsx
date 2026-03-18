import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Kanban, MessageCircle, Search,
  BarChart2, Settings, TrendingUp, Building2, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/leads', label: 'Leads', icon: Users },
  { path: '/pipeline', label: 'Pipeline', icon: Kanban },
  { path: '/whatsapp', label: 'WhatsApp Automation', icon: MessageCircle },
  { path: '/discovery', label: 'Lead Discovery', icon: Search },
  { path: '/team', label: 'Team Performance', icon: BarChart2 },
  { path: '/reports', label: 'Reports', icon: TrendingUp },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40 flex flex-col shadow-soft-xl">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-primary-500/20 active:scale-95 transition-transform cursor-pointer">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight">LeadEstate</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Live CRM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="px-4 pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Platform</p>
        {navItems.slice(0, 6).map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
              isActive 
                ? "bg-primary-500/10 text-primary-400 border border-primary-500/20" 
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            )}
          >
            <Icon className={clsx("w-5 h-5 transition-transform duration-300 group-hover:scale-110")} />
            <span className="text-sm font-semibold tracking-wide">{label}</span>
            {path === '/whatsapp' && (
              <span className="absolute right-4 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-lg shadow-emerald-500/30">3</span>
            )}
          </NavLink>
        ))}

        <p className="px-4 pt-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Analytics</p>
        {navItems.slice(6).map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
              isActive 
                ? "bg-primary-500/10 text-primary-400 border border-primary-500/20" 
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
            )}
          >
            <Icon className={clsx("w-5 h-5 transition-transform duration-300 group-hover:scale-110")} />
            <span className="text-sm font-semibold tracking-wide">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom User Card */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-premium flex items-center justify-center text-white text-xs font-bold shadow-md shadow-primary-900/40">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-100 truncate">Sales Admin</p>
            <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">Administrator</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
