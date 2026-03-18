import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { firebaseService } from '../services/firebaseService';
import type { Lead, LeadStatus } from '../types';
import { IndianRupee, Home, Phone, Plus } from 'lucide-react';
import clsx from 'clsx';

const COLUMNS: { id: LeadStatus; label: string; headerColor: string; headerBg: string; bodyBg: string }[] = [
  { id: 'New Lead', label: 'New Leads', headerColor: 'text-blue-700', headerBg: 'bg-blue-50 border-blue-200', bodyBg: 'bg-blue-50/40 border-blue-100' },
  { id: 'Contacted', label: 'Contacted', headerColor: 'text-yellow-700', headerBg: 'bg-yellow-50 border-yellow-200', bodyBg: 'bg-yellow-50/40 border-yellow-100' },
  { id: 'Interested', label: 'Interested', headerColor: 'text-purple-700', headerBg: 'bg-purple-50 border-purple-200', bodyBg: 'bg-purple-50/40 border-purple-100' },
  { id: 'Site Visit Scheduled', label: 'Site Visit', headerColor: 'text-orange-700', headerBg: 'bg-orange-50 border-orange-200', bodyBg: 'bg-orange-50/40 border-orange-100' },
  { id: 'Negotiation', label: 'Negotiation', headerColor: 'text-pink-700', headerBg: 'bg-pink-50 border-pink-200', bodyBg: 'bg-pink-50/40 border-pink-100' },
  { id: 'Booked', label: 'Closed Deals', headerColor: 'text-emerald-700', headerBg: 'bg-emerald-50 border-emerald-200', bodyBg: 'bg-emerald-50/40 border-emerald-100' },
];

function formatBudget(min: number, max: number) {
  const fmt = (n: number) => n >= 10000000 ? `${(n / 10000000).toFixed(1)}Cr` : `${(n / 100000).toFixed(0)}L`;
  return `₹${fmt(min)}–${fmt(max)}`;
}

const AGENT_INITIALS: Record<string, string> = { 'Priya Mehta': 'PM', 'Arjun Singh': 'AS', 'Sneha Kapoor': 'SK', 'Raj Verma': 'RV' };
const AGENT_COLORS: Record<string, string> = {
  'Priya Mehta': 'from-primary-500 to-cyan-500',
  'Arjun Singh': 'from-purple-500 to-violet-500',
  'Sneha Kapoor': 'from-pink-500 to-rose-500',
  'Raj Verma': 'from-amber-500 to-orange-500',
};

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToLeads((fetchedLeads) => {
      setLeads(fetchedLeads);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getByStatus = (status: LeadStatus) => leads.filter(l => l.status === status);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    const newStatus = destination.droppableId as LeadStatus;
    
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status: newStatus } : l));
    
    // Persist to Firebase
    try {
      await firebaseService.updateLeadStatus(draggableId, newStatus);
    } catch (error) {
      console.error('Failed to update lead status:', error);
      // Revert if failed? (Optional for now)
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
    <div className="h-full space-y-8 animate-slide-up">
      {/* Summary Row */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-1">
        {COLUMNS.map(col => {
          const count = getByStatus(col.id).length;
          return (
            <div key={col.id} className="card p-4 flex items-center gap-4 flex-shrink-0 min-w-[200px] border-none bg-white/50 backdrop-blur-sm shadow-soft-sm hover:shadow-soft-md transition-all duration-300">
               <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner", col.headerBg, col.headerColor)}>
                {count}
               </div>
               <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{col.label}</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">Active Leads</p>
               </div>
            </div>
          );
        })}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide" style={{ height: 'calc(100vh - 280px)' }}>
          {COLUMNS.map((col, cIdx) => {
            const colLeads = getByStatus(col.id);
            return (
              <div key={col.id} className="flex-shrink-0 w-80 flex flex-col group animate-fade-in" style={{ animationDelay: `${cIdx * 100}ms` }}>
                <div className={clsx('px-5 py-4 rounded-t-2xl flex items-center justify-between border-b-2 bg-white/80 backdrop-blur-md sticky top-0 z-10', 
                   col.id === 'New Lead' ? 'border-primary-500' : 
                   col.id === 'Booked' ? 'border-emerald-500' : 'border-slate-200')}>
                  <div className="flex items-center gap-2.5">
                    <div className={clsx("w-2 h-2 rounded-full", col.id === 'New Lead' ? 'bg-primary-500' : col.id === 'Booked' ? 'bg-emerald-500' : 'bg-slate-300')}></div>
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-900">{col.label}</h3>
                  </div>
                  <span className="text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center bg-slate-100 text-slate-500">{colLeads.length}</span>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={clsx(
                        'flex-1 overflow-y-auto space-y-4 p-4 rounded-b-2xl transition-all duration-500 scrollbar-hide',
                        snapshot.isDraggingOver ? 'bg-slate-100/50 ring-1 ring-inset ring-slate-200' : 'bg-slate-50/30'
                      )}
                    >
                      {colLeads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={clsx(
                                'card-premium p-5 space-y-4 border-none bg-white shadow-soft-md select-none group/card',
                                snapshot.isDragging ? 'shadow-premium ring-2 ring-primary-500 rotate-2 scale-105 z-50' : 'hover:-translate-y-1'
                              )}
                            >
                              <div className="space-y-1">
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-bold text-slate-900 leading-tight group-hover/card:text-primary-600 transition-colors">{lead.name}</p>
                                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[9px] font-black text-slate-400 opacity-50">
                                    {lead.id.slice(0, 2)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex -space-x-1.5 overflow-hidden">
                                     <div className={clsx('w-5 h-5 rounded-full border border-white ring-2 ring-white bg-gradient-to-br flex items-center justify-center text-[7px] font-black text-white', AGENT_COLORS[lead.assignedAgent] || 'from-slate-400 to-slate-500')}>
                                      {AGENT_INITIALS[lead.assignedAgent] || '??'}
                                     </div>
                                  </div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lead.source}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                <span className="badge bg-slate-50 text-slate-600 border-slate-100 text-[9px] tracking-normal py-1 pr-2">
                                  <Home className="w-3 h-3 mr-1 text-slate-400" /> {lead.propertyInterest}
                                </span>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <p className="text-xs font-black text-slate-900">{formatBudget(lead.budgetMin, lead.budgetMax)}</p>
                                <button className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                                  <Phone className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {colLeads.length === 0 && (
                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-50 mt-4 group-hover:opacity-100 transition-opacity">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                              <Plus className="w-4 h-4 text-slate-400" />
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Leads</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
