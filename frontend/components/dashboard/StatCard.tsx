import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trend }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
                {icon && <div className="text-blue-500">{icon}</div>}
            </div>
            <div className="flex items-end">
                <span className="text-3xl font-bold text-gray-800">{value}</span>
                {description && <span className="ml-2 text-sm text-gray-400 mb-1">{description}</span>}
            </div>
        </div>
    );
};

export default StatCard;
