import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import { UserOutlined, TagOutlined, PhoneOutlined, MailOutlined, LinkOutlined, EnvironmentOutlined, FileTextOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';
interface LeadCreateModalProps {
    modalProps: any;
    formProps: any;
    ownerSelectProps?: any;
    isAdmin?: boolean;
}
export const LeadCreateModal: React.FC<LeadCreateModalProps> = ({ modalProps, formProps, ownerSelectProps, isAdmin = false, }) => {
    React.useEffect(() => {
        if (modalProps?.open && formProps?.form) {
            const currentResponsibleUserId = formProps.form.getFieldValue('responsibleUserId');
            if (!currentResponsibleUserId && !isAdmin) {
                console.warn('responsibleUserId not set in lead create form');
            }
        }
    }, [modalProps?.open, formProps?.form, isAdmin]);
    return (<ProfessionalModal {...modalProps} okText="Lưu" cancelText="Hủy" title="Thêm khách hàng tiềm năng" icon={<UserOutlined className="text-blue-600"/>} width={800}>
      <Form {...formProps} layout="vertical" className="space-y-4">
        
        <Form.Item name="responsibleUserId" hidden>
          <Input />
        </Form.Item>

        
        {isAdmin && (<Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Người phụ trách" name="responsibleUserId" icon={<UserOutlined className="text-teal-500"/>}>
                <Select 
                  {...ownerSelectProps} 
                  placeholder="Tìm kiếm và chọn người phụ trách" 
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
               
                />
              </ProfessionalFormItem>
            </Col>
          </Row>)}

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Tên khách hàng" name="name" icon={<UserOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}>
              <Input placeholder="Nhập tên khách hàng"/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Trạng thái" name="status" icon={<TagOutlined className="text-green-500"/>}>
              <Select placeholder="Chọn trạng thái" options={[
            { label: "Mới", value: "new" },
            { label: "Đang liên hệ", value: "contacting" },
            { label: "Đã chuyển đổi", value: "converted" },
            { label: "Không quan tâm", value: "not_interested" }
        ]}/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Số điện thoại" name="phone" icon={<PhoneOutlined className="text-purple-500"/>} rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9+\-\s()]+$/, message: "Số điện thoại không hợp lệ" }
        ]}>
              <Input placeholder="Nhập số điện thoại"/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Email" name="email" icon={<MailOutlined className="text-orange-500"/>} rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
        ]}>
              <Input placeholder="Nhập email"/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Nguồn" name="source" icon={<LinkOutlined className="text-cyan-500"/>}>
              <Select placeholder="Chọn nguồn" options={[
            { label: "Website", value: "website" },
            { label: "Facebook", value: "facebook" },
            { label: "Google Ads", value: "google_ads" },
            { label: "Giới thiệu", value: "referral" },
            { label: "Khác", value: "other" }
        ]}/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Địa chỉ" name="address" icon={<EnvironmentOutlined className="text-red-500"/>}>
              <Input placeholder="Nhập địa chỉ"/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <ProfessionalFormItem label="Ghi chú" name="note" icon={<FileTextOutlined className="text-indigo-500"/>}>
          <Input.TextArea rows={4} placeholder="Nhập ghi chú về khách hàng" showCount maxLength={500}/>
        </ProfessionalFormItem>
      </Form>
    </ProfessionalModal>);
};
