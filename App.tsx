import { useEffect } from 'react';
import { useAppStore } from './store/useStore';
import PaywallView from './components/PaywallView';
import DashboardView from './components/DashboardView';
import GhostReportView from './components/GhostReportView';
import ReviewView from './components/ReviewView';
import SettingsView from './components/SettingsView';
import Sidebar from './components/Sidebar';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const {
    initializeAuth,
    session,
    activeTab,
    setActiveTab,
    stats,
  } = useAppStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show loading while checking auth
  if (session.isAuthenticated === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // AUTH GUARD
  if (!session.isAuthenticated) {
    return <PaywallView />;
  }

  
  // Main app layout
  return (
    <div className="flex h-screen bg-black">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && <DashboardView stats={stats} />}
        {activeTab === 'ghost-reports' && <GhostReportView />}
        {activeTab === 'reviews' && <ReviewView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
      <Analytics />
    </div>
  );
}
