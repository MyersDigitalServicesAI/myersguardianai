import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Log } from '../types';

interface GhostReportViewProps {
  logs: Log[];
}

const GhostReportView: React.FC<GhostReportViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FileText className="mr-3 text-purple-400" />
            Ghost Auditor Reports
          </h2>
          <p className="text-gray-400 text-sm mt-1">Shadow Mode Analysis (Last 7 Days)</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors text-sm">
          <Download size={16} className="mr-2" /> Download PDF
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-950 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Task Snippet</th>
                <th className="p-4 font-semibold">Risk Detected</th>
                <th className="p-4 font-semibold">Outcome</th>
                <th className="p-4 text-right font-semibold">Est. Liability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {logs.map(log => (
                <tr key={log.id} className="text-sm hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-xs">{log.date}</td>
                  <td className="p-4 text-white truncate max-w-xs font-medium">{log.taskSnippet}</td>
                  <td className="p-4">
                      <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs border border-red-400/20 font-bold">
                        {log.riskDetected}
                      </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs border ${log.outcome.includes('Fixed') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                      {log.outcome}
                    </span>
                  </td>
                  <td className="p-4 text-right text-white font-mono">${log.savedLiability.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-950 border-t border-gray-800">
              <tr>
                <td colSpan={4} className="p-4 text-right text-gray-400 uppercase text-xs tracking-wider">Total Risk Avoided</td>
                <td className="p-4 text-right text-green-400 font-bold text-lg">${logs.reduce((a, b) => a + b.savedLiability, 0).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GhostReportView;