
import React from 'react';
import type { KpiData } from '../types';
import { Icon } from './common/Icon';

interface KpiCardProps {
  kpi: KpiData;
  onClick?: () => void;
}

const statusClasses = {
  green: 'bg-green-500/10 text-green-400',
  yellow: 'bg-yellow-500/10 text-yellow-400',
  red: 'bg-red-500/10 text-red-400',
};

const statusDotClasses = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
};

const changeTypeClasses = {
    increase: 'text-green-400',
    decrease: 'text-red-400',
    neutral: 'text-gray-400',
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi, onClick }) => {
  const IconComponent = kpi.changeType === 'increase' ? 
    <Icon type="arrow-up" className="w-4 h-4"/> : 
    kpi.changeType === 'decrease' ? <Icon type="arrow-down" className="w-4 h-4"/> :
    <Icon type="minus" className="w-4 h-4"/>;

  const isClickable = onClick && kpi.status !== 'green';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`relative w-full text-left bg-gray-800 p-5 rounded-lg border border-gray-700 overflow-hidden group transition-colors disabled:cursor-default ${isClickable ? 'cursor-pointer hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-blue-500' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">{kpi.title}</p>
          <p className="text-3xl font-bold text-white">{kpi.value}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusDotClasses[kpi.status]} animate-pulse-fast`}></div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${changeTypeClasses[kpi.changeType]}`}>
          {IconComponent}
          <span>{kpi.change}</span>
        </div>
        <p className="text-gray-400">{kpi.description}</p>
      </div>
      {isClickable && <div className="absolute bottom-2 right-2 text-xs text-gray-500 group-hover:text-blue-400">Drill down...</div>}
    </button>
  );
};
