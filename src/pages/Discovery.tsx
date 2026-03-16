import { useState } from 'react';
import { mockLinkedInProspects } from '../data/mockData';
import type { LinkedInProspect } from '../types';
import { Search, Plus, Building2, MapPin, Users, Mail, ExternalLink, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function Discovery() {
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const filtered = mockLinkedInProspects.filter((p: LinkedInProspect) => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.company.toLowerCase().includes(search.toLowerCase()) ||
    p.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCRM = (id: string) => {
    setAddedIds(prev => [...prev, id]);
  };

  return (
    <div className="space-y-5">
      {/* Filters Card */}
      <div className="card p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, company, or industry..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field w-full pl-9"
            />
          </div>
          <div className="flex gap-2">
            <select className="select-field text-xs">
              <option>All Locations</option>
              <option>Bangalore</option>
              <option>Mumbai</option>
              <option>Delhi NCR</option>
            </select>
            <select className="select-field text-xs">
              <option>All Industries</option>
              <option>Real Estate</option>
              <option>Tech</option>
              <option>Finance</option>
            </select>
            <button className="btn-secondary text-xs h-9">
              <Building2 className="w-3.5 h-3.5" />
              Saved Search
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 flex-wrap">
          {['Developers', 'Builders', 'Investors', 'Consultants', 'Global Funds'].map(tag => (
            <button key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold hover:bg-slate-200 transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((prospect: LinkedInProspect) => (
          <div key={prospect.id} className="card p-5 flex flex-col hover:border-slate-300 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {prospect.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 leading-none">
                    {prospect.name}
                    <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-primary-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{prospect.title} @ {prospect.company}</p>
                </div>
              </div>
              <span className="badge-new text-[10px]">New Prospect</span>
            </div>

            <div className="space-y-2 mb-5 flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{prospect.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{prospect.industry}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{prospect.connections} connections</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Verified Work Email</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
              <button 
                onClick={() => handleAddToCRM(prospect.id)}
                disabled={addedIds.includes(prospect.id)}
                className={clsx(
                  "flex-1 h-9 text-xs rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
                  addedIds.includes(prospect.id) 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                    : "bg-primary-600 text-white hover:bg-primary-500 shadow-sm"
                )}
              >
                {addedIds.includes(prospect.id) ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" /> Added to CRM</>
                ) : (
                  <><Plus className="w-3.5 h-3.5" /> Add to CRM</>
                )}
              </button>
              <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
