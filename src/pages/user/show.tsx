import React from "react";
import { useShow, useGo, useDelete, useGetIdentity } from "@refinedev/core";
import { Card, Row, Col, Typography, Tag, Button, Space, Divider, Avatar, Descriptions, Statistic, Modal, Tooltip, Badge } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, CalendarOutlined, TeamOutlined, CheckCircleOutlined, CloseCircleOutlined, CrownOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, IdcardOutlined, SafetyCertificateOutlined, ClockCircleOutlined, TrophyOutlined, UserSwitchOutlined, SettingOutlined } from '@ant-design/icons';
import { User } from '@/interfaces/user';
import { PermissionDisplay, PermissionSummary } from '@/components/permissions';
import { BackButton } from '@/components/back-button';
import { hasAdminAccess } from '@/utilities';
const { Title, Text, Paragraph } = Typography;
export const UserShow = () => {
    const go = useGo();
    const { mutate: deleteUser } = useDelete();
    const { data: currentUser } = useGetIdentity<User>();
    const hasAccess = hasAdminAccess(currentUser);
    const pathParts = window.location.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];
    const { queryResult } = useShow<User>({
        resource: "auth",
        id: userId,
        meta: {
            customUrl: `http://localhost:3000/auth/${userId}`,
        },
    });
    const userData = queryResult?.data?.data;
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
    if (!userData) {
        return (<div className="page-container">
        <Card className="professional-card">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="text-gray-400 text-2xl"/>
            </div>
            <Title level={3} className="text-gray-800 mb-2">
              Bạn không có quyền truy cập trang này
            </Title>
           
          </div>
        </Card>
      </div>);
    }
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
                return <UserSwitchOutlined className="mr-1"/>;
            case 'Employee':
                return <UserOutlined className="mr-1"/>;
            default:
                return <UserOutlined className="mr-1"/>;
        }
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'green';
            case 'inactive': return 'red';
            default: return 'default';
        }
    };
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircleOutlined className="mr-1"/>;
            case 'inactive':
                return <CloseCircleOutlined className="mr-1"/>;
            default:
                return <UserOutlined className="mr-1"/>;
        }
    };
    const handleDelete = () => {
        Modal.confirm({
            title: 'Xác nhận xóa người dùng',
            content: (<div>
          <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Text strong className="text-red-600">
              {userData.name}
            </Text>
            <br />
            <Text type="secondary" className="text-sm">
              {userData.email}
            </Text>
          </div>
          <p className="mt-2 text-sm text-red-600">
            ⚠️ Hành động này không thể hoàn tác!
          </p>
        </div>),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            width: 500,
            onOk: () => {
                deleteUser({
                    resource: 'auth',
                    id: userId,
                    successNotification: false,
                    errorNotification: false,
                }, {
                    onSuccess: () => {
                        go({ to: '/users' });
                    },
                    onError: (error: any) => {
                        const message = error?.response?.data?.message ||
                            error?.message ||
                            'Xoá người dùng thất bại, vui lòng thử lại.';
                        Modal.error({
                            title: 'Không thể xoá người dùng',
                            content: message,
                        });
                    },
                });
            },
        });
    };
    return (<div className="page-container">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
       
            <div>
              <Title level={2} className="!mb-2 !text-gray-800">
                Thông tin người dùng
              </Title>
              <Text type="secondary" className="text-base">
                Xem chi tiết thông tin và hoạt động của người dùng
              </Text>
            </div>
          </div>
          <Space>
            <Tooltip title="Chỉnh sửa người dùng">
              <Button type="primary" icon={<EditOutlined />} onClick={() => go({ to: `/users/edit/${userId}` })} className="professional-button" size="large">
                Chỉnh sửa
              </Button>
            </Tooltip>
            <Tooltip title="Xóa người dùng">
              <Button danger icon={<DeleteOutlined />} onClick={handleDelete} className="professional-button" size="large">
                Xóa
              </Button>
            </Tooltip>
          </Space>
        </div>
      </div>

      
      <Card className="professional-card mb-6 shadow-lg border-0 rounded-lg overflow-hidden">
        <div className="relative">
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 opacity-50"></div>
          
          <div className="relative z-10 p-8">
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={6}>
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar size={120} icon={<UserOutlined />} className="border-4 border-white shadow-lg" style={{
            backgroundColor: '#4e92ff',
            fontSize: '48px'
        }}/>
                    <Badge dot color={userData.status === 'active' ? '#52c41a' : '#ff4d4f'} className="absolute -bottom-2 -right-2"/>
                  </div>
                  <div className="mt-4">
                    <Tag color={getStatusColor(userData.status)} className="px-4 py-2 rounded-full font-medium text-sm">
                      {getStatusIcon(userData.status)} 
                      {userData.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Tag>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} md={18}>
                <div className="space-y-4">
                  <div>
                    <Title level={1} className="!mb-2 !text-gray-800">
                      {userData.name}
                    </Title>
                    <div className="flex items-center space-x-4 mb-4">
                      <Tag color={getRoleColor(userData.role?.name || '')} className="px-4 py-2 rounded-full font-medium text-base">
                        {getRoleIcon(userData.role?.name || '')} 
                        {userData.role?.name || 'N/A'}
                      </Tag>
                      <Text type="secondary" className="text-base">
                        <IdcardOutlined className="mr-2"/>
                        ID: {userData._id?.slice(-8)}
                      </Text>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MailOutlined className="text-blue-600 text-lg"/>
                      </div>
                      <div>
                        <Text type="secondary" className="text-sm">Email</Text>
                        <br />
                        <Text strong className="text-gray-800">
                          {userData.email || 'Chưa cập nhật'}
                        </Text>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <PhoneOutlined className="text-green-600 text-lg"/>
                      </div>
                      <div>
                        <Text type="secondary" className="text-sm">Số điện thoại</Text>
                        <br />
                        <Text strong className="text-gray-800">
                          {userData.phone || 'Chưa cập nhật'}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>


      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          
          <Card title={<div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IdcardOutlined className="text-blue-600"/>
                </div>
                <span className="text-lg font-semibold text-gray-800">Thông tin cá nhân</span>
              </div>} className="professional-card h-full">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserOutlined className="text-blue-500"/>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Họ và tên</Text>
                  <br />
                  <Text strong className="text-gray-800">{userData.name}</Text>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MailOutlined className="text-green-500"/>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Email</Text>
                  <br />
                  <Text strong className="text-gray-800">{userData.email || 'Chưa cập nhật'}</Text>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PhoneOutlined className="text-purple-500"/>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Số điện thoại</Text>
                  <br />
                  <Text strong className="text-gray-800">{userData.phone || 'Chưa cập nhật'}</Text>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <EnvironmentOutlined className="text-orange-500"/>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Địa chỉ</Text>
                  <br />
                  <Text strong className="text-gray-800">{userData.address || 'Chưa cập nhật'}</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        
        <Col xs={24} lg={8}>
          <Card title={<div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <SafetyCertificateOutlined className="text-indigo-600"/>
                </div>
                <span className="text-lg font-semibold text-gray-800">Thông tin hệ thống</span>
              </div>} className="professional-card h-full">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CrownOutlined className="text-yellow-500"/>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Vai trò</Text>
                  <br />
                  <Tag color={getRoleColor(userData.role?.name || '')} className="px-2 py-1 rounded-full font-medium text-xs">
                    {getRoleIcon(userData.role?.name || '')} 
                    {userData.role?.name || 'N/A'}
                  </Tag>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  {getStatusIcon(userData.status)}
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Trạng thái</Text>
                  <br />
                  <Tag color={getStatusColor(userData.status)} className="px-2 py-1 rounded-full font-medium text-xs">
                    {userData.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </Tag>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <CalendarOutlined className="text-red-500"/>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Ngày tạo</Text>
                  <br />
                  <Text strong className="text-gray-800 text-sm">
                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'N/A'}
                  </Text>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClockCircleOutlined className="text-blue-500"/>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Cập nhật lần cuối</Text>
                  <br />
                  <Text strong className="text-gray-800 text-sm">
                    {userData.updatedAt ? new Date(userData.updatedAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'N/A'}
                  </Text>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TeamOutlined className="text-blue-500"/>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Số Task được giao</Text>
                  <br />
                  <Text strong className="text-gray-800">{userData.taskAssignedCount || 0}</Text>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserOutlined className="text-green-500"/>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Số Lead được giao</Text>
                  <br />
                  <Text strong className="text-gray-800">{userData.leadAssignedCount || 0}</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        
        <Col xs={24} lg={8}>
          <Card title={<div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <SettingOutlined className="text-yellow-600"/>
                </div>
                <span className="text-lg font-semibold text-gray-800">Quyền hạn</span>
              </div>} className="professional-card h-full">
            <div className="space-y-4">
              {userData.role?.permissions && userData.role.permissions.length > 0 ? (<>
                  <PermissionSummary permissions={userData.role.permissions}/>
                  <Divider />
                </>) : (<div className="text-center py-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SettingOutlined className="text-gray-400 text-xl"/>
                  </div>
                  <Text type="secondary" className="text-sm">
                    Chưa có quyền hạn được cấp
                  </Text>
                </div>)}
            </div>
          </Card>
        </Col>
      </Row>
    </div>);
};
