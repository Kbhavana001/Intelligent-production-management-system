import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader } from './common/Card';
import type { ProductData } from '../types';

interface CompetitiveChartProps {
  data: ProductData[];
}

const COLORS = ['#3B82F6', '#4A5568'];

export const CompetitiveChart: React.FC<CompetitiveChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    if (data.length === 0) return [];
    const ourRevenue = data.reduce((acc, item) => acc + item.revenue, 0);

    // Approximate competitor revenue. Handle both decimal (0.45) and percentage (45) formats.
    let avgCompetitorShareDecimal = data.reduce((acc, item) => acc + item.competitor_market_share, 0) / data.length;

    // If the average is > 1, assume it's a percentage and convert to decimal.
    if (avgCompetitorShareDecimal > 1) {
      avgCompetitorShareDecimal /= 100;
    }
    
    // Ensure competitor share is not 100% or more, which would be illogical.
    if (avgCompetitorShareDecimal >= 1) {
      // This indicates a data issue. We'll show only our revenue and 0 for competitor.
      return [
        { name: 'Our Market Share', value: Math.round(ourRevenue) },
        { name: 'Competitor Share', value: 0 },
      ];
    }
    
    const totalMarketValue = ourRevenue / (1 - avgCompetitorShareDecimal);
    const competitorRevenue = totalMarketValue - ourRevenue;
    
    return [
      { name: 'Our Market Share', value: Math.round(ourRevenue) },
      // Ensure competitor revenue is not negative from float precision issues.
      { name: 'Competitor Share', value: Math.round(Math.max(0, competitorRevenue)) }
    ];
  }, [data]);
  
  return (
    <Card>
      <CardHeader title="Competitive Market Share" description="Estimated share of revenue in the market" />
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              // Fix: The types for recharts' label render function are not always accurate.
              // Casting to 'any' is a common workaround to access the props that are
              // passed at runtime but are missing from the type definitions.
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }}
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};