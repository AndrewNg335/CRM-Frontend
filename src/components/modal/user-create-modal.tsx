import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, CrownOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';
interface UserCreateModalProps {
    modalProps: any;
    formProps: any;
    roleSelectProps?: any;
}
export const UserCreateModal: React.FC<UserCreateModalProps> = ({ modalProps, formProps, roleSelectProps, }) => {
    return (<ProfessionalModal {...modalProps} title="Thêm người dùng mới" icon={<UserOutlined className="text-blue-600"/>} width={800}>
      <Form {...formProps} layout="vertical" className="space-y-4">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Tên người dùng" name="name" icon={<UserOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}>
              <Input placeholder="Nhập tên người dùng"/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Email" name="email" icon={<MailOutlined className="text-green-500"/>} rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
        ]}>
              <Input placeholder="Nhập email"/>
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
            <ProfessionalFormItem label="Mật khẩu" name="password" icon={<LockOutlined className="text-red-500"/>} rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
              <Input.Password placeholder="Nhập mật khẩu"/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Vai trò" name="roleId" icon={<CrownOutlined className="text-orange-500"/>} rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
              <Select 
                {...roleSelectProps} 
                placeholder="Tìm kiếm và chọn vai trò"
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              
              />
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Địa chỉ" name="address" icon={<EnvironmentOutlined className="text-indigo-500"/>}>
              <Input placeholder="Nhập địa chỉ"/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Người quản lý" name="managerId" icon={<UserOutlined className="text-cyan-500"/>}>
              <Select placeholder="Chọn người quản lý" allowClear/>
            </ProfessionalFormItem>
          </Col>
        </Row>
      </Form>
    </ProfessionalModal>);
};