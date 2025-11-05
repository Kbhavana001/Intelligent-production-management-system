
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader } from './common/Card';
import type { ProductData } from '../types';

interface RevenueChartProps {
  data: ProductData[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const revenueByRegion = data.reduce((acc, item) => {
      if (!acc[item.region]) {
        acc[item.region] = { name: item.region, Electronics: 0, 'Home Goods': 0, Apparel: 0 };
      }
      if (item.category === 'Electronics' || item.category === 'Home Goods' || item.category === 'Apparel') {
          acc[item.region][item.category] += item.revenue;
      }
      return acc;
    }, {} as Record<string, { name: string; Electronics: number; 'Home Goods': number; Apparel: number; }>);
    
    return Object.values(revenueByRegion).map(d => ({
        ...d,
        Electronics: Math.round(d.Electronics),
        'Home Goods': Math.round(d['Home Goods']),
        Apparel: Math.round(d.Apparel),
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader title="Revenue by Region & Category" description="Contribution of each category to regional revenue" />
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} />
            <YAxis stroke="#A0AEC0" fontSize={12} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', color: '#E2E8F0' }}
              cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Bar dataKey="Electronics" stackId="a" fill="#3B82F6" />
            <Bar dataKey="Home Goods" stackId="a" fill="#10B981" />
            <Bar dataKey="Apparel" stackId="a" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
