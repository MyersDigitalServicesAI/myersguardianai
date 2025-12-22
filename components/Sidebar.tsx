import React from 'react';
import { Activity, CheckCircle, FileText, Settings, Zap } from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: Activity, label: 'Overview' },
    { id: 'reviews', icon: CheckCircle, label: 'Review Queue' },
    { id: 'ghost-reports', icon: FileText, label: 'Ghost Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 border-r border-gray-800 bg-gray-950 p-6 flex flex-col h-full">
      <div className="mb-8 flex items-center space-x-2 text-white">
        <div className="bg-blue-600 p-1.5 rounded shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          <Zap size={20} fill="white" className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Myers Guardian</span>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">System Status</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Temporal Worker Online</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">v3.0.1-stable</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
