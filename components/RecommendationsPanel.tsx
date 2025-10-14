
import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from './common/Card';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Icon } from './common/Icon';
import { getAutomatedRecommendations } from '../services/geminiService';
import type { ProductData, Recommendation } from '../types';

interface RecommendationsPanelProps {
  data: ProductData[];
}

const levelColors: { [key: string]: string } = {
  High: 'text-red-400',
  Medium: 'text-yellow-400',
  Low: 'text-green-400',
};

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ data }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!data || data.length === 0) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await getAutomatedRecommendations(data);
        setRecommendations(result);
      } catch (err) {
        setError('Could not fetch recommendations.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader title="Automated Recommendations" description="AI-generated action items" />
      <div className="flex-grow">
        {isLoading && <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>}
        {error && <div className="flex flex-col items-center justify-center h-48 text-yellow-400"><Icon type="warning" className="w-8 h-8 mb-2" /><p className="text-center text-sm">{error}</p></div>}
        {!isLoading && !error && recommendations.length === 0 && <div className="flex flex-col items-center justify-center h-48 text-gray-500"><Icon type="check" className="w-8 h-8 mb-2" /><p>No recommendations at this time.</p></div>}
        {!isLoading && !error && recommendations.length > 0 && (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                    <Icon type="bulb" className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-1"/>
                    <div>
                        <p className="text-sm text-gray-200">{rec.recommendation}</p>
                        <div className="text-xs text-gray-400 mt-2 flex items-center gap-4">
                            <span>Impact: <span className={`font-bold ${levelColors[rec.impact]}`}>{rec.impact}</span></span>
                            <span>Effort: <span className={`font-bold ${levelColors[rec.effort]}`}>{rec.effort}</span></span>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
