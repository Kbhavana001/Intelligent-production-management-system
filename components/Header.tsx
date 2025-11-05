
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './common/Icon';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
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
          <nav className="flex gap-4">
            <Link
              to="/dashboard"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/upload"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              CSV Data Analysis
            </Link>
          </nav>
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
