
import React, { useMemo, useState } from 'react';
import { KpiCard } from './KpiCard';
import type { ProductData } from '../types';
import type { KpiData } from '../types';
import { RcaModal } from './RcaModal';

interface KpiGridProps {
  data: ProductData[];
}

export const KpiGrid: React.FC<KpiGridProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMetric, setModalMetric] = useState('');

  const handleKpiClick = (metric: string, status: KpiData['status']) => {
    if (status !== 'green') {
      setModalMetric(metric);
      setIsModalOpen(true);
    }
  };

  const kpis = useMemo<KpiData[]>(() => {
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalUnitsSold = data.reduce((sum, item) => sum + item.units_sold, 0);
    const totalReturns = data.reduce((sum, item) => sum + item.returns, 0);
    const returnRate = totalUnitsSold > 0 ? (totalReturns / totalUnitsSold) * 100 : 0;
    const avgRating = data.reduce((sum, item) => sum + item.rating, 0) / data.length;

    return [
      {
        title: 'Total Revenue',
        value: `$${(totalRevenue / 1000).toFixed(1)}k`,
        change: '+5.4%',
        changeType: 'increase',
        status: totalRevenue > 150000 ? 'green' : totalRevenue > 80000 ? 'yellow' : 'red',
        description: 'Compared to last period',
      },
      {
        title: 'Units Sold',
        value: totalUnitsSold.toLocaleString(),
        change: '+2.1%',
        changeType: 'increase',
        status: 'green',
        description: 'Total items sold',
      },
      {
        title: 'Return Rate',
        value: `${returnRate.toFixed(1)}%`,
        change: '-0.5%',
        changeType: 'decrease',
        status: returnRate < 3 ? 'green' : returnRate < 6 ? 'yellow' : 'red',
        description: 'Lower is better',
      },
      {
        title: 'Avg. Satisfaction',
        value: `${avgRating.toFixed(2)}/5`,
        change: '+0.1',
        changeType: 'increase',
        status: avgRating > 4.2 ? 'green' : avgRating > 3.5 ? 'yellow' : 'red',
        description: 'Customer rating average',
      },
    ];
  }, [data]);
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map(kpi => (
          <KpiCard key={kpi.title} kpi={kpi} onClick={() => handleKpiClick(kpi.title, kpi.status)} />
        ))}
      </div>
      <RcaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        metric={modalMetric}
        data={data}
      />
    </>
  );
};
