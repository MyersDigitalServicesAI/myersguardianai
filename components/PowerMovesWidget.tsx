import React from 'react';
import { ArrowUpRight, Zap, Lock, Users, Terminal, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useStore';

const PowerMovesWidget = () => {
  const { userRole } = useAppStore();

  const ActionItem = ({ icon: Icon, title, desc, active = false, locked = false }: any) => (
    <div className={`flex items-start p-3 rounded-lg transition-all ${active ? 'bg-gray-800/50 border border-gray-700' : 'hover:bg-gray-800/30 border border-transparent'}`}>
      <div className={`p-2 rounded-md mr-3 ${active ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
            <h4 className={`text-sm font-bold ${active ? 'text-white' : 'text-gray-400'}`}>{title}</h4>
            {locked && <Lock size={12} className="text-yellow-500" />}
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-tight">{desc}</p>
      </div>
      {active && (
         <button className="ml-2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white self-center">
            <ArrowUpRight size={14} />
         </button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Next Steps: Onboarding */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Suggested Next Steps</h3>
                <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full border border-green-900/50">2 Pending</span>
            </div>
            <div className="space-y-2">
                <ActionItem 
                    icon={Users} 
                    title="Invite Team Members" 
                    desc="Add your legal and compliance team to the review queue."
                    active={true}
                />
                <ActionItem 
                    icon={Terminal} 
                    title="Install CLI Agent" 
                    desc="Monitor local development environments for leaks."
                    active={false}
                />
                 <ActionItem 
                    icon={ShieldCheck} 
                    title="Configure Compliance Rules" 
                    desc="Set custom regex patterns for PII detection."
                    active={false}
                />
            </div>
        </div>

        {/* Power Moves: Upsell / Advanced */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Zap size={100} />
            </div>
            <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <Zap className="text-yellow-500 mr-2" size={18} /> Power Moves
                </h3>
                <span className="text-xs font-mono text-gray-500">PRO FEATURES</span>
            </div>
            <div className="space-y-2 relative z-10">
                <ActionItem 
                    icon={Zap} 
                    title="Enable Shadow Mode" 
                    desc="Zero-latency monitoring via async processing sidecar."
                    active={true}
                />
                <ActionItem 
                    icon={Lock} 
                    title="Private VPC Deployment" 
                    desc="Deploy Guardian Node inside your own AWS/GCP VPC."
                    locked={userRole !== 'admin'}
                    active={false}
                />
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-500 font-medium flex items-center">
                        <Zap size={12} className="mr-1" />
                        Upgrade to Enterprise to unlock dedicated hardware nodes.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PowerMovesWidget;