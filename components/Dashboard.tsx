import React, { useState, useEffect } from 'react';
import type { ProductData } from '../types';
import { KpiGrid } from './KpiGrid';
import { AnomalyPanel } from './AnomalyPanel';
import { RecommendationsPanel } from './RecommendationsPanel';
import { RevenueChart } from './RevenueChart';
import { CompetitiveChart } from './CompetitiveChart';
import { SentimentAnalysis } from './SentimentAnalysis';
import { PricingSimulator } from './PricingSimulator';
import { SustainabilityMetrics } from './SustainabilityMetrics';
import { LoadingSpinner } from './common/LoadingSpinner';
import { RcaModal } from './RcaModal';
import type { KpiData } from '../types';

interface DashboardProps {
  data?: ProductData[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data: externalData }) => {
  const [data, setData] = useState<ProductData[]>(externalData || []);
  const [loading, setLoading] = useState(!externalData);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KpiData | null>(null);

  const handleKpiClick = (kpi: KpiData) => {
    setSelectedKpi(kpi);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedKpi(null);
  };

  useEffect(() => {
    // If external data is provided, use it directly
    if (externalData) {
      setData(externalData);
      setLoading(false);
      return;
    }

    // Otherwise, fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData: ProductData[] = await response.json();
        setData(jsonData);
      } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [externalData]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64"><p className="text-red-500">Error fetching data: {error}</p></div>;
  }
  
  if (data.length === 0) {
    return <div className="flex justify-center items-center h-64"><p>No data available for the selected filters.</p></div>;
  }

  return (
    <div className="space-y-6">
      <KpiGrid data={data} onKpiClick={handleKpiClick} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data} />
        <CompetitiveChart data={data} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <AnomalyPanel data={data} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SentimentAnalysis data={data} />
        <PricingSimulator data={data} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <RecommendationsPanel data={data} />
      </div>
      <div className="grid grid-cols-1">
        <SustainabilityMetrics data={data} />
      </div>
      {isModalOpen && selectedKpi && (
        <RcaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          kpi={selectedKpi}
          data={data}
        />
      )}
    </div>
  );
};
