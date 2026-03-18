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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{lead.name}</h2>
                <p className="text-sm text-slate-500">{lead.propertyInterest} · {lead.preferredLocation}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">{lead.assignedAgent}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 text-xs">Last contact: {new Date(lead.lastContact).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Budget', value: formatBudget(lead.budgetMin, lead.budgetMax) },
              { label: 'Source', value: lead.source },
              { label: 'Property', value: lead.propertyInterest },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                <p className="text-sm font-semibold text-slate-700">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Change Status</p>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map(status => (
                <button
                  key={status}
                  onClick={() => { onStatusChange(lead.id, status); onClose(); }}
                  className={clsx(
                    'badge text-xs cursor-pointer transition-all duration-150 hover:scale-105',
                    STATUS_CLASSES[status],
                    lead.status === status && 'ring-2 ring-offset-1 ring-primary-400 ring-offset-white'
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Notes</p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-100">{lead.notes || 'No notes yet.'}</p>
          </div>

          {lead.timeline.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Communication Timeline</p>
              <div className="space-y-3">
                {lead.timeline.map(event => (
                  <div key={event.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {event.type === 'call' ? <Phone className="w-3 h-3 text-primary-600" /> :
                       event.type === 'email' ? <Mail className="w-3 h-3 text-primary-600" /> :
                       event.type === 'whatsapp' ? <MessageSquare className="w-3 h-3 text-green-600" /> :
                       <CheckCircle className="w-3 h-3 text-primary-600" />}
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">{event.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{event.agent} · {new Date(event.timestamp).toLocaleDateString()}</p>
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
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="input-field w-full pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setCurrentPage(1); }} className="select-field text-xs">
              <option value="All">All Statuses</option>
              {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setCurrentPage(1); }} className="select-field text-xs">
              <option value="All">All Sources</option>
              {['Google Ads', 'Facebook Ads', 'Website', 'WhatsApp', 'LinkedIn', 'Property Portal'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="btn-secondary h-9 text-xs">
              <Filter className="w-3.5 h-3.5" /> More Filters
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-slate-400">{filtered.length} leads found</p>
          <div className="flex gap-1 flex-wrap">
            {ALL_STATUSES.map(s => {
              const count = leads.filter(l => l.status === s).length;
              return (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                  className={clsx('badge text-[10px] cursor-pointer transition-all', STATUS_CLASSES[s], statusFilter === s && 'ring-1 ring-offset-1 ring-primary-400 ring-offset-white')}
                >
                  {s.replace('Site Visit Scheduled', 'Visit')} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {['Lead', 'Contact', 'Property', 'Budget', 'Source', 'Agent', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.map(lead => (
                <tr key={lead.id} className="table-row-hover cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 whitespace-nowrap">{lead.name}</p>
                        <p className="text-xs text-slate-400">{lead.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-slate-500 text-xs">{lead.phone}</p>
                    <p className="text-slate-400 text-xs">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="badge badge-new text-[10px]">{lead.propertyInterest}</span>
                    <p className="text-xs text-slate-400 mt-1 whitespace-nowrap">{lead.preferredLocation}</p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">{formatBudget(lead.budgetMin, lead.budgetMax)}</td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">{lead.source}</td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">{lead.assignedAgent}</td>
                  <td className="px-4 py-3.5">
                    <span className={clsx('badge', STATUS_CLASSES[lead.status], 'whitespace-nowrap')}>{lead.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={e => { e.stopPropagation(); setSelectedLead(lead); }} className="btn-ghost p-1.5 text-xs">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-400">
            Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={clsx('w-7 h-7 rounded text-xs font-medium transition-colors', currentPage === page ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700')}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
