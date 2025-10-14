
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './Header';
import { useAuth } from '../src/AuthContext';
import { Dashboard } from './Dashboard';
import { DataUploader } from './DataUploader';
import { DedicatedVendorFeedbackAnalysis } from './VendorFeedbackAnalysis';
import type { ProductData, VendorSubmittedFeedback } from '../types';

interface ManufacturerDashboardProps {
  onLogout: () => void;
  vendorFeedback: VendorSubmittedFeedback[];
}

export const ManufacturerDashboard: React.FC<ManufacturerDashboardProps> = ({ onLogout, vendorFeedback }) => {
  const { user } = useAuth();
  const [data, setData] = useState<ProductData[]>([]);
  const [filteredData, setFilteredData] = useState<ProductData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'csv' | 'vendor'>('csv');

  const regions = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.region)))], [data]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.category)))], [data]);

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
    <>
      {data.length === 0 ? (
        <DataUploader onDataUploaded={handleDataUploaded} />
      ) : (
        <div className="flex flex-col h-screen">
      <Header 
                regions={regions}
                categories={categories}
                selectedRegion={selectedRegion}
                selectedCategory={selectedCategory}
                onRegionChange={setSelectedRegion}
                onCategoryChange={setSelectedCategory}
        onLogout={onLogout}
        username={user?.username}
        displayName={user?.displayName}
            />
            
            {/* Main Content Area */}
            <main className="flex-grow overflow-y-auto bg-gray-900 p-4 sm:p-6 lg:p-8">
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
                                Live Vendor Feedback
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div>
                        {activeTab === 'csv' && <Dashboard data={filteredData} />}
                        {activeTab === 'vendor' && <DedicatedVendorFeedbackAnalysis vendorFeedback={vendorFeedback} />}
                    </div>
                </div>
            </main>
        </div>
      )}
    </>
  );
};
