import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Filter, ArrowUpDown, Zap } from 'lucide-react';
import { Task } from '../types';
import { useAppStore } from '../store/useStore';

interface ReviewViewProps {
  tasks: Task[];
}

type SortOption = 'newest' | 'oldest' | 'confidence-asc' | 'confidence-desc';
type RiskFilter = 'all' | 'risky' | 'safe';
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';
type TierFilter = 'all' | 'standard' | 'enterprise';

const ReviewView: React.FC<ReviewViewProps> = ({ tasks }) => {
  const { updateTaskStatus, userRole } = useAppStore();
  const [filterTier, setFilterTier] = useState<TierFilter>('all');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [filterRisk, setFilterRisk] = useState<RiskFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Logic
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Filter
    if (filterTier !== 'all') {
      result = result.filter(t => t.tier === filterTier);
    }
    if (filterStatus !== 'all') {
      result = result.filter(t => t.status === filterStatus);
    }
    if (filterRisk !== 'all') {
      const isRisky = filterRisk === 'risky';
      result = result.filter(t => t.riskFlag === isRisky);
    }

    // 2. Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'oldest':
          return a.timestamp.getTime() - b.timestamp.getTime();
        case 'confidence-desc':
          return b.confidence - a.confidence;
        case 'confidence-asc':
          return a.confidence - b.confidence;
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, filterTier, filterStatus, filterRisk, sortOption]);

  const hasStandardTasks = processedTasks.some(t => t.tier === 'standard' && t.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white">Human-in-the-Loop Review</h2>
           <p className="text-gray-400 text-sm mt-1">Review, edit, and approve flagged automation tasks.</p>
        </div>
        <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-medium border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)] self-start md:self-center">
          {processedTasks.length} Visible / {tasks.length} Total
        </span>
      </div>

      {/* Control Bar */}
      <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-wrap items-center gap-4 shadow-sm">
        <div className="flex items-center space-x-2 mr-2">
          <Filter size={16} className="text-blue-400" />
          <span className="text-sm font-bold text-gray-200">Filter:</span>
        </div>

        {/* Filters */}
        <select value={filterTier} onChange={(e) => setFilterTier(e.target.value as TierFilter)} className="bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg p-2.5">
          <option value="all">All Tiers</option>
          <option value="standard">Standard</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as StatusFilter)} className="bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg p-2.5">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value as RiskFilter)} className="bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg p-2.5">
          <option value="all">All Risk Levels</option>
          <option value="risky">Risk Detected</option>
          <option value="safe">Clear</option>
        </select>
        <div className="w-px h-6 bg-gray-700 mx-2 hidden md:block"></div>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg p-2.5 flex-1">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="confidence-asc">Confidence (Low to High)</option>
          <option value="confidence-desc">Confidence (High to Low)</option>
        </select>
      </div>

      {/* Pavlovian Upsell: Visible when Standard tasks are present */}
      {hasStandardTasks && filterStatus !== 'approved' && (
        <div className="bg-gradient-to-r from-yellow-900/20 to-gray-900 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:border-yellow-500/40 transition-all">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Zap className="text-yellow-500 animate-pulse" size={24} />
            </div>
            <div>
                <h4 className="text-white font-bold text-sm">High Latency Detected on Standard Queue</h4>
                <p className="text-gray-400 text-xs mt-1">
                    Standard tasks are experiencing a <span className="text-red-400 font-mono">1.2s</span> delay. VIP tasks are processing in <span className="text-green-400 font-mono">12ms</span>.
                </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs rounded uppercase tracking-wider transition-colors shadow-lg shadow-yellow-500/20">
            Upgrade to Priority
          </button>
        </div>
      )}

      {/* List */}
      <div className="grid gap-6">
        {processedTasks.map(task => (
          <div key={task.id} className={`bg-gray-900 border rounded-xl p-6 transition-colors ${task.status === 'pending' ? 'border-gray-800 hover:border-gray-700' : 'border-gray-800 opacity-75 hover:opacity-100'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${task.tier === 'enterprise' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-blue-500/20 text-blue-500 border border-blue-500/30'}`}>
                    {task.tier}
                  </span>
                  <span className="text-gray-400 text-sm font-mono">{task.id}</span>
                  <span className="text-gray-600 text-xs">• {task.timestamp.toLocaleTimeString()}</span>
                  {task.status !== 'pending' && (
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${task.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {task.status}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-1">Client: {task.clientId}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${task.confidence > 80 ? 'text-green-400' : 'text-red-400'}`}>{task.confidence}%</div>
                <div className="text-xs text-gray-500">AI Confidence</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                <div className="text-xs text-gray-500 uppercase mb-2 font-bold tracking-wider">User Input</div>
                <p className="text-gray-300 text-sm leading-relaxed">{task.input}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 relative group">
                <div className="text-xs text-gray-400 uppercase mb-2 flex justify-between font-bold tracking-wider">
                  <span>AI Draft</span>
                  {task.riskFlag && (
                    <span className="text-red-400 flex items-center text-[10px] bg-red-400/10 px-2 rounded">
                      <AlertTriangle size={12} className="mr-1" /> Risk Detected
                    </span>
                  )}
                </div>
                <textarea
                  className="w-full bg-transparent text-white text-sm focus:outline-none h-20 resize-none font-mono"
                  defaultValue={task.aiDraft}
                  disabled={task.status !== 'pending' || userRole !== 'admin'}
                />
                {task.status === 'pending' && userRole === 'admin' && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
            </div>

            {task.status === 'pending' && (
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800/50">
                 {userRole === 'viewer' && <span className="text-xs text-gray-500 self-center mr-2">Read-only mode</span>}
                <button
                  onClick={() => updateTaskStatus(task.id, 'rejected')}
                  disabled={userRole !== 'admin'}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${userRole === 'admin' ? 'bg-gray-800 hover:bg-gray-700 hover:text-red-400 text-gray-300' : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'}`}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => updateTaskStatus(task.id, 'approved', task.aiDraft)}
                  disabled={userRole !== 'admin'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${userRole === 'admin' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-blue-900/20 text-blue-500/50 cursor-not-allowed'}`}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve & Train
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewView;