
import React, { useState, useMemo } from 'react';
import { Card, CardHeader } from './common/Card';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Icon } from './common/Icon';
import { getPriceSimulation } from '../services/geminiService';
import type { ProductData, PriceSimulationResult } from '../types';

interface PricingSimulatorProps {
  data: ProductData[];
}

export const PricingSimulator: React.FC<PricingSimulatorProps> = ({ data }) => {
  const averagePrice = useMemo(() => {
    if (data.length === 0) return 0;
    return data.reduce((sum, item) => sum + item.unit_price, 0) / data.length;
  }, [data]);
  
  const [newPrice, setNewPrice] = useState(averagePrice);
  const [result, setResult] = useState<PriceSimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const simResult = await getPriceSimulation(averagePrice, newPrice, data);
      setResult(simResult);
    } catch (err) {
      setError('Failed to run simulation.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Dynamic Pricing Simulator" description="AI-driven 'what-if' analysis for price changes" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Current Average Price</label>
            <p className="text-xl font-bold text-gray-200">${averagePrice.toFixed(2)}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="price-slider" className="block text-sm font-medium text-gray-400">
              Simulated Price: <span className="font-bold text-blue-400">${newPrice.toFixed(2)}</span>
            </label>
            <input
              id="price-slider"
              type="range"
              min={averagePrice * 0.7}
              max={averagePrice * 1.3}
              step={averagePrice / 100}
              value={newPrice}
              onChange={(e) => setNewPrice(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <button
            onClick={handleSimulate}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500"
          >
            {isLoading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg min-h-[150px] flex items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-center text-red-400"><Icon type="error" className="w-8 h-8 mx-auto mb-2"/><p>{error}</p></div>}
            {result && (
                <div className="text-center space-y-2">
                    <div>
                        <p className="text-sm text-gray-400">Predicted Revenue</p>
                        <p className="text-2xl font-bold text-green-400">${result.predictedRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Predicted Sales Units</p>
                        <p className="text-lg font-semibold text-gray-200">{result.predictedSales.toLocaleString()}</p>
                    </div>
                     <p className="text-xs text-gray-500 pt-2">Confidence: {result.confidence}</p>
                </div>
            )}
            {!isLoading && !error && !result && <div className="text-center text-gray-500"><Icon type="info" className="w-8 h-8 mx-auto mb-2"/><p>Adjust the price and run a simulation.</p></div>}
        </div>
      </div>
    </Card>
  );
};
