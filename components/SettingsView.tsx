import React from 'react';
import { Lock, AlertTriangle, Settings as SettingsIcon, Shield, User, Key } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { UserRole } from '../types';

interface SettingsViewProps {
    killSwitch: boolean;
    setKillSwitch: (val: boolean) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ killSwitch, setKillSwitch }) => {
  const { userRole, setUserRole, rateLimits, setRateLimit, session } = useAppStore();

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <SettingsIcon className="text-gray-400" size={32} />
        <h2 className="text-2xl font-bold text-white">System Settings</h2>
      </div>

      {/* Auth Status / JWT Visualizer */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
         <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${session.isAuthenticated ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                <Key size={20} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-white">JWT Authentication Active</h4>
                <p className="text-xs text-gray-500 font-mono mt-0.5 max-w-xs truncate">
                    {session.token ? `${session.token.substring(0, 35)}...` : 'No Active Session'}
                </p>
            </div>
         </div>
         <div className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400 font-mono">
            HS256
         </div>
      </div>

      {/* RBAC Role Switcher (Mock Auth) */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
             <div>
                <h3 className="text-lg font-bold text-white flex items-center">
                    <User size={20} className="mr-2 text-blue-400" /> User Role Simulation
                </h3>
                <p className="text-gray-400 text-sm mt-1">Simulate permissions for different user levels.</p>
             </div>
        </div>
        <div className="flex space-x-4 bg-gray-950 p-2 rounded-lg border border-gray-800">
            {(['admin', 'viewer', 'auditor'] as UserRole[]).map(role => (
                <button
                    key={role}
                    onClick={() => setUserRole(role)}
                    className={`flex-1 py-2 px-4 rounded font-medium text-sm transition-colors capitalize ${
                        userRole === role 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                >
                    {role}
                </button>
            ))}
        </div>
        {userRole !== 'admin' && (
            <div className="mt-4 flex items-center text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                <AlertTriangle size={12} className="mr-2" />
                <span>You are currently in <strong>{userRole}</strong> mode. Write access and critical controls are disabled.</span>
            </div>
        )}
      </div>

      {/* Kill Switch */}
      <div className={`border-2 rounded-xl p-6 transition-all duration-300 ${killSwitch ? 'border-red-600 bg-red-900/10 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'border-gray-800 bg-gray-900'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`text-lg font-bold flex items-center ${killSwitch ? 'text-red-500' : 'text-white'}`}>
              <Lock size={20} className="mr-2" /> Emergency Kill Switch
            </h3>
            <p className="text-gray-400 text-sm mt-1 max-w-md">
              Immediately suspends all AI processing and queues tasks. Use only in case of prompt injection attack or runaway costs.
            </p>
          </div>
          <button 
            onClick={() => setKillSwitch(!killSwitch)}
            disabled={userRole !== 'admin'}
            className={`px-4 py-2 rounded font-bold text-white transition-all shadow-lg ${
                userRole !== 'admin'
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                : killSwitch 
                    ? 'bg-gray-700 hover:bg-gray-600 border border-gray-500' 
                    : 'bg-red-600 hover:bg-red-500 shadow-red-900/50 hover:shadow-red-600/50'
            }`}
          >
            {killSwitch ? 'DEACTIVATE LOCKDOWN' : 'ACTIVATE LOCKDOWN'}
          </button>
        </div>
        {killSwitch && (
          <div className="flex items-center bg-red-500/10 text-red-400 p-3 rounded border border-red-500/20 animate-pulse">
            <AlertTriangle size={16} className="mr-2" />
            <span className="text-sm font-mono font-bold">SYSTEM LOCKDOWN ACTIVE. 45 TASKS QUEUED. WORKERS PAUSED.</span>
          </div>
        )}
      </div>

      {/* Rate Limits */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">API Rate Limits</h3>
        <div className="space-y-8">
           <div className="relative">
             <div className="flex justify-between text-sm text-gray-400 mb-2 font-medium">
               <span>VIP Queue (Enterprise)</span>
               <span className="text-white bg-gray-800 px-2 py-0.5 rounded text-xs border border-gray-700">{rateLimits.vip} req/sec</span>
             </div>
             <input 
                type="range" 
                min="0" max="200"
                value={rateLimits.vip}
                onChange={(e) => setRateLimit('vip', parseInt(e.target.value))}
                disabled={userRole !== 'admin'} 
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed" 
             />
           </div>
           <div className="relative">
             <div className="flex justify-between text-sm text-gray-400 mb-2 font-medium">
               <span>Standard Queue</span>
               <span className="text-white bg-gray-800 px-2 py-0.5 rounded text-xs border border-gray-700">{rateLimits.standard} req/sec</span>
             </div>
             <input 
                type="range" 
                min="0" max="50"
                value={rateLimits.standard}
                onChange={(e) => setRateLimit('standard', parseInt(e.target.value))}
                disabled={userRole !== 'admin'} 
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" 
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;