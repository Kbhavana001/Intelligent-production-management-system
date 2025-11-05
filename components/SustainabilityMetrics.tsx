
import React, { useMemo } from 'react';
import { Card, CardHeader } from './common/Card';
import type { ProductData } from '../types';
import { Icon } from './common/Icon';

interface SustainabilityMetricsProps {
  data: ProductData[];
}

interface Metric {
    name: string;
    value: string;
  icon: React.ReactElement;
    tooltip: string;
}

export const SustainabilityMetrics: React.FC<SustainabilityMetricsProps> = ({ data }) => {
  const metrics = useMemo<Metric[]>(() => {
    if (data.length === 0) return [];
    
    const totalWarrantyClaims = data.reduce((sum, item) => sum + item.warranty_claims, 0);
    const totalComplaints = data.reduce((sum, item) => sum + item.complaint_count, 0);
    const totalUnits = data.reduce((sum, item) => sum + item.units_sold, 0);
    const totalEnergy = data.reduce((sum, item) => sum + (item.energy_usage_per_unit * item.units_sold), 0);
    
    const defectRate = totalUnits > 0 ? ((totalWarrantyClaims + totalComplaints) / totalUnits) * 1000 : 0; // per 1000 units
    const avgEnergyPerUnit = totalUnits > 0 ? totalEnergy / totalUnits : 0;

    return [
        {
            name: "Defects Per 1k Units",
            value: defectRate.toFixed(2),
            icon: <Icon type="warning" className="w-6 h-6 text-yellow-400" />,
            tooltip: "Warranty claims + complaints per 1,000 units sold."
        },
        {
            name: "Warranty Claims",
            value: totalWarrantyClaims.toLocaleString(),
            icon: <Icon type="error" className="w-6 h-6 text-red-400" />,
            tooltip: "Total number of warranty claims filed."
        },
        {
            name: "Avg. Energy/Unit (kWh)",
            value: avgEnergyPerUnit.toFixed(2),
            icon: <Icon type="bulb" className="w-6 h-6 text-blue-400" />,
            tooltip: "Average energy consumed per unit during manufacturing."
        }
    ];
  }, [data]);
  
  return (
    <Card>
      <CardHeader title="Sustainability & Quality Metrics" description="Tracking performance beyond the balance sheet" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {metrics.map(metric => (
          <div key={metric.name} className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-4 group relative w-full">
            <div>{metric.icon}</div>
            <div>
                <p className="text-sm text-gray-400">{metric.name}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
            </div>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {metric.tooltip}
                <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
