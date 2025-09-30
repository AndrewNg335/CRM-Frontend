import React from 'react';
import { Card } from 'antd';

interface FilterableStatsCardProps {
  title: string;
  value: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const FilterableStatsCard: React.FC<FilterableStatsCardProps> = ({
  title,
  value,
  color,
  isActive,
  onClick,
  className = "",
}) => {
  const getActiveStyles = () => {
    if (isActive) {
      return {
        borderColor: color,
        borderWidth: '2px',
        backgroundColor: `${color}10`,
        boxShadow: `0 4px 12px ${color}60`, 
      };
    }
    return {};
  };

  return (
    <Card 
      className={`text-center hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
      style={{
        ...getActiveStyles(),
        cursor: 'pointer'
      }}
      onClick={onClick}
      bodyStyle={{ padding: '16px' }}
    >
      <div 
        className={`text-3xl font-bold mb-2 ${isActive ? 'scale-110' : ''} transition-transform duration-200`}
        style={{ color: isActive ? color : color }}
      >
        {value}
      </div>
      <div 
        className={`text-gray-600 font-medium ${isActive ? 'text-gray-800' : ''}`}
      >
        {title}
      </div>
    </Card>
  );
};
