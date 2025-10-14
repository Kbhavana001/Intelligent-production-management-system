
import React from 'react';
import { Icon } from './common/Icon';

interface HeaderProps {
  regions: string[];
  categories: string[];
  selectedRegion: string;
  selectedCategory: string;
  onRegionChange: (region: string) => void;
  onCategoryChange: (category: string) => void;
  onLogout: () => void;
  username?: string;
  displayName?: string;
}

export const Header: React.FC<HeaderProps> = ({ regions, categories, selectedRegion, selectedCategory, onRegionChange, onCategoryChange, onLogout, username, displayName }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 p-4 sm:p-6 border-b border-gray-700">
      <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Icon type="chart" className="w-7 h-7 text-blue-400" />
            Intelligent Production Management System
          </h1>
          <p className="text-sm text-gray-400 mt-1">AI-powered insights for product excellence.</p>
        </div>
  <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-auto">
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Select region"
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
           <div className="w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Select category"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            { (displayName || username) ? (
              <div className="hidden sm:flex items-center gap-2 bg-gray-700/40 px-3 py-1 rounded-md text-sm text-gray-200">
                <Icon type="chart" className="w-4 h-4 text-blue-400" />
                <span>{displayName || username}</span>
              </div>
            ) : null}
          </div>

          <button
            onClick={onLogout}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500"
          >
            <Icon type="logout" className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
