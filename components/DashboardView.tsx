import React from 'react';
import { Activity, ShieldAlert, Users, Zap, Clock, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import StatCard from './StatCard';
import PowerMovesWidget from './PowerMovesWidget';
import { Stats } from '../types';
import { initialTrafficData } from '../services/mockData';

interface DashboardViewProps {
  stats: Stats;
}

const competitorData = [
  { name: 'Your AI', hallucination: 2.1, latency: 120 },
  { name: 'Comp. A', hallucination: 4.8, latency: 450 },
  { name: 'Comp. B', hallucination: 3.9, latency: 320 },
  { name: 'Comp. C', hallucination: 6.2, latency: 580 },
];

const DashboardView: React.FC<DashboardViewProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Automations" value={stats.totalRuns.toLocaleString()} icon={Activity} color="blue" subtext="+12% vs last week" />
        <StatCard title="Risks Prevented" value={stats.risksCaught} icon={ShieldAlert} color="red" subtext="Shadow Mode Active" />
        <StatCard title="Est. Savings" value={`$${stats.moneySaved.toLocaleString()}`} icon={Users} color="green" subtext="Based on $15/task avg" />
        <StatCard title="Active Workers" value={stats.activeWorkers} icon={Zap} color="purple" subtext="8 Standard | 4 VIP" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Visualizer */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Clock className="mr-2 text-blue-400" size={20} /> Live Queue Status
          </h3>
          <div className="space-y-6">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-400 font-bold flex items-center text-sm uppercase tracking-wide">
                  <Zap size={16} className="mr-2"/> VIP Queue
                </span>
                <span className="text-[10px] uppercase font-bold bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded border border-yellow-400/20">Enterprise Only</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden relative">
                 {/* Simulated progress bar effect */}
                <div className="bg-yellow-400 h-full w-[15%] absolute left-0 top-0 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
                <span>Latency: 120ms</span>
                <span>Active: 2 Tasks</span>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-400 font-bold text-sm uppercase tracking-wide">Standard Queue</span>
                <span className="text-[10px] uppercase font-bold bg-blue-400/10 text-blue-400 px-2 py-1 rounded border border-blue-400/20">Throttled</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden relative">
                <div className="bg-blue-400 h-full w-[65%] absolute left-0 top-0 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
                <span>Latency: 1.2s</span>
                <span>Active: 45 Tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-80">
          <h3 className="text-lg font-bold text-white mb-4">Traffic Load (Last 30m)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={initialTrafficData}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="time" stroke="#9ca3af" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} 
                itemStyle={{ color: '#60a5fa' }}
              />
              <Area type="monotone" dataKey="load" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* POWER MOVES WIDGET (NEW) */}
      <PowerMovesWidget />

       {/* Power Move: Competitor Intelligence */}
       <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
           <div>
             <h3 className="text-lg font-bold text-white flex items-center">
               <BarChart3 className="mr-2 text-purple-400" /> Market Intelligence
             </h3>
             <p className="text-xs text-gray-400 mt-1">Benchmarked against aggregated industry data (Anonymized).</p>
           </div>
           <span className="bg-purple-900/30 text-purple-300 text-xs px-2 py-1 rounded border border-purple-500/30">Enterprise Feature</span>
        </div>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                <Legend />
                <Bar dataKey="hallucination" name="Hallucination Rate (%)" fill="#f87171" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="latency" name="Avg Latency (ms)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
        </div>
       </div>
      
       {/* Recent Activity Log */}
       <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent System Actions</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center text-sm text-gray-300 border-b border-gray-800 pb-2 last:border-0">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                <span className="flex-1 font-mono">Auto-corrected compliance error in Client_{100 + i}</span>
                <span className="text-gray-500 text-xs">Just now</span>
              </div>
            ))}
            <div className="flex items-center text-sm text-gray-300 border-b border-gray-800 pb-2 last:border-0">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></div>
              <span className="flex-1 font-mono">Scaled up VIP Workers to 6 Replicas</span>
              <span className="text-gray-500 text-xs">2m ago</span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default DashboardView;