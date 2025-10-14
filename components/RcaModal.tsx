
import React, { useState, useEffect } from 'react';
import { getRootCauseAnalysis } from '../services/geminiService';
import type { ProductData } from '../types';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Icon } from './common/Icon';

interface RcaModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: string;
  data: ProductData[];
}

export const RcaModal: React.FC<RcaModalProps> = ({ isOpen, onClose, metric, data }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && metric) {
      const fetchAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await getRootCauseAnalysis(metric, data);
          setAnalysis(result ?? "");
        } catch (err) {
          setError('Failed to get analysis. Please check your API key and try again.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [isOpen, metric, data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            Root Cause Analysis for "{metric}"
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="p-6 min-h-[200px] max-h-[60vh] overflow-y-auto">
          {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner text="Analyzing data..." /></div>}
          {error && (
             <div className="flex flex-col items-center justify-center h-full text-red-400">
                <Icon type="error" className="w-12 h-12 mb-4" />
                <p className="text-center">{error}</p>
             </div>
          )}
          {!isLoading && !error && (
            <div className="prose prose-invert prose-sm text-gray-300 whitespace-pre-wrap">
              <p>{analysis}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
