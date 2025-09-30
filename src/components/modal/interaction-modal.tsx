import React from 'react';
import { Form, Input } from 'antd';
import { MessageOutlined, AlignLeftOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';

interface InteractionModalProps {
  modalProps: any;
  formProps: any;
  initialValues?: any;
}

export const InteractionModal: React.FC<InteractionModalProps> = ({
  modalProps,
  formProps,
  initialValues,
}) => {
  return (
    <ProfessionalModal
      {...modalProps}
      title="Thêm tương tác"
      icon={<MessageOutlined className="text-blue-600" />}
      width={600}
      destroyOnClose
    >
      <Form {...formProps} layout="vertical" className="space-y-4" initialValues={initialValues}>
        {/* Hidden field for userId */}
        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>

        <ProfessionalFormItem
          label="Loại tương tác"
          name="interactionType"
          icon={<MessageOutlined className="text-blue-500" />}
          rules={[{ required: true, message: "Vui lòng nhập loại tương tác" }]}
        >
          <Input placeholder="Nhập loại tương tác" />
        </ProfessionalFormItem>
        
        <ProfessionalFormItem
          label="Chi tiết"
          name="detail"
          icon={<AlignLeftOutlined className="text-purple-500" />}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Nhập chi tiết tương tác"
            showCount
            maxLength={500}
          />
        </ProfessionalFormItem>
        
        <Form.Item name="leadId" hidden>
          <Input />
        </Form.Item>
      </Form>
    </ProfessionalModal>
  );
};
