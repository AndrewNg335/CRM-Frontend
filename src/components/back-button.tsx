import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

interface BackButtonProps {
  className?: string;
  style?: React.CSSProperties;
  size?: 'small' | 'middle' | 'large';
  text?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  className = '', 
  style = {},
  size = 'middle',
  text = 'Quay lại'
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <Button
      type="default"
      icon={<ArrowLeftOutlined />}
      onClick={handleBack}
      className={`back-button ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        ...style
      }}
      size={size}
    >
      {text}
    </Button>
  );
};
