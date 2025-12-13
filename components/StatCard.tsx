import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'red' | 'green' | 'purple' | 'yellow';
  subtext: string;
}

const colorClasses = {
  blue: {
    border: 'hover:border-blue-500',
    text: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  red: {
    border: 'hover:border-red-500',
    text: 'text-red-500',
    bg: 'bg-red-500/10'
  },
  green: {
    border: 'hover:border-green-500',
    text: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  purple: {
    border: 'hover:border-purple-500',
    text: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  yellow: {
    border: 'hover:border-yellow-500',
    text: 'text-yellow-500',
    bg: 'bg-yellow-500/10'
  }
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtext }) => {
  const styles = colorClasses[color];

  return (
    <div className={`bg-gray-900 border border-gray-800 p-6 rounded-xl relative overflow-hidden group transition-all ${styles.border}`}>
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 ${styles.text}`}>
        <Icon size={64} />
      </div>
      <div className="flex items-center space-x-3 mb-2">
        <div className={`p-2 ${styles.bg} rounded-lg ${styles.text}`}>
          <Icon size={20} />
        </div>
        <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtext}</div>
    </div>
  );
};

export default StatCard;