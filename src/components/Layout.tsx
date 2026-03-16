import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard Overview', subtitle: 'Real-time insights for your real estate pipeline' },
  '/leads': { title: 'Lead Management', subtitle: 'Track, assign and manage all property buyer leads' },
  '/pipeline': { title: 'Sales Pipeline', subtitle: 'Kanban view of your full lead journey' },
  '/whatsapp': { title: 'WhatsApp Automation', subtitle: 'Automated messaging and chatbot lead qualification' },
  '/discovery': { title: 'Lead Discovery', subtitle: 'Identify and import prospects from LinkedIn' },
  '/team': { title: 'Team Performance', subtitle: 'Agent analytics, rankings and conversion metrics' },
  '/reports': { title: 'Reports', subtitle: 'Detailed reports and business insights' },
  '/settings': { title: 'Settings', subtitle: 'Platform configuration and preferences' },
};

export default function Layout() {
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'LeadEstate CRM', subtitle: '' };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <Topbar title={page.title} subtitle={page.subtitle} />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
