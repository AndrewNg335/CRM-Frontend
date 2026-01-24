import React from 'react';
import { Card } from 'antd';
interface FilterableStatsCardProps {
    title: string;
    value: number;
    color: string;
    className?: string;
}
export const FilterableStatsCard: React.FC<FilterableStatsCardProps> = ({ title, value, color, className = "", }) => {
    return (<Card className={`text-center transition-all duration-300 ${className}`} style={{
            borderColor: '#e5e7eb',
            borderWidth: '1px',
        }} bodyStyle={{ padding: '16px' }}>
      <div className="text-3xl font-bold mb-2" style={{ color: color }}>
        {value}
      </div>
      <div className="text-gray-600 font-medium">
        {title}
      </div>
    </Card>);
};