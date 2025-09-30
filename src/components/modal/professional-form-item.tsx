import React from 'react';
import { Form, FormItemProps } from 'antd';
import { ReactNode } from 'react';

interface ProfessionalFormItemProps extends FormItemProps {
  icon?: ReactNode;
  children: ReactNode;
}

export const ProfessionalFormItem: React.FC<ProfessionalFormItemProps> = ({
  icon,
  label,
  children,
  ...formItemProps
}) => {
  const enhancedLabel = icon && label ? (
    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
      {icon}
      {label}
    </span>
  ) : label;

  return (
    <Form.Item
      {...formItemProps}
      label={enhancedLabel}
    >
      {React.cloneElement(children as React.ReactElement, {
        className: `professional-input enhanced-input ${(children as React.ReactElement).props.className || ''}`,
        size: 'large',
        ...(children as React.ReactElement).props
      })}
    </Form.Item>
  );
};
