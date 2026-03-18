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

function ConversationList({ conversations, selected, onSelect }: { conversations: WhatsAppConversation[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-slate-100 bg-slate-50">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversations</p>
      </div>
      {conversations.map(conv => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={clsx('flex items-center gap-3 p-3 border-b border-slate-100 cursor-pointer transition-colors', selected === conv.id ? 'bg-primary-50' : 'hover:bg-slate-50')}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {conv.leadName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700 truncate">{conv.leadName}</p>
              <p className="text-[10px] text-slate-400">{conv.timestamp}</p>
            </div>
            <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
          </div>
          {conv.unread > 0 && (
            <span className="w-4 h-4 rounded-full bg-green-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">{conv.unread}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function ChatView({ conversation }: { conversation: WhatsAppConversation }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, sender: 'agent', message: input, timestamp: 'Just now', type: 'text' }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
            {conversation.leadName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{conversation.leadName}</p>
            <p className="text-xs text-slate-400">{conversation.phone}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={clsx('badge text-[10px]', conversation.status === 'automated' ? 'badge-new' : conversation.status === 'active' ? 'badge-interested' : 'badge-booked')}>
            {conversation.status === 'automated' ? '🤖 Automated' : conversation.status === 'active' ? 'Active' : 'Resolved'}
          </span>
          <button className="btn-ghost p-1.5"><Phone className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {messages.map(msg => (
          <div key={msg.id} className={clsx('flex gap-2', msg.sender !== 'lead' ? 'flex-row-reverse' : 'flex-row')}>
            {msg.sender === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-primary-600" />
              </div>
            )}
            <div className={clsx(
              'max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm',
              msg.sender === 'lead' ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' :
              msg.sender === 'bot' ? 'bg-primary-50 border border-primary-100 text-slate-700 rounded-tl-none' :
              'bg-green-600 text-white rounded-tr-none'
            )}>
              {msg.sender === 'bot' && <p className="text-[10px] text-primary-600 font-semibold mb-1">🤖 Bot</p>}
              {msg.sender === 'agent' && <p className="text-[10px] text-green-100 font-semibold mb-1">Agent</p>}
              <p>{msg.message}</p>
              <p className={clsx('text-[10px] mt-1 text-right', msg.sender === 'agent' ? 'text-green-100' : 'text-slate-400')}>{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-100 bg-white flex gap-2 items-end">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="input-field flex-1" />
        <button onClick={sendMessage} className="btn-primary h-9 px-3"><Send className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

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
    <div className="space-y-4">
      <div className="card p-1 flex gap-1 w-fit">
        {[
          { id: 'conversations', label: 'Conversations', icon: MessageCircle },
          { id: 'automation', label: 'Automation', icon: Zap },
          { id: 'flow', label: 'Bot Flow', icon: Bot },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              tab === id ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100')}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'conversations' && (
        <div className="card overflow-hidden" style={{ height: '65vh' }}>
          <div className="grid grid-cols-3 h-full divide-x divide-slate-100">
            <div className="col-span-1 overflow-hidden"><ConversationList conversations={conversations} selected={selectedConvId || ''} onSelect={setSelectedConvId} /></div>
            <div className="col-span-2 overflow-hidden">{selected ? <ChatView key={selected.id} conversation={selected} /> : <div className="flex items-center justify-center h-full text-slate-400 text-sm">Select a conversation</div>}</div>
          </div>
        </div>
      )}

      {tab === 'automation' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{templates.filter(t => t.active).length} active automation templates</p>
            <button className="btn-primary text-xs"><Zap className="w-3.5 h-3.5" /> New Template</button>
          </div>
          {templates.map(tmpl => (
            <div key={tmpl.id} className="card p-4 flex items-start gap-4 hover:border-slate-300 transition-colors">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', tmpl.active ? 'bg-green-50 border border-green-200' : 'bg-slate-100')}>
                <Zap className={clsx('w-5 h-5', tmpl.active ? 'text-green-600' : 'text-slate-400')} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-700">{tmpl.name}</p>
                  <span className={clsx('badge text-[10px]', tmpl.active ? 'badge-booked' : 'badge-lost')}>{tmpl.active ? 'Active' : 'Inactive'}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">Trigger: {tmpl.trigger}</p>
                <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100">"{tmpl.message}"</p>
              </div>
              <button
                onClick={() => setTemplates(prev => prev.map(t => t.id === tmpl.id ? { ...t, active: !t.active } : t))}
                className={clsx('w-10 h-6 rounded-full transition-colors flex-shrink-0 relative', tmpl.active ? 'bg-green-500' : 'bg-slate-200')}
              >
                <span className={clsx('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all', tmpl.active ? 'left-4.5 translate-x-1' : 'left-0.5')} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'flow' && (
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">AI Chatbot Flow</h3>
          <p className="text-xs text-slate-400 mb-6">Automated lead qualification journey</p>
          <div className="flex flex-col items-center gap-0">
            {BOT_FLOW.map((step, i) => (
              <div key={step.step} className="flex flex-col items-center w-full max-w-md">
                <div className={clsx('flex items-center gap-4 w-full p-4 rounded-xl border transition-all duration-200',
                  step.type === 'trigger' ? 'bg-primary-50 border-primary-200' :
                  step.type === 'bot' ? 'bg-indigo-50 border-indigo-200' :
                  step.type === 'crm' ? 'bg-emerald-50 border-emerald-200' :
                  'bg-slate-50 border-slate-200'
                )}>
                  <span className="text-xl">{step.icon}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-slate-400">
                      {step.type === 'trigger' ? 'Trigger' : step.type === 'bot' ? 'Bot Action' : step.type === 'crm' ? 'CRM Action' : 'Lead Action'}
                    </p>
                    <p className="text-sm text-slate-700">{step.label}</p>
                  </div>
                  <ChevronRight className="ml-auto w-4 h-4 text-slate-300" />
                </div>
                {i < BOT_FLOW.length - 1 && <div className="w-px h-6 bg-slate-200"></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
