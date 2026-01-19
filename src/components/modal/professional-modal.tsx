import React from 'react';
import { Modal, ModalProps } from 'antd';
import { ReactNode } from 'react';
interface ProfessionalModalProps extends ModalProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    width?: number;
    className?: string;
}
export const ProfessionalModal: React.FC<ProfessionalModalProps> = ({ title, icon, children, width = 600, className = '', ...modalProps }) => {
    return (<Modal {...modalProps} centered okText={modalProps.okText ?? 'Lưu'} cancelText={modalProps.cancelText ?? 'Hủy'} transitionName="" maskTransitionName="" title={<div className="flex items-center gap-3">
          {icon && (<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>)}
          <span className="text-lg font-semibold text-gray-800">{title}</span>
        </div>} destroyOnClose className={`professional-modal enhanced-modal ${className}`} width={width} style={{
            ...modalProps.style
        }} styles={{
            body: { padding: "24px", maxHeight: "calc(80vh - 200px)", overflowY: "auto" },
            ...modalProps.styles
        }}>
      {children}
    </Modal>);
};