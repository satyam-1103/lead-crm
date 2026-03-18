import { useEffect, useState } from 'react';
import { firebaseService } from '../services/firebaseService';
import type { WhatsAppConversation, ChatMessage } from '../types';
import { MessageCircle, Send, Bot, Zap, Phone, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const AUTOMATION_TEMPLATES = [
  { id: 1, name: 'New Inquiry Welcome', trigger: 'New lead from any source', message: 'Hello! Welcome to LeadEstate. Thank you for your interest in our properties. How can I help you today?', active: true },
  { id: 2, name: 'Price Query Response', trigger: 'Keyword: price / cost / rate', message: 'Our properties start from ₹45L for plots, ₹72L for 2BHK apartments, and ₹1.8Cr for luxury villas. May I know your preferred location and budget range?', active: true },
  { id: 3, name: 'Brochure Auto-send', trigger: 'Keyword: brochure / details / more info', message: 'Sure! I\'m sending you our detailed property brochure right now. 📄 Would you like to schedule a site visit as well?', active: true },
  { id: 4, name: 'Site Visit Scheduler', trigger: 'Keyword: visit / see / site visit', message: 'Great! Our site visits happen every day between 10 AM – 5 PM. Which day works best for you?', active: false },
  { id: 5, name: 'Follow-Up Reminder', trigger: '48h no response after initial contact', message: 'Hi! Just checking if you had any questions about our properties. We have some exciting new listings that might interest you. 🏠', active: true },
];

const BOT_FLOW = [
  { step: 1, label: 'Lead sends inquiry', icon: '👋', type: 'trigger' },
  { step: 2, label: 'Bot asks property type & budget', icon: '🤖', type: 'bot' },
  { step: 3, label: 'Lead shares preferences', icon: '💬', type: 'lead' },
  { step: 4, label: 'Bot auto-sends matching options', icon: '🏠', type: 'bot' },
  { step: 5, label: 'Bot offers site visit scheduling', icon: '📅', type: 'bot' },
  { step: 6, label: 'Lead confirms or asks agent to call', icon: '✅', type: 'lead' },
  { step: 7, label: 'CRM assigns to agent automatically', icon: '👥', type: 'crm' },
];


export default function WhatsApp() {
  const [tab, setTab] = useState<'conversations' | 'automation' | 'flow'>('conversations');
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [templates, setTemplates] = useState(AUTOMATION_TEMPLATES);

  useEffect(() => {
    const fetchConvs = async () => {
      const fetched = await firebaseService.getConversations();
      setConversations(fetched);
      if (fetched.length > 0) setSelectedConvId(fetched[0].id);
      setLoading(false);
    };
    fetchConvs();
  }, []);

  const selected = conversations.find(c => c.id === selectedConvId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="card p-1.5 flex gap-1 w-fit bg-slate-100/50 backdrop-blur-md border-slate-200/60 shadow-inner">
        {[
          { id: 'conversations', label: 'Conversations', icon: MessageCircle },
          { id: 'automation', label: 'Automation', icon: Zap },
          { id: 'flow', label: 'Bot Flow', icon: Bot },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className={clsx('flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 tracking-wide',
              tab === id ? 'bg-white text-primary-600 shadow-premium' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50')}
          >
            <Icon className="w-4 h-4" />
            {label.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'conversations' && (
        <div className="card-premium overflow-hidden border-none shadow-soft-xl" style={{ height: '70vh' }}>
          <div className="grid grid-cols-12 h-full divide-x divide-slate-100/50">
            <div className="col-span-4 overflow-hidden flex flex-col bg-white">
               <div className="p-5 border-b border-slate-50 bg-slate-50/30">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">All Chats</p>
               </div>
               <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                 {conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={clsx(
                        'flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-300 relative group',
                        selectedConvId === conv.id ? 'bg-primary-50/50' : 'hover:bg-slate-50'
                      )}
                    >
                      {selectedConvId === conv.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full" />}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-emerald-200/50 flex-shrink-0 group-hover:scale-110 transition-transform">
                        {conv.leadName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-bold text-slate-900 truncate">{conv.leadName}</p>
                          <p className="text-[10px] font-bold text-slate-400">{conv.timestamp}</p>
                        </div>
                        <p className="text-xs text-slate-400 truncate font-medium">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 rounded-lg bg-primary-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-primary-200 animate-bounce-soft">{conv.unread}</span>
                      )}
                    </div>
                  ))}
               </div>
            </div>
            <div className="col-span-8 overflow-hidden bg-slate-50/30">
              {selected ? (
                <div className="flex flex-col h-full bg-white/40 backdrop-blur-sm">
                  <div className="px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-black shadow-md">
                        {selected.leadName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{selected.leadName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">WhatsApp · Online</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <span className={clsx('badge border-none font-black text-[9px] px-3', selected.status === 'automated' ? 'bg-primary-50 text-primary-600' : 'bg-green-50 text-green-600')}>
                        {selected.status === 'automated' ? '🤖 BOT ACTIVE' : '👨‍💼 AGENT'}
                       </span>
                       <button className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:shadow-soft-md transition-all">
                        <Phone className="w-4 h-4" />
                       </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                    {selected.messages.map((msg, mIdx) => (
                      <div key={msg.id} className={clsx('flex gap-3 animate-fade-in', msg.sender !== 'lead' ? 'flex-row-reverse' : 'flex-row')} style={{ animationDelay: `${mIdx * 50}ms` }}>
                        {msg.sender === 'bot' && (
                          <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                            <Bot className="w-4 h-4 text-primary-600" />
                          </div>
                        )}
                        <div className={clsx(
                          'max-w-[70%] space-y-1',
                          msg.sender !== 'lead' ? 'items-end' : 'items-start'
                        )}>
                          <div className={clsx(
                            'rounded-2xl px-4 py-3 text-sm shadow-soft-md transition-all duration-300 hover:shadow-soft-lg',
                            msg.sender === 'lead' ? 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm' :
                            msg.sender === 'bot' ? 'card-premium bg-primary-50/50 border-primary-100 text-slate-800 rounded-tr-sm' :
                            'bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-200 rounded-tr-sm'
                          )}>
                            {msg.sender === 'bot' && <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-primary-500"></span> AI Assistant</p>}
                            <p className="leading-relaxed font-medium">{msg.message}</p>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{msg.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
                    <div className="flex gap-3 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200/60 shadow-inner group-focus-within:ring-2 ring-primary-500/20 transition-all">
                      <input placeholder="Type a message..." className="bg-transparent border-none focus:ring-0 text-sm flex-1 px-4 py-1.5 font-medium text-slate-700" />
                      <button className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200 hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                   <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
                      <MessageCircle className="w-8 h-8 text-slate-300" />
                   </div>
                   <p className="text-xs font-black uppercase tracking-[0.2em]">Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'automation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-lg font-black text-slate-900">Workflow Automations</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                {templates.filter(t => t.active).length} Templates Operating
              </p>
            </div>
            <button className="btn-primary px-6 py-3 rounded-2xl shadow-premium"><Zap className="w-4 h-4" /> NEW AUTOMATION</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((tmpl, tIdx) => (
              <div key={tmpl.id} className="card-premium p-6 space-y-5 animate-fade-in group hover:shadow-soft-xl transition-all duration-500" style={{ animationDelay: `${tIdx * 100}ms` }}>
                <div className="flex items-start justify-between">
                  <div className={clsx('w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-500 group-hover:scale-110', tmpl.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => setTemplates(prev => prev.map(t => t.id === tmpl.id ? { ...t, active: !t.active } : t))}
                    className={clsx('w-12 h-6 rounded-full transition-all relative', tmpl.active ? 'bg-emerald-500' : 'bg-slate-200')}
                  >
                    <span className={clsx('absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all', tmpl.active ? 'left-7' : 'left-1')} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <p className="text-base font-black text-slate-900">{tmpl.name}</p>
                    <span className={clsx('text-[9px] font-black px-2 py-0.5 rounded-lg tracking-widest', tmpl.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>
                      {tmpl.active ? 'OPERATIONAL' : 'STANDBY'}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TRIGGER: {tmpl.trigger}</p>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/60 relative overflow-hidden italic text-sm text-slate-600 font-medium">
                  <div className="absolute top-0 right-0 p-1 opacity-5"><Bot className="w-12 h-12" /></div>
                  "{tmpl.message}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'flow' && (
        <div className="card-premium p-10 bg-white border-none shadow-soft-xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/20 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl -ml-32 -mb-32 animate-pulse" style={{ animationDelay: '1s' }}></div>
           
           <div className="relative text-center mb-12">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Lead Qualification Journey</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">AI-Driven Conversion Pipeline</p>
           </div>

          <div className="flex flex-col items-center gap-0 relative z-10 max-w-2xl mx-auto">
            {BOT_FLOW.map((step, i) => (
              <div key={step.step} className="flex flex-col items-center w-full group">
                <div className={clsx(
                   'flex items-center gap-6 w-full p-6 rounded-[2rem] border-2 transition-all duration-500 hover:shadow-soft-xl hover:-translate-y-1',
                   step.type === 'trigger' ? 'bg-white border-primary-500 shadow-lg shadow-primary-100/50' :
                   step.type === 'bot' ? 'bg-indigo-50 border-indigo-100/50' :
                   step.type === 'crm' ? 'bg-emerald-50 border-emerald-100/50' :
                   'bg-slate-50 border-slate-100/50'
                )}>
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-soft-md flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <p className={clsx('text-[10px] font-black uppercase tracking-[0.2em] mb-1.5', 
                      step.type === 'trigger' ? 'text-primary-600' : 
                      step.type === 'bot' ? 'text-indigo-600' : 
                      step.type === 'crm' ? 'text-emerald-600' : 'text-slate-400'
                    )}>
                      {step.type === 'trigger' ? 'ENTRY POINT' : step.type === 'bot' ? 'AI PROCESSING' : step.type === 'crm' ? 'SYSTEM ACTION' : 'USER INTERACTION'}
                    </p>
                    <p className="text-base font-bold text-slate-800">{step.label}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-200 group-hover:text-primary-500 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
                {i < BOT_FLOW.length - 1 && (
                  <div className="relative h-12 w-px bg-gradient-to-b from-slate-200 to-transparent">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-primary-500 transition-colors"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
