import { Bell, Search, Plus, ChevronDown } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="animate-fade-in">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden lg:flex items-center group">
          <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search leads, agents..."
            className="input-field pl-11 w-72 h-11 text-sm bg-slate-100/50 border-transparent hover:bg-slate-100 focus:bg-white transition-all duration-300"
          />
          <div className="absolute right-3 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-400 shadow-sm">
            ⌘K
          </div>
        </div>

        {/* Add Lead Button */}
        <button className="btn-primary h-11 px-6 shadow-lg shadow-primary-500/20">
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span className="hidden sm:inline">Add New Lead</span>
          <span className="sm:hidden text-lg">+</span>
        </button>

        {/* Notifications */}
        <button className="relative w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:border-primary-100 hover:bg-primary-50 transition-all duration-300 shadow-soft-sm">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200/60 cursor-pointer group">
          <div className="flex flex-col items-end hidden sm:flex">
            <p className="text-xs font-bold text-slate-900 group-hover:text-primary-600 transition-colors">Sales Admin</p>
            <p className="text-[10px] font-medium text-slate-400">Available</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center text-white text-xs font-black shadow-md rotate-3 group-hover:rotate-0 transition-transform duration-300">
              SA
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-all duration-300 group-hover:translate-y-0.5" />
        </div>
      </div>
    </header>
  );
}
