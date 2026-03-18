import { useEffect, useState } from 'react';
import { firebaseService } from '../services/firebaseService';
import type { Lead, LeadStatus } from '../types';
import {
  Search, Filter, Edit2, User, Phone, Mail,
  X, Clock, MessageSquare, CheckCircle
} from 'lucide-react';
import clsx from 'clsx';

const STATUS_CLASSES: Record<LeadStatus, string> = {
  'New Lead': 'badge-new',
  'Contacted': 'badge-contacted',
  'Interested': 'badge-interested',
  'Site Visit Scheduled': 'badge-sitevisit',
  'Negotiation': 'badge-negotiation',
  'Booked': 'badge-booked',
  'Lost': 'badge-lost',
};

const ALL_STATUSES: LeadStatus[] = ['New Lead', 'Contacted', 'Interested', 'Site Visit Scheduled', 'Negotiation', 'Booked', 'Lost'];

function formatBudget(min: number, max: number) {
  const fmt = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : `₹${(n / 100000).toFixed(0)}L`;
  return `${fmt(min)} – ${fmt(max)}`;
}

interface LeadModalProps {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
}

function LeadModal({ lead, onClose, onStatusChange }: LeadModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white border-none rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-premium animate-scale-up" onClick={e => e.stopPropagation()}>
        <div className="p-8 border-b border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-indigo-600"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-100">
                {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{lead.name}</h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{lead.propertyInterest} · <span className="text-primary-600">{lead.preferredLocation}</span></p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm font-bold text-slate-700">{lead.phone}</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm font-bold text-slate-700">{lead.email}</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                <User className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm font-bold text-slate-700">{lead.assignedAgent}</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Since {new Date(lead.lastContact).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Budget Range', value: formatBudget(lead.budgetMin, lead.budgetMax), color: 'text-emerald-600' },
              { label: 'Acquisition Source', value: lead.source, color: 'text-primary-600' },
              { label: 'Asset Type', value: lead.propertyInterest, color: 'text-indigo-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 hover:border-primary-100 transition-colors">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
                <p className={clsx("text-xs font-black uppercase tracking-wider", color)}>{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Lifecycle Status</p>
            <div className="flex flex-wrap gap-2.5">
              {ALL_STATUSES.map(status => (
                <button
                  key={status}
                  onClick={() => { onStatusChange(lead.id, status); onClose(); }}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all duration-300 transform active:scale-95 border-2',
                    STATUS_CLASSES[status],
                    lead.status === status ? 'border-primary-500 shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Professional Discovery Notes</p>
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 relative group">
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 className="w-3.5 h-3.5 text-primary-400 cursor-pointer" />
               </div>
               <p className="text-sm font-medium text-slate-600 leading-loose italic">"{lead.notes || 'No confidential discovery notes recorded for this asset lead yet.'}"</p>
            </div>
          </div>

          {lead.timeline.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-1">Communication Log</p>
              <div className="space-y-6 relative ml-4">
                <div className="absolute left-[-17px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                {lead.timeline.map((event, eIdx) => (
                  <div key={event.id} className="flex gap-4 relative animate-fade-in" style={{ animationDelay: `${eIdx * 100}ms` }}>
                    <div className={clsx(
                      "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 z-10 shadow-sm transition-transform hover:scale-110",
                      event.type === 'call' ? 'bg-primary-500 text-white shadow-primary-200' :
                      event.type === 'whatsapp' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                      'bg-indigo-500 text-white shadow-indigo-200'
                    )} style={{ marginLeft: '-33px' }}>
                      {event.type === 'call' ? <Phone className="w-3.5 h-3.5" /> :
                       event.type === 'email' ? <Mail className="w-3.5 h-3.5" /> :
                       event.type === 'whatsapp' ? <MessageSquare className="w-3.5 h-3.5" /> :
                       <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-50 group hover:border-slate-200 transition-all shadow-soft-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{event.agent}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(event.timestamp).toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">{event.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    // We can use subscribeToLeads for real-time updates
    const unsubscribe = firebaseService.subscribeToLeads((fetchedLeads) => {
      setLeads(fetchedLeads);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchSource = sourceFilter === 'All' || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      await firebaseService.updateLeadStatus(id, status);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="card-premium p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="input-field w-full pl-12 h-12 bg-slate-50/50 border-slate-100 hover:bg-slate-100 focus:bg-white transition-all duration-300 shadow-none"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setCurrentPage(1); }} className="select-field h-12 px-5 min-w-[160px] cursor-pointer">
              <option value="All">All Statuses</option>
              {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setCurrentPage(1); }} className="select-field h-12 px-5 min-w-[160px] cursor-pointer">
              <option value="All">All Sources</option>
              {['Google Ads', 'Facebook Ads', 'Website', 'WhatsApp', 'LinkedIn', 'Property Portal'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="btn-secondary h-12 px-6">
              <Filter className="w-4 h-4" /> 
              <span className="hidden sm:inline">Advanced Filters</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4 px-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{filtered.length} Leads Active</p>
          </div>
          <div className="flex gap-2 flex-wrap items-center justify-center sm:justify-end">
            {ALL_STATUSES.map(s => {
              const count = leads.filter(l => l.status === s).length;
              if (count === 0 && statusFilter !== s) return null;
              return (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                  className={clsx(
                    'badge text-[10px] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95', 
                    STATUS_CLASSES[s], 
                    statusFilter === s ? 'ring-2 ring-primary-500 ring-offset-2' : 'opacity-70 hover:opacity-100'
                  )}
                >
                  {s.replace('Site Visit Scheduled', 'Visit')} ({count})
                </button>
              );
            })}
            {statusFilter !== 'All' && (
              <button 
                onClick={() => setStatusFilter('All')}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card-premium overflow-hidden border-none shadow-soft-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Lead Identity', 'Contact Info', 'Requirements', 'Value', 'Marketing', 'Assignee', 'Status', ''].map(h => (
                  <th key={h} className="table-header text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {paged.map((lead) => (
                <tr key={lead.id} className="table-row group cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <td className="table-cell">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-premium flex items-center justify-center text-white text-xs font-black shadow-md shadow-primary-500/10 group-hover:scale-110 transition-transform">
                          {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 whitespace-nowrap group-hover:text-primary-600 transition-colors">{lead.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">ID: {lead.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-300" />
                        <p className="text-slate-600 font-medium text-xs whitespace-nowrap">{lead.phone}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-300" />
                        <p className="text-slate-400 text-[11px] truncate max-w-[120px]">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="space-y-1.5">
                      <span className="badge-interested text-[9px] py-0.5">{lead.propertyInterest}</span>
                      <p className="text-[11px] font-medium text-slate-500 whitespace-nowrap">{lead.preferredLocation}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <p className="text-slate-900 font-black text-xs whitespace-nowrap">{formatBudget(lead.budgetMin, lead.budgetMax)}</p>
                  </td>
                  <td className="table-cell">
                    <p className="text-slate-500 font-semibold text-xs whitespace-nowrap">{lead.source}</p>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                         {lead.assignedAgent[0]}
                       </div>
                       <p className="text-slate-600 font-medium text-xs whitespace-nowrap">{lead.assignedAgent}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={clsx('badge-new', STATUS_CLASSES[lead.status], 'whitespace-nowrap font-black')}>{lead.status}</span>
                  </td>
                  <td className="table-cell text-right">
                    <button onClick={e => { e.stopPropagation(); setSelectedLead(lead); }} className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-soft-md transition-all duration-300 flex items-center justify-center text-slate-400 hover:text-primary-600 border border-transparent hover:border-slate-100">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
            Page {currentPage} of {totalPages} <span className="mx-2 text-slate-200">|</span> {filtered.length} results
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-white border border-slate-200 shadow-soft-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    'w-9 h-9 rounded-xl text-xs font-black transition-all duration-300', 
                    currentPage === page ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 scale-110' : 'text-slate-500 hover:bg-white hover:text-primary-600'
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-white border border-slate-200 shadow-soft-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
