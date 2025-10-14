
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader } from './common/Card';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Icon } from './common/Icon';
import { getSentimentAnalysis } from '../services/geminiService';
import type { ProductData } from '../types';

interface SentimentAnalysisProps {
  data: ProductData[];
}

interface SentimentData {
  summary: string;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  key_themes: string[];
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ data }) => {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const feedbackText = useMemo(() => data.map(d => d.feedback_text).filter(Boolean), [data]);

  useEffect(() => {
    if (feedbackText.length === 0) {
        setIsLoading(false);
        setSentiment(null);
        return;
    };

    const fetchSentiment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getSentimentAnalysis(feedbackText);
        setSentiment(result);
      } catch (err) {
        setError('Failed to analyze sentiment.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSentiment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const chartData = useMemo(() => {
    if (!sentiment) return [];
    return [
      { name: 'Positive', value: sentiment.positive_count },
      { name: 'Neutral', value: sentiment.neutral_count },
      { name: 'Negative', value: sentiment.negative_count },
    ].filter(item => item.value > 0);
  }, [sentiment]);

  return (
    <Card>
      <CardHeader title="Customer Sentiment Analysis" description="NLP on reviews & feedback" />
      {isLoading && <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>}
      {error && <div className="flex flex-col items-center justify-center h-64 text-yellow-400"><Icon type="warning" className="w-8 h-8 mb-2" /><p>{error}</p></div>}
      {!isLoading && !error && sentiment && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }} />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-3 max-h-28 overflow-y-auto pr-2">{sentiment.summary}</p>
            <h4 className="font-semibold text-sm mb-2 text-gray-200">Key Themes:</h4>
            <ul className="space-y-1.5">
              {sentiment.key_themes.slice(0, 3).map((theme, index) => (
                <li key={index} className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-md">{theme}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
};
