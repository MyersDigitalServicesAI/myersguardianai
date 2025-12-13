import React from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ReviewView from './components/ReviewView';
import GhostReportView from './components/GhostReportView';
import SettingsView from './components/SettingsView';
import PaywallView from './components/PaywallView'; // Import the gate
import SetupWizard from './components/SetupWizard'; // Import the wizard
import { useAppStore } from './store/useStore';
import { useSystemSimulation } from './hooks/useSystemSimulation';
import { LogOut } from 'lucide-react';

export default function App() {
  // Use Global Store
  const { 
    activeTab, 
    setActiveTab, 
    tasks, 
    ghostLogs, 
    killSwitch, 
    setKillSwitch, 
    stats,
    userRole,
    session, // Get session state
    logout,   // Get logout action
    hasCompletedWizard // Get wizard state
  } = useAppStore();

  // Initialize System Simulation (WebSocket replacement)
  useSystemSimulation();

  // AUTH GUARD: If not authenticated, show Paywall
  if (!session.isAuthenticated) {
    return <PaywallView />;
  }

  // WIZARD GUARD: If authenticated but wizard not done, show Wizard
  if (!hasCompletedWizard) {
    return <SetupWizard />;
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans flex overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md p-6 sticky top-0 z-10 flex justify-between items-center shadow-sm">
           <h1 className="text-xl font-bold text-white capitalize tracking-tight">
             {activeTab === 'ghost' ? 'Ghost Audit Logs' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Console`}
           </h1>
           <div className="flex items-center space-x-4">
             {killSwitch && (
               <div className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                 KILL SWITCH ACTIVE
               </div>
             )}
             
             {/* Role Indicator */}
             <div className={`flex items-center space-x-3 border rounded-full pl-1 pr-4 py-1 transition-colors ${userRole === 'admin' ? 'bg-gray-900 border-gray-800' : 'bg-blue-900/20 border-blue-500/30'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase ${userRole === 'admin' ? 'bg-gray-700' : 'bg-blue-600'}`}>
                 {userRole.slice(0, 2)}
               </div>
               <div className="flex flex-col leading-none">
                 <span className="text-sm font-medium text-gray-300 capitalize">{userRole}</span>
                 {session.plan && <span className="text-[10px] text-gray-500 uppercase">{session.plan} Plan</span>}
               </div>
             </div>

             {/* Logout Button */}
             <button 
                onClick={logout}
                className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                title="Log Out"
             >
               <LogOut size={20} />
             </button>
           </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView stats={stats} />}
          {activeTab === 'review' && (
            <ReviewView tasks={tasks} />
          )}
          {activeTab === 'ghost' && <GhostReportView logs={ghostLogs} />}
          {activeTab === 'settings' && (
            <SettingsView 
              killSwitch={killSwitch} 
              setKillSwitch={setKillSwitch} 
            />
          )}
        </div>
      </main>
    </div>
  );
}