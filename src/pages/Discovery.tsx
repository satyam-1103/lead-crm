import { useEffect, useState } from 'react';
import { firebaseService } from '../services/firebaseService';
import type { LinkedInProspect } from '../types';
import { Search, Plus, Building2, MapPin, Users, Mail, ExternalLink, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function Discovery() {
  const [search, setSearch] = useState('');
  const [prospects, setProspects] = useState<LinkedInProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProspects = async () => {
      const fetched = await firebaseService.getProspects();
      setProspects(fetched);
      setLoading(false);
    };
    fetchProspects();
  }, []);

  const filtered = prospects.filter((p: LinkedInProspect) => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.company.toLowerCase().includes(search.toLowerCase()) ||
    p.industry.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleAddToCRM = (id: string) => {
    setAddedIds(prev => [...prev, id]);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Filters Card */}
      <div className="card-premium p-6 border-none shadow-soft-xl bg-white/80 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, company, or industry..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field w-full pl-12 h-12 text-sm font-medium bg-slate-50 border-slate-100 hover:bg-white focus:bg-white transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="select-field text-[11px] h-12 px-4 min-w-[140px] font-bold uppercase tracking-widest">
              <option>All Locations</option>
              <option>Bangalore</option>
              <option>Mumbai</option>
              <option>Delhi NCR</option>
            </select>
            <select className="select-field text-[11px] h-12 px-4 min-w-[140px] font-bold uppercase tracking-widest">
              <option>All Industries</option>
              <option>Real Estate</option>
              <option>Tech</option>
              <option>Finance</option>
            </select>
            <button className="px-6 h-12 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              <Building2 className="w-4 h-4" />
              SAVED AUDIENCE
            </button>
          </div>
        </div>
        
        <div className="flex gap-2.5 mt-6 flex-wrap">
          {['DEVELOPERS', 'BUILDERS', 'INVESTORS', 'CONSULTANTS', 'GLOBAL FUNDS'].map(tag => (
            <button key={tag} className="px-4 py-1.5 rounded-xl bg-white border border-slate-100 text-slate-500 text-[9px] font-black tracking-widest hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all">
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((prospect: LinkedInProspect, pIdx: number) => (
          <div key={prospect.id} className="card-premium p-6 flex flex-col group animate-fade-in border-none bg-white shadow-soft-lg hover:shadow-premium transition-all duration-500" style={{ animationDelay: `${pIdx * 100}ms` }}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-primary-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform">
                  {prospect.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 flex items-center gap-2 text-base leading-none">
                    {prospect.name}
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                  </h4>
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">{prospect.title} @ <span className="text-primary-600 font-black">{prospect.company}</span></p>
                </div>
              </div>
              <span className="badge-new text-[9px] font-black tracking-widest bg-emerald-50 text-emerald-600 border-none px-2 py-1">VERIFIED</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="space-y-3">
                 <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" />
                  <span>{prospect.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Building2 className="w-3.5 h-3.5 text-primary-500" />
                  <span>{prospect.industry}</span>
                </div>
              </div>
              <div className="space-y-3">
                 <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Users className="w-3.5 h-3.5 text-primary-500" />
                  <span>{prospect.connections}+ Connects</span>
                </div>
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Mail className="w-3.5 h-3.5 text-primary-500" />
                  <span>Direct Email</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-slate-50 mt-auto">
              <button 
                onClick={() => handleAddToCRM(prospect.id)}
                disabled={addedIds.includes(prospect.id)}
                className={clsx(
                  "flex-1 h-12 text-[10px] rounded-2xl font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95",
                  addedIds.includes(prospect.id) 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none" 
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                )}
              >
                {addedIds.includes(prospect.id) ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> ADDED TO CRM</>
                ) : (
                  <><Plus className="w-3.5 h-3.5" /> IMPORT LEAD</>
                )}
              </button>
              <button className="w-12 h-12 flex items-center justify-center border border-slate-100 rounded-2xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-100 transition-all shadow-sm">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
