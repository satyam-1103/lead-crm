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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-40 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-md shadow-primary-500/25">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">LeadEstate</h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Real Estate CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Main Menu</p>
        {navItems.slice(0, 6).map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {path === '/whatsapp' && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
            )}
          </NavLink>
        ))}

        <p className="px-3 pt-4 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Analytics</p>
        {navItems.slice(6).map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom User Card */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">Sales Admin</p>
            <p className="text-[11px] text-slate-400 truncate">admin@leadestate.in</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
