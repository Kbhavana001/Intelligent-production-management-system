
import React from 'react';
import type { ProductData } from '../types';
import { KpiGrid } from './KpiGrid';
import { AnomalyPanel } from './AnomalyPanel';
import { RecommendationsPanel } from './RecommendationsPanel';
import { RevenueChart } from './RevenueChart';
import { CompetitiveChart } from './CompetitiveChart';
import { SentimentAnalysis } from './SentimentAnalysis';
import { PricingSimulator } from './PricingSimulator';
import { SustainabilityMetrics } from './SustainabilityMetrics';


interface DashboardProps {
  data: ProductData[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="flex justify-center items-center h-64"><p>No data available for the selected filters.</p></div>;
  }

  return (
    <div className="space-y-6">
      <KpiGrid data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data} />
        <CompetitiveChart data={data} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SentimentAnalysis data={data} />
        <PricingSimulator data={data} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <RecommendationsPanel data={data} />
      </div>
      <div className="grid grid-cols-1">
        <AnomalyPanel data={data} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SentimentAnalysis data={data} />
        <PricingSimulator data={data} />
      </div>
      <div className="grid grid-cols-1">
        <SustainabilityMetrics data={data} />
      </div>
    </div>
  );
};
