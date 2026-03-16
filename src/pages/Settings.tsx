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
    <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 140px)' }}>
      {/* Settings Navigation */}
      <div className="w-56 flex-shrink-0">
        <div className="card p-2 space-y-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200',
                activeSection === id 
                  ? 'bg-primary-50 text-primary-700 border border-primary-100 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {label}
              <ChevronRight className={clsx('w-3.5 h-3.5 ml-auto opacity-0 transition-opacity', activeSection === id && 'opacity-100')} />
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-5">
        {activeSection === 'general' && (
          <div className="card p-8 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-800 mb-6">General Workspace Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { label: 'Company Name', value: 'LeadEstate Realty Pvt. Ltd.', type: 'text' },
                { label: 'Primary Contact Email', value: 'admin@leadestate.in', type: 'email' },
                { label: 'Support Hotline', value: '+91 99999 00000', type: 'tel' },
                { label: 'Headquarters', value: 'Bangalore, Karnataka', type: 'text' },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 whitespace-nowrap">{field.label}</label>
                  <input type={field.type} defaultValue={field.value} className="input-field w-full h-11" />
                </div>
              ))}
            </div>

            <div className="space-y-6 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Automated Lead Distribution</label>
                <select className="select-field w-full h-11">
                  <option>Round Robin (Sequential assignment)</option>
                  <option>Capacity Based (Assign to least busy agent)</option>
                  <option>Performance Based (Higher conversion priority)</option>
                  <option>Manual Override Only</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-2 italic">New leads will be assigned based on this logic across the team.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SLA Inactivity Threshold (Hours)</label>
                <div className="flex items-center gap-3">
                  <input type="number" defaultValue="2" className="input-field w-24 h-11 text-center font-bold" />
                  <span className="text-sm text-slate-500 font-medium font-serif">Hours until alert is triggered</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 mt-10">
              <button 
                onClick={handleSave} 
                className={clsx(
                  'btn-primary h-11 px-8 min-w-[160px]', 
                  saved && 'from-emerald-600 to-emerald-500 hover:from-emerald-500 shadow-emerald-200'
                )}
              >
                {saved ? <><Check className="w-4 h-4" /> Changes Saved</> : 'Update Settings'}
              </button>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="card p-8 animate-fade-in shadow-lg">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Notification Center</h3>
            <p className="text-xs text-slate-400 mb-8 font-medium">Configure how and when you want to be alerted across all platforms.</p>
            
            <div className="divide-y divide-slate-100">
              {notifications.map(notif => (
                <div key={notif.id} className="py-5 flex items-center justify-between gap-6 first:pt-0">
                  <div className="max-w-md">
                    <p className="text-sm font-bold text-slate-700">{notif.label}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, enabled: !n.enabled } : n))}
                    className={clsx(
                      'relative w-12 h-6.5 rounded-full transition-all duration-300 flex-shrink-0 shadow-inner', 
                      notif.enabled ? 'bg-primary-600' : 'bg-slate-200'
                    )}
                  >
                    <span 
                      className={clsx(
                        'absolute top-1 w-4.5 h-4.5 rounded-full bg-white shadow-md border border-slate-100 transition-all duration-300', 
                        notif.enabled ? 'left-6.5' : 'left-1'
                      )} 
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'integrations' && (
          <div className="card p-8 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-800 mb-1">External Integrations</h3>
            <p className="text-xs text-slate-400 mb-8">Connect your CRM pipeline with best-in-class real estate platforms.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INTEGRATIONS.map(integ => (
                <div key={integ.name} className={clsx('border rounded-2xl p-5 flex items-start gap-4 transition-all hover:scale-[1.01]', integ.color)}>
                  <span className="text-3xl bg-white/50 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-slate-100/50">{integ.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold truncate">{integ.name}</p>
                      {integ.connected && <span className="bg-white/80 border border-current text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded shadow-sm">Syncing</span>}
                    </div>
                    <p className="text-xs opacity-70 leading-relaxed truncate">{integ.desc}</p>
                  </div>
                  <button 
                    className={clsx(
                      'text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border-2 transition-all mt-1',
                      integ.connected ? 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300' : 'border-current opacity-80 hover:opacity-100 hover:bg-white/40'
                    )}
                  >
                    {integ.connected ? 'Halt' : 'Link'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeSection === 'team' || activeSection === 'security' || activeSection === 'appearance') && (
          <div className="card p-20 text-center animate-fade-in bg-slate-50 shadow-inner">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
              <Settings2 className="w-8 h-8 text-primary-300 animate-pulse" />
            </div>
            <p className="text-slate-700 font-bold text-lg mb-2">Expansion Module Locked</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              This advanced configuration module will be available in the next system update for your workspace plan.
            </p>
            <button className="btn-secondary text-xs mx-auto mt-6 border-slate-300">Learn More About {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</button>
          </div>
        )}
      </div>
    </div>
  );
}
