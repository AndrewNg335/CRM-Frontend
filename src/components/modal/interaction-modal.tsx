import React from 'react';
import { Form, Input, Select } from 'antd';
import { MessageOutlined, AlignLeftOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';
interface InteractionModalProps {
    modalProps: any;
    formProps: any;
    initialValues?: any;
}
export const InteractionModal: React.FC<InteractionModalProps> = ({ modalProps, formProps, initialValues, }) => {
    return (<ProfessionalModal {...modalProps} okText="Lưu" cancelText="Hủy" title="Thêm tương tác" icon={<MessageOutlined className="text-blue-600"/>} width={600} destroyOnClose>
      <Form {...formProps} layout="vertical" className="space-y-4" initialValues={initialValues}>
        
        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>

        <ProfessionalFormItem label="Loại tương tác" name="interactionType" icon={<MessageOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng chọn loại tương tác" }]}>
          <Select
            placeholder="Chọn loại tương tác"
            options={[
              { label: 'Nhắn tin', value: 'Nhắn tin' },
              { label: 'Gọi điện', value: 'Gọi điện' },
              { label: 'Gặp mặt', value: 'Gặp mặt' },
            ]}
          />
        </ProfessionalFormItem>
        
        <ProfessionalFormItem label="Chi tiết" name="detail" icon={<AlignLeftOutlined className="text-purple-500"/>}>
          <Input.TextArea rows={4} placeholder="Nhập chi tiết tương tác" showCount maxLength={500}/>
        </ProfessionalFormItem>
        
        <Form.Item name="leadId" hidden>
          <Input />
        </Form.Item>
      </Form>
    </ProfessionalModal>);
};
