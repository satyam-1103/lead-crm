import { useState } from 'react';
import { Settings2, Bell, Users, Shield, Palette, Database, ChevronRight, Check } from 'lucide-react';
import clsx from 'clsx';

const SECTIONS = [
  { id: 'general', label: 'General', icon: Settings2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'team', label: 'Team & Access', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Database },
];

const NOTIFICATIONS = [
  { id: 'new_lead', label: 'New Lead Assigned', desc: 'When a lead is assigned to you', enabled: true },
  { id: 'no_contact', label: 'Lead Inactivity Alert', desc: 'If lead not contacted in 2 hours', enabled: true },
  { id: 'site_visit', label: 'Site Visit Reminder', desc: '1 hour before scheduled site visit', enabled: true },
  { id: 'booking', label: 'Booking Confirmed', desc: 'When a deal is closed', enabled: false },
  { id: 'weekly_report', label: 'Weekly Summary', desc: 'Every Monday morning at 9 AM', enabled: false },
];

const INTEGRATIONS = [
  { name: 'WhatsApp Business', icon: '💬', desc: 'Automated messaging and lead capture', connected: true, color: 'bg-green-50 border-green-100 text-green-700' },
  { name: 'Google Ads', icon: '📊', desc: 'Import leads from Google Ads campaigns', connected: true, color: 'bg-blue-50 border-blue-100 text-blue-700' },
  { name: 'Facebook Ads', icon: '📘', desc: 'Facebook Lead Ads integration', connected: false, color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
  { name: 'MagicBricks', icon: '🏢', desc: 'Property portal lead import', connected: false, color: 'bg-amber-50 border-amber-100 text-amber-700' },
  { name: '99acres', icon: '🏠', desc: 'Import leads from 99acres listings', connected: false, color: 'bg-orange-50 border-orange-100 text-orange-700' },
  { name: 'LinkedIn', icon: '💼', desc: 'Lead discovery and import', connected: true, color: 'bg-blue-50 border-blue-100 text-blue-700' },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-slide-up" style={{ minHeight: 'calc(100vh - 140px)' }}>
      {/* Settings Navigation */}
      <div className="w-full lg:w-72 flex-shrink-0">
        <div className="card-premium p-3 space-y-2 bg-white/80 backdrop-blur-md border-none shadow-soft-xl">
          <div className="px-4 py-3 mb-2">
            <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">Workspace Config</p>
          </div>
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={clsx(
                'w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300',
                activeSection === id 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 translate-x-1' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
              <ChevronRight className={clsx('w-4 h-4 ml-auto opacity-0 transition-all', activeSection === id && 'opacity-100 translate-x-1')} />
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-6">
        {activeSection === 'general' && (
          <div className="card-premium p-10 animate-fade-in border-none shadow-soft-2xl bg-white">
            <div className="mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">General Workspace Settings</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Core Identity & Operations</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-12">
              {[
                { label: 'Company Name', value: 'LeadEstate Realty Pvt. Ltd.', type: 'text' },
                { label: 'Primary Contact Email', value: 'admin@leadestate.in', type: 'email' },
                { label: 'Support Hotline', value: '+91 99999 00000', type: 'tel' },
                { label: 'Headquarters', value: 'Bangalore, Karnataka', type: 'text' },
              ].map(field => (
                <div key={field.label} className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-primary-600 transition-colors">{field.label}</label>
                  <input type={field.type} defaultValue={field.value} className="input-field w-full h-14 bg-slate-50 border-slate-100 hover:bg-white focus:bg-white transition-all font-bold px-5 text-sm" />
                </div>
              ))}
            </div>

            <div className="space-y-8 max-w-xl">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Automated Lead Distribution</label>
                <select className="select-field w-full h-14 bg-slate-50 border-slate-100 hover:bg-white focus:bg-white transition-all font-bold px-5 text-sm uppercase tracking-widest">
                  <option>Round Robin (Sequential assignment)</option>
                  <option>Capacity Based (Assign to least busy agent)</option>
                  <option>Performance Based (Higher conversion priority)</option>
                  <option>Manual Override Only</option>
                </select>
                <p className="text-[10px] font-bold text-slate-400 mt-3 italic">New leads will be assigned based on this logic across the team.</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">SLA Inactivity Threshold (Hours)</label>
                <div className="flex items-center gap-5">
                  <input type="number" defaultValue="2" className="input-field w-28 h-14 text-center font-black text-lg bg-slate-50" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-loose">Hours until automated<br/>alert is triggered</span>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-50 mt-12">
              <button 
                onClick={handleSave} 
                className={clsx(
                  'h-14 px-10 min-w-[200px] rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95', 
                  saved 
                    ? 'bg-emerald-600 text-white shadow-emerald-200' 
                    : 'bg-primary-600 text-white shadow-primary-100 hover:bg-primary-500'
                )}
              >
                {saved ? <><Check className="w-4 h-4 inline mr-2" /> Saved Success</> : 'Update Settings'}
              </button>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="card-premium p-10 animate-fade-in border-none shadow-soft-2xl bg-white">
            <div className="mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Notification Center</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Omnichannel Alert Management</p>
            </div>
            
            <div className="space-y-2">
              {notifications.map(notif => (
                <div key={notif.id} className="py-6 flex items-center justify-between gap-8 border-b border-slate-50 last:border-none group">
                  <div className="max-w-md">
                    <p className="text-sm font-black text-slate-800 group-hover:text-primary-600 transition-colors">{notif.label}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1.5 leading-relaxed uppercase tracking-wider">{notif.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, enabled: !n.enabled } : n))}
                    className={clsx(
                      'relative w-14 h-8 rounded-full transition-all duration-500 flex-shrink-0 shadow-inner p-1', 
                      notif.enabled ? 'bg-primary-600' : 'bg-slate-200'
                    )}
                  >
                    <span 
                      className={clsx(
                        'block w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-500 transform', 
                        notif.enabled ? 'translate-x-6' : 'translate-x-0'
                      )} 
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'integrations' && (
          <div className="card-premium p-10 animate-fade-in border-none shadow-soft-2xl bg-white">
            <div className="mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">External Ecosystem</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Enterprise-grade Platform Bridges</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INTEGRATIONS.map(integ => (
                <div key={integ.name} className={clsx('border-2 rounded-[24px] p-6 flex items-start gap-5 transition-all hover:scale-[1.02] bg-white group', integ.connected ? 'border-primary-100' : 'border-slate-50')}>
                  <span className="text-3xl bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-soft-md border border-white group-hover:rotate-6 transition-transform">{integ.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-sm font-black text-slate-900">{integ.name}</p>
                      {integ.connected && <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border border-emerald-100">Live</span>}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">{integ.desc}</p>
                    <button 
                      className={clsx(
                        'mt-5 h-9 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all active:scale-95',
                        integ.connected 
                          ? 'border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200' 
                          : 'border-slate-100 text-slate-400 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50'
                      )}
                    >
                      {integ.connected ? 'Disconnect' : 'Integrate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeSection === 'team' || activeSection === 'security' || activeSection === 'appearance') && (
          <div className="card-premium p-20 text-center animate-fade-in bg-slate-900 border-none shadow-soft-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-center mx-auto mb-8 border border-white/20 group-hover:scale-110 transition-transform duration-500">
                <Settings2 className="w-10 h-10 text-primary-400 animate-pulse" />
              </div>
              <p className="text-white font-black text-2xl mb-3 tracking-tight">Enterprise Expansion Locked</p>
              <p className="text-xs font-bold text-primary-300 max-w-xs mx-auto leading-relaxed uppercase tracking-widest opacity-70">
                This core configuration cluster is reserved for high-volume enterprise deployments.
              </p>
              <button className="h-12 px-8 bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl mx-auto mt-10 border border-white/20 hover:bg-white/20 transition-all">
                REQUEST ASCENSION ACCESS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
