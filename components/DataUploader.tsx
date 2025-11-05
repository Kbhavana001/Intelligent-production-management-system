import React, { useState, useCallback } from 'react';
import type { ProductData } from '../types';
import { Icon } from './common/Icon';
import { LoadingSpinner } from './common/LoadingSpinner';

interface DataUploaderProps {
  onDataUploaded: (data: ProductData[]) => void;
}

// Type conversion utility
const convertToType = (key: keyof ProductData, value: string) => {
    if (value === null || value === undefined || value === '') return null;
    const numericFields: (keyof ProductData)[] = [
        'units_sold', 'unit_price', 'discount_pct', 'revenue', 'cost',
        'gross_margin', 'returns', 'rating', 'complaint_count', 'warranty_claims',
        'competitor_price', 'competitor_market_share', 'stock_level',
        'energy_usage_per_unit', 'unit_cost_estimate', 'margin_pct', 'revenue_usd'
    ];
    if (numericFields.includes(key)) return parseFloat(value);
    if (key === 'promo_flag') return value.toLowerCase() === 'true';
    return value;
};

const parseCSVToProductData = (csvText: string): ProductData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim() as keyof ProductData);
    
    // Basic validation for required headers
    const requiredHeaders: (keyof ProductData)[] = [
        'order_id', 'order_date', 'units_sold', 'unit_price', 'discount_pct', 'revenue', 'cost', 'gross_margin', 'returns',
        'product_id', 'product_name', 'category', 'sku', 'vendor_id', 'vendor_name', 'production_batch', 'manufacturing_date',
        'region', 'country', 'store_id', 'channel',
        'customer_id', 'customer_segment', 'rating', 'feedback_text', 'complaint_count', 'warranty_claims',
        'competitor_price', 'competitor_market_share', 'promo_flag',
        'stock_level', 'energy_usage_per_unit',
        'unit_cost_estimate', 'margin_pct', 'revenue_usd'
    ];

    for (const h of requiredHeaders) {
        if (!headers.includes(h)) {
            throw new Error(`Missing required CSV header: ${h}`);
        }
    }

    return lines.slice(1).map((line, rowIndex) => {
        const values = line.split(',');
        const entry = {} as ProductData;
        
        if (values.length !== headers.length) {
            console.warn(`Row ${rowIndex + 2} has incorrect number of columns. Skipping.`);
            return null;
        }

        headers.forEach((header, i) => {
            try {
                (entry as any)[header] = convertToType(header, values[i].trim());
            } catch (e) {
                throw new Error(`Error parsing value "${values[i]}" for header "${header}" on row ${rowIndex + 2}.`);
            }
        });
        return entry;
    }).filter((entry): entry is ProductData => entry !== null);
};


export const DataUploader: React.FC<DataUploaderProps> = ({ onDataUploaded }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback(async (selectedFile: File | null) => {
        if (!selectedFile) return;

        if (selectedFile.type !== 'text/csv') {
            setError('Invalid file type. Please upload a CSV file.');
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            const text = await selectedFile.text();
            const data = parseCSVToProductData(text);
            if (data.length === 0) {
                 throw new Error("CSV file is empty or contains no valid data rows.");
            }
            // Call the callback to pass data to parent component
            onDataUploaded(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during parsing.');
        } finally {
            setIsLoading(false);
        }
    }, [onDataUploaded]);
    
    const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    
    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                        <Icon type="chart" className="w-8 h-8 text-blue-400" />
                        Intelligent Production Management System
                    </h1>
                    <p className="text-md text-gray-400 mt-2">Upload your production management data to begin.</p>
                </div>
                
                <div 
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    className={`relative bg-gray-800 border-2 border-dashed ${isDragging ? 'border-blue-500' : 'border-gray-600'} rounded-lg p-8 text-center transition-colors`}
                >
                    {isLoading ? (
                        <LoadingSpinner text="Parsing data..." />
                    ) : (
                        <>
                            <input
                                type="file"
                                id="file-upload"
                                className="sr-only"
                                accept=".csv"
                                onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="flex flex-col items-center">
                                    <svg className="w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="text-lg font-semibold text-gray-300">Drag & drop your CSV file here</p>
                                    <p className="text-sm text-gray-500 mt-1">or <span className="text-blue-400">click to browse</span></p>
                                </div>
                            </label>
                        </>
                    )}
                </div>

                {error && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg text-center">
                        <p className="font-semibold">Upload Failed</p>
                        <p>{error}</p>
                    </div>
                )}

                 <div className="mt-6 text-xs text-gray-500 text-left bg-gray-800/50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-400 mb-2">Your CSV file must contain the following headers:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1">
                        <code className="text-gray-400">order_id</code>
                        <code className="text-gray-400">order_date</code>
                        <code className="text-gray-400">units_sold</code>
                        <code className="text-gray-400">unit_price</code>
                        <code className="text-gray-400">discount_pct</code>
                        <code className="text-gray-400">revenue</code>
                        <code className="text-gray-400">cost</code>
                        <code className="text-gray-400">gross_margin</code>
                        <code className="text-gray-400">returns</code>
                        <code className="text-gray-400">product_id</code>
                        <code className="text-gray-400">product_name</code>
                        <code className="text-gray-400">category</code>
                        <code className="text-gray-400">sku</code>
                        <code className="text-gray-400">vendor_id</code>
                        <code className="text-gray-400">vendor_name</code>
                        <code className="text-gray-400">production_batch</code>
                        <code className="text-gray-400">manufacturing_date</code>
                        <code className="text-gray-400">region</code>
                        <code className="text-gray-400">country</code>
                        <code className="text-gray-400">store_id</code>
                        <code className="text-gray-400">channel</code>
                        <code className="text-gray-400">customer_id</code>
                        <code className="text-gray-400">customer_segment</code>
                        <code className="text-gray-400">rating</code>
                        <code className="text-gray-400">feedback_text</code>
                        <code className="text-gray-400">complaint_count</code>
                        <code className="text-gray-400">warranty_claims</code>
                        <code className="text-gray-400">competitor_price</code>
                        <code className="text-gray-400">competitor_market_share</code>
                        <code className="text-gray-400">promo_flag</code>
                        <code className="text-gray-400">stock_level</code>
                        <code className="text-gray-400">energy_usage_per_unit</code>
                        <code className="text-gray-400">unit_cost_estimate</code>
                        <code className="text-gray-400">margin_pct</code>
                        <code className="text-gray-400">revenue_usd</code>
                    </div>
                 </div>
            </div>
        </div>
    );
};