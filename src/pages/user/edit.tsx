import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Form, Input, Select, Row, Col, Typography, Card, Tag } from "antd";
import { useGetIdentity } from "@refinedev/core";
import { ProfessionalFormItem } from "@/components/modal";
import { BackButton } from "@/components/back-button";
import { UserOutlined, MailOutlined, PhoneOutlined, TagOutlined, EnvironmentOutlined, CrownOutlined } from '@ant-design/icons';
import type { User } from "@/interfaces/user";
import { hasAdminAccess } from '@/utilities';
const { Title, Text } = Typography;
export const UserEdit = () => {
    const { data: currentUser } = useGetIdentity<User>();
    const hasAccess = hasAdminAccess(currentUser);
    const pathParts = window.location.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];
    const { saveButtonProps, formProps, queryResult } = useForm<User>({
        resource: "auth",
        id: userId || currentUser?._id,
    });
    React.useEffect(() => {
        if (queryResult?.data?.data && formProps?.form) {
            const userData = queryResult.data.data;
            formProps.form.setFieldsValue({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                role: userData.role?._id,
            });
        }
    }, [queryResult?.data?.data, formProps?.form]);
    const { data: rolesData } = useList({
        resource: "roles",
        pagination: { mode: "off" },
    });
    const roleOptions = rolesData?.data?.map((role: any) => ({
        label: role.name,
        value: role._id,
    })) || [];
    if (!hasAccess) {
        return (<div className="page-container">
        <Card className="professional-card">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="text-red-600 text-2xl"/>
            </div>
            <Title level={3} className="text-gray-800 mb-2">
              Không có quyền truy cập
            </Title>
            <Text type="secondary" className="text-base">
              Bạn cần có quyền Admin để truy cập trang này. Vui lòng liên hệ quản trị viên.
            </Text>
          </div>
        </Card>
      </div>);
    }
    const userData = queryResult?.data?.data;
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Admin': return 'red';
            case 'Manager': return 'blue';
            case 'Employee': return 'green';
            default: return 'default';
        }
    };
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Admin':
                return <CrownOutlined className="mr-1"/>;
            case 'Manager':
                return <UserOutlined className="mr-1"/>;
            case 'Employee':
                return <UserOutlined className="mr-1"/>;
            default:
                return <UserOutlined className="mr-1"/>;
        }
    };
    return (<div className="page-container">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="mb-6">
        <div className="mb-4">
          <Title level={2} className="!mb-2 !text-gray-800">
    Chỉnh sửa người dùng
          </Title>
          <Text type="secondary" className="text-base">
         
               Cập nhật thông tin người dùng trong hệ thống
            
          </Text>
        </div>
      </div>

      
      <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
        <Edit saveButtonProps={{
            ...saveButtonProps,
            className: "professional-button",
            size: "large"
        }} title={false} headerButtons={false}>
          <Form {...formProps} layout="vertical" className="space-y-4">
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <ProfessionalFormItem label="Tên người dùng" name="name" icon={<UserOutlined className="text-blue-500"/>} rules={[
            { required: true, message: 'Vui lòng nhập tên!' },
            { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
        ]}>
                  <Input placeholder="Nhập tên người dùng"/>
                </ProfessionalFormItem>
              </Col>
              <Col xs={24} md={12}>
                <ProfessionalFormItem label="Email" name="email" icon={<MailOutlined className="text-green-500"/>} rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
        ]}>
                  <Input placeholder="Nhập email"/>
                </ProfessionalFormItem>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <ProfessionalFormItem label="Mật khẩu mới" name="password" icon={<UserOutlined className="text-red-500"/>} help="Để trống nếu không muốn thay đổi mật khẩu">
                  <Input.Password placeholder="Nhập mật khẩu mới"/>
                </ProfessionalFormItem>
              </Col>
              <Col xs={24} md={12}>
                <ProfessionalFormItem label="Trạng thái" name="status" icon={<TagOutlined className="text-orange-500"/>} rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                  <Select placeholder="Chọn trạng thái">
                    <Select.Option value="active">Hoạt động</Select.Option>
                    <Select.Option value="inactive">Không hoạt động</Select.Option>
                  </Select>
                </ProfessionalFormItem>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <ProfessionalFormItem label="Số điện thoại" name="phone" icon={<PhoneOutlined className="text-purple-500"/>} rules={[
            { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ!' }
        ]}>
                  <Input placeholder="Nhập số điện thoại"/>
                </ProfessionalFormItem>
              </Col>
              <Col xs={24} md={12}>
                <ProfessionalFormItem label="Địa chỉ" name="address" icon={<EnvironmentOutlined className="text-indigo-500"/>}>
                  <Input placeholder="Nhập địa chỉ"/>
                </ProfessionalFormItem>
              </Col>
            </Row>

            
            {true && (<Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <ProfessionalFormItem label="Vai trò" name="role" icon={<CrownOutlined className="text-yellow-500"/>} rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
                    <Select options={roleOptions} placeholder="Chọn vai trò" filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
                  </ProfessionalFormItem>
                </Col>
                <Col xs={24} md={12}>
                  <ProfessionalFormItem label="Thông tin bổ sung" icon={<UserOutlined className="text-gray-500"/>}>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Text type="secondary">Số task được giao:</Text>
                        <Text strong>{userData?.taskAssignedCount || 0}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Số lead được giao:</Text>
                        <Text strong>{userData?.leadAssignedCount || 0}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Ngày tạo:</Text>
                        <Text strong>
                          {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </Text>
                      </div>
                    </div>
                  </ProfessionalFormItem>
                </Col>
              </Row>)}
            
          </Form>
        </Edit>
      </Card>
    </div>);
};
