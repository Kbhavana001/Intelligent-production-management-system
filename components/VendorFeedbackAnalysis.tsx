import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Icon } from './common/Icon';
import { getVendorFeedbackAnalysis } from '../services/geminiService';
import type { VendorFeedback, VendorSubmittedFeedback } from '../types';

interface DedicatedVendorFeedbackAnalysisProps {
  vendorFeedback: VendorSubmittedFeedback[];
}

export const DedicatedVendorFeedbackAnalysis: React.FC<DedicatedVendorFeedbackAnalysisProps> = ({ vendorFeedback }) => {
  const [analysis, setAnalysis] = useState<VendorFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (vendorFeedback.length === 0) {
          setIsLoading(false);
          setAnalysis([]);
          return;
      };
      setIsLoading(true);
      setError(null);
      try {
        const result = await getVendorFeedbackAnalysis(vendorFeedback);
        setAnalysis(result);
      } catch (err) {
        setError('Could not fetch vendor feedback analysis.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalysis();
  }, [vendorFeedback]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner text="Analyzing feedback..." /></div>;
  }
  
  if (error) {
    return <div className="flex flex-col items-center justify-center h-64 text-yellow-400"><Icon type="warning" className="w-8 h-8 mb-2" /><p className="text-center text-sm">{error}</p></div>;
  }
  
  if (!analysis || analysis.length === 0) {
    return <div className="flex flex-col items-center justify-center h-64 text-gray-500"><Icon type="info" className="w-8 h-8 mb-2" /><p>No vendor feedback submitted yet.</p></div>;
  }

  return (
      <div className="space-y-6">
          {analysis.map((vendor, index) => (
              <div key={index} className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
              <h4 className="font-semibold text-lg text-blue-300 mb-3">{vendor.vendorName}</h4>
              <p className="text-sm text-gray-400 italic mb-4 border-l-4 border-gray-600 pl-4 py-1">"{vendor.summary}"</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Positive Themes */}
                  <div className="bg-green-500/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-2">
                      <Icon type="check" className="w-5 h-5" />
                      <span>Positive Themes</span>
                  </div>
                  <ul className="space-y-1.5 pl-2">
                      {vendor.positiveThemes.length > 0 ? (
                      vendor.positiveThemes.map((theme, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start">
                          <span className="text-green-400 mr-2 mt-1">&#8226;</span>
                          <span>{theme}</span>
                          </li>
                      ))
                      ) : (
                      <li className="text-sm text-gray-500 italic">None identified</li>
                      )}
                  </ul>
                  </div>
                  
                  {/* Negative Themes */}
                  <div className="bg-red-500/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-2">
                      <Icon type="warning" className="w-5 h-5" />
                      <span>Negative Themes</span>
                  </div>
                  <ul className="space-y-1.5 pl-2">
                      {vendor.negativeThemes.length > 0 ? (
                      vendor.negativeThemes.map((theme, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start">
                          <span className="text-red-400 mr-2 mt-1">&#8226;</span>
                          <span>{theme}</span>
                          </li>
                      ))
                      ) : (
                      <li className="text-sm text-gray-500 italic">None identified</li>
                      )}
                  </ul>
                  </div>
              </div>
              </div>
          ))}
      </div>
  );
};