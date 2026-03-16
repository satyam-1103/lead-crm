import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { mockLeads } from '../data/mockData';
import type { Lead, LeadStatus } from '../types';
import { IndianRupee, Home, Phone } from 'lucide-react';
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
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const getByStatus = (status: LeadStatus) => leads.filter(l => l.status === status);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const newStatus = destination.droppableId as LeadStatus;
    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status: newStatus } : l));
  };

  return (
    <div className="h-full">
      {/* Summary Row */}
      <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
        {COLUMNS.map(col => {
          const count = getByStatus(col.id).length;
          return (
            <div key={col.id} className={clsx('border px-4 py-2.5 rounded-xl flex items-center gap-2.5 flex-shrink-0 bg-white', col.headerBg)}>
              <span className={clsx('text-xl font-bold', col.headerColor)}>{count}</span>
              <span className="text-xs text-slate-500">{col.label}</span>
            </div>
          );
        })}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ height: 'calc(100vh - 250px)' }}>
          {COLUMNS.map(col => {
            const colLeads = getByStatus(col.id);
            return (
              <div key={col.id} className="flex-shrink-0 w-64 flex flex-col">
                <div className={clsx('px-3 py-2.5 rounded-t-xl border border-b-0 flex items-center justify-between', col.headerBg)}>
                  <h3 className={clsx('text-xs font-semibold uppercase tracking-wider', col.headerColor)}>{col.label}</h3>
                  <span className={clsx('text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center bg-white/70', col.headerColor)}>{colLeads.length}</span>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={clsx(
                        'flex-1 overflow-y-auto space-y-2 p-2 rounded-b-xl border transition-colors duration-200',
                        col.bodyBg,
                        snapshot.isDraggingOver && 'border-primary-300 bg-primary-50/60'
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
                                'bg-white border border-slate-200 rounded-xl p-3 space-y-2.5',
                                'hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing',
                                snapshot.isDragging && 'shadow-xl rotate-1 scale-105 border-primary-300'
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-slate-700 leading-tight">{lead.name}</p>
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">{lead.id}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Home className="w-3 h-3 flex-shrink-0" />
                                <span>{lead.propertyInterest}</span>
                                <span>·</span>
                                <IndianRupee className="w-3 h-3 flex-shrink-0" />
                                <span className="text-slate-500">{formatBudget(lead.budgetMin, lead.budgetMax)}</span>
                              </div>
                              <div className="text-xs text-slate-400 truncate">{lead.source} · {lead.preferredLocation}</div>
                              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                  <div className={clsx('w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-[8px] font-bold text-white', AGENT_COLORS[lead.assignedAgent] || 'from-slate-400 to-slate-500')}>
                                    {AGENT_INITIALS[lead.assignedAgent] || '??'}
                                  </div>
                                  <span className="text-[10px] text-slate-400 truncate max-w-[80px]">{lead.assignedAgent}</span>
                                </div>
                                <button className="text-slate-400 hover:text-primary-600 transition-colors">
                                  <Phone className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {colLeads.length === 0 && (
                        <div className="text-center py-8 text-slate-300 text-xs">Drop leads here</div>
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
