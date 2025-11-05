
import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from './common/Icon';
import { Dashboard } from './Dashboard';
import { DataUploader } from './DataUploader';
import { DedicatedVendorFeedbackAnalysis } from './VendorFeedbackAnalysis';
import type { ProductData, VendorSubmittedFeedback } from '../types';

interface ManufacturerDashboardProps {
  onLogout: () => void;
  vendorFeedback: VendorSubmittedFeedback[];
}

export const ManufacturerDashboard: React.FC<ManufacturerDashboardProps> = ({ onLogout, vendorFeedback }) => {
  const [data, setData] = useState<ProductData[]>([]);
  const [filteredData, setFilteredData] = useState<ProductData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'csv' | 'vendor'>('csv');
  const [loading, setLoading] = useState(true);

  const regions = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.region).filter(Boolean)))], [data]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.category).filter(Boolean)))], [data]);

  // NO auto-fetch - user must upload CSV first
  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = data;
    if (selectedRegion !== 'All') {
      result = result.filter(d => d.region === selectedRegion);
    }
    if (selectedCategory !== 'All') {
      result = result.filter(d => d.category === selectedCategory);
    }
    setFilteredData(result);
  }, [selectedRegion, selectedCategory, data]);

  const handleDataUploaded = (uploadedData: ProductData[]) => {
    setData(uploadedData);
    setFilteredData(uploadedData);
    setSelectedRegion('All');
    setSelectedCategory('All');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-3">
              <Icon type="chart" className="w-6 h-6 text-blue-400" />
              Intelligent Production Management System
            </h1>
            <p className="text-sm text-gray-400 mt-1">AI-powered insights for product excellence.</p>
          </div>
          
          {/* Filters and Logout */}
          <div className="flex items-center gap-4">
            {regions.length > 1 && (
              <div>
                <label htmlFor="region-filter" className="sr-only">Filter by Region</label>
                <select
                  id="region-filter"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            )}
            
            {categories.length > 1 && (
              <div>
                <label htmlFor="category-filter" className="sr-only">Filter by Category</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-red-500"
            >
              <Icon type="logout" className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-700">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('csv')}
                className={`px-3 py-2 font-medium text-sm rounded-t-lg border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-blue-500 ${
                  activeTab === 'csv'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                }`}
                aria-current={activeTab === 'csv' ? 'page' : undefined}
              >
                CSV Data Analysis
              </button>
              <button
                onClick={() => setActiveTab('vendor')}
                className={`px-3 py-2 font-medium text-sm rounded-t-lg border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-blue-500 ${
                  activeTab === 'vendor'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                }`}
                aria-current={activeTab === 'vendor' ? 'page' : undefined}
              >
                Vendor Feedback Analysis
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'csv' && (
              loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-gray-400">Loading data...</div>
                </div>
              ) : data.length === 0 ? (
                <DataUploader onDataUploaded={handleDataUploaded} />
              ) : (
                <Dashboard data={filteredData} />
              )
            )}
            {activeTab === 'vendor' && <DedicatedVendorFeedbackAnalysis vendorFeedback={vendorFeedback} />}
          </div>
        </div>
      </main>
    </div>
  );
};
