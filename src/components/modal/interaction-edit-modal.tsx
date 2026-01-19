import React from 'react';
import { Form, Input, Select } from 'antd';
import { MessageOutlined, AlignLeftOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';

interface InteractionEditModalProps {
    modalProps: any;
    formProps: any;
}

export const InteractionEditModal: React.FC<InteractionEditModalProps> = ({ modalProps, formProps }) => {
    return (
        <ProfessionalModal 
            {...modalProps} 
            okText="Lưu" 
            cancelText="Hủy" 
            title="Chỉnh sửa tương tác" 
            icon={<MessageOutlined className="text-blue-600"/>} 
            width={800} 
            destroyOnClose
        >
            <Form {...formProps} layout="vertical" className="space-y-4">
                
                <Form.Item name="userId" hidden>
                    <Input />
                </Form.Item>

                <ProfessionalFormItem 
                    label="Loại tương tác" 
                    name="interactionType" 
                    icon={<MessageOutlined className="text-blue-500"/>} 
                    rules={[{ required: true, message: "Vui lòng chọn loại tương tác" }]}
                >
                    <Select
                        placeholder="Chọn loại tương tác"
                        options={[
                            { label: 'Nhắn tin', value: 'Nhắn tin' },
                            { label: 'Gọi điện', value: 'Gọi điện' },
                            { label: 'Gặp mặt', value: 'Gặp mặt' },
                        ]}
                    />
                </ProfessionalFormItem>

                <ProfessionalFormItem 
                    label="Chi tiết tương tác" 
                    name="detail" 
                    icon={<AlignLeftOutlined className="text-purple-500"/>}
                    rules={[{ required: true, message: "Vui lòng nhập chi tiết tương tác" }]}
                >
                    <Input.TextArea 
                        rows={6} 
                        placeholder="Nhập chi tiết tương tác"
                        showCount 
                        maxLength={2000}
                    />
                </ProfessionalFormItem>
                
                <Form.Item name="leadId" hidden>
                    <Input />
                </Form.Item>

                <Form.Item name="transcript" hidden>
                    <Input />
                </Form.Item>
            </Form>
        </ProfessionalModal>
    );
};