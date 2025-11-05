
import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from './common/Card';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Icon } from './common/Icon';
import { getAnomalyDetection } from '../services/geminiService';
import type { ProductData, Anomaly } from '../types';

interface AnomalyPanelProps {
  data: ProductData[];
}

const severityClasses = {
  High: 'bg-red-500/20 text-red-400 border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export const AnomalyPanel: React.FC<AnomalyPanelProps> = ({ data }) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnomalies = async () => {
      if (!data || data.length === 0) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await getAnomalyDetection(data);
        setAnomalies(result);
      } catch (err) {
        setError('Could not fetch anomalies. API key might be missing.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnomalies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader title="Anomaly Detection" description="AI-powered alerts on unusual trends" />
      <div className="flex-grow">
        {isLoading && <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>}
        {error && <div className="flex flex-col items-center justify-center h-48 text-yellow-400"><Icon type="warning" className="w-8 h-8 mb-2" /><p className="text-center text-sm">{error}</p></div>}
        {!isLoading && !error && anomalies.length === 0 && <div className="flex flex-col items-center justify-center h-48 text-gray-500"><Icon type="check" className="w-8 h-8 mb-2" /><p>No anomalies detected.</p></div>}
        {!isLoading && !error && anomalies.length > 0 && (
          <ul className="space-y-3">
            {anomalies.map((anomaly, index) => (
              <li key={index} className={`p-3 rounded-md border ${severityClasses[anomaly.severity]}`}>
                <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-sm">{anomaly.metric} - {anomaly.deviation}</p>
                    <span className="text-xs font-bold">{anomaly.severity}</span>
                </div>
                <p className="text-xs text-gray-400">{anomaly.explanation}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};
