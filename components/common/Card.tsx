// Card component
import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}
export const CardHeader: React.FC<CardHeaderProps> = ({ title, description, children }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
                {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
            </div>
            {children && <div className="mt-2 sm:mt-0">{children}</div>}
        </div>
    );
};
