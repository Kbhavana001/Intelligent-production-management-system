
import React, { useState } from 'react';
import { Card, CardHeader } from './common/Card';
import { Icon } from './common/Icon';
import type { VendorSubmittedFeedback } from '../types';

interface VendorDashboardProps {
  onLogout: () => void;
  onFeedbackSubmit: (feedback: VendorSubmittedFeedback) => void;
}

// Hardcoded lists as data is not available here in a real-world scenario this would come from an API
const VENDORS = ['Innovatech', 'Futuretronics', 'HomeComforts', 'ActiveWear Inc.'];
const PRODUCTS = [
    { name: 'Quantum Laptop', id: 'P1001' },
    { name: 'Nova Smartphone', id: 'P1002' },
    { name: 'ErgoChair Pro', id: 'H2001' },
    { name: 'Smart Coffee Maker', id: 'H2002' },
    { name: 'Pro-Fit Running Shoes', id: 'A3001' },
    { name: 'All-Weather Jacket', id: 'A3002' },
];

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ onLogout, onFeedbackSubmit }) => {
  const [vendorName, setVendorName] = useState(VENDORS[0]);
  const [productName, setProductName] = useState(PRODUCTS[0].name);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    const product = PRODUCTS.find(p => p.name === productName);
    if (!product) return;

    onFeedbackSubmit({
      vendorName,
      productId: product.id,
      feedbackText,
    });
    setFeedbackText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white flex items-center gap-3">
          <Icon type="chart" className="w-6 h-6 text-blue-400" />
          Vendor Portal
        </h1>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500"
        >
          <Icon type="logout" className="w-5 h-5" />
          Logout
        </button>
      </header>
      <main className="p-4 sm:p-6 lg:p-8 flex justify-center">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader title="Submit Product Feedback" description="Provide feedback directly to the manufacturer." />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="vendor-select" className="block text-sm font-medium text-gray-400 mb-1">Your Vendor Company</label>
                <select
                  id="vendor-select"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="product-select" className="block text-sm font-medium text-gray-400 mb-1">Select Product</label>
                <select
                  id="product-select"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {PRODUCTS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="feedback-text" className="block text-sm font-medium text-gray-400 mb-1">Feedback</label>
                <textarea
                  id="feedback-text"
                  rows={5}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Enter your feedback regarding product quality, issues, or suggestions..."
                  className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end items-center gap-4">
                {submitted && <p className="text-sm text-green-400">Feedback submitted successfully!</p>}
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500">
                  Submit Feedback
                </button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};
