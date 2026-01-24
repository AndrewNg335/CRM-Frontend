import { FilterableStatsCard } from '@/components/cards';
import { ProfessionalFormItem, ProfessionalModal } from '@/components/modal';
import { PermissionDisplay } from '@/components/permissions';
import type { User } from '@/interfaces/user';
import { hasAdminAccess } from '@/utilities';
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, CrownOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, EyeOutlined, FilterOutlined, MailOutlined, PhoneOutlined, PlusOutlined, SearchOutlined, TagOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { FilterDropdown, useModalForm, useTable } from '@refinedev/antd';
import { getDefaultFilter, HttpError, useDelete, useDeleteMany, useGetIdentity, useGo, useInvalidate, useList } from '@refinedev/core';
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const UserList = ({ children }: React.PropsWithChildren) => {
    const go = useGo();
    const { mutate: deleteUser } = useDelete();
    const { mutate: deleteManyUsers } = useDeleteMany();
    const { data: currentUser, isLoading: isLoadingUser } = useGetIdentity<User>();
    const invalidate = useInvalidate();
    const hasAccess = hasAdminAccess(currentUser);
    const [activeFilter, setActiveFilter] = useState<string>('total');
    const [originalData, setOriginalData] = useState<readonly User[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const { tableProps, filters, searchFormProps } = useTable<User, HttpError, User>({
        resource: "auth",
        meta: {
            customUrl: `${API_URL}/auth`,
        },
        syncWithLocation: false,
        onSearch: (values) => [
            {
                field: 'search',
                operator: 'contains',
                value: values.name,
            },
        ],
        sorters: {
            initial: [
                {
                    field: 'createdAt',
                    order: 'desc',
                },
            ],
        },
        filters: {
            initial: [
                {
                    field: 'name',
                    operator: 'contains',
                    value: undefined,
                },
            ],
        },
        pagination: {
            pageSize: 12,
        },
        queryOptions: {
            enabled: hasAccess,
        },
    });
    useEffect(() => {
        if (tableProps.dataSource && tableProps.dataSource.length > 0) {
            setOriginalData(tableProps.dataSource);
        }
    }, [tableProps.dataSource]);
    const getFilteredData = (): User[] => {
        if (activeFilter === 'total') {
            return [...originalData];
        }
        switch (activeFilter) {
            case 'active':
                return originalData.filter(user => user.status === 'active');
            case 'inactive':
                return originalData.filter(user => user.status === 'inactive');
            case 'admin':
                return originalData.filter(user => user.role?.name === 'Admin');
            default:
                return [...originalData];
        }
    };
    const handleFilterClick = (filterType: string) => {
        setActiveFilter(filterType);
    };
    const getStatsData = () => {
        const data = getFilteredData();
        return {
            total: (tableProps.pagination && typeof tableProps.pagination === 'object') ? tableProps.pagination.total || 0 : 0,
            active: originalData.filter(user => user.status === 'active').length,
            inactive: originalData.filter(user => user.status === 'inactive').length,
            admin: originalData.filter(user => user.role?.name === 'Admin').length,
        };
    };
    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            Modal.warning({
                title: 'Chưa chọn người dùng',
                content: 'Vui lòng chọn ít nhất một người dùng để xóa.',
            });
            return;
        }
        Modal.confirm({
            title: 'Xác nhận xóa nhiều người dùng',
            content: (<div>
          <p>Bạn có chắc chắn muốn xóa <strong>{selectedRowKeys.length}</strong> người dùng đã chọn?</p>
          <p className="text-red-600 mt-2">
            <ExclamationCircleOutlined className="mr-1"/>
            Hành động này không thể hoàn tác!
          </p>
        </div>),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                deleteManyUsers({
                    resource: 'auth',
                    ids: selectedRowKeys,
                    successNotification: false,
                    errorNotification: false,
                }, {
                    onSuccess: () => {
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        Modal.success({
                            title: 'Xóa thành công',
                            content: `Đã xóa ${selectedRowKeys.length} người dùng thành công.`,
                        });
                        invalidate({
                            resource: "auth",
                            invalidates: ["list", "many"],
                        });
                    },
                    onError: (error: any) => {
                        const message = error?.response?.data?.message ||
                            error?.message ||
                            'Xóa người dùng thất bại, vui lòng thử lại.';
                        Modal.error({
                            title: 'Không thể xóa người dùng',
                            content: message,
                        });
                    },
                });
            },
        });
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
            setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record: User) => ({
            disabled: record._id === currentUser?._id,
            name: record.name,
        }),
    };
    const { formProps, modalProps, show, queryResult, } = useModalForm({
        action: "edit",
        resource: "auth",
        meta: {
            customUrl: (id: string) => `${API_URL}/auth/adminUpdate/${id}`,
        },
        redirect: false,
        mutationMode: "pessimistic",
        successNotification: {
            message: "Cập nhật người dùng thành công",
            type: "success",
        },
        onMutationSuccess: () => {
            invalidate({
                resource: "auth",
                invalidates: ["list", "many"],
            });
        },
    });
    const { formProps: createFormProps, modalProps: createModalProps, show: showCreateModal, } = useModalForm({
        action: "create",
        resource: "auth",
        redirect: false,
        mutationMode: "pessimistic",
        successNotification: {
            message: "Tạo người dùng thành công",
            type: "success",
        },
        onMutationSuccess: () => {
            invalidate({
                resource: "auth",
                invalidates: ["list", "many"],
            });
        },
    });
    const { data: rolesData } = useList({
        resource: "roles",
        pagination: { mode: "off" },
        queryOptions: {
            enabled: hasAccess,
        },
    });
    const roleOptions = rolesData?.data?.map((role: any) => ({
        label: role.name,
        value: role._id,
    })) || [];
    useEffect(() => {
        if (queryResult?.data?.data && formProps?.form) {
            const userData = queryResult.data.data;
            formProps.form.setFieldsValue({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                status: userData.status,
                role: userData.role?._id,
            });
        }
    }, [queryResult?.data?.data, formProps?.form]);
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
                return <i className="fa-solid fa-crown mr-1"/>;
            case 'Manager':
                return <i className="fa-solid fa-user-tie mr-1"/>;
            case 'Employee':
                return <i className="fa-solid fa-user mr-1"/>;
            default:
                return <i className="fa-solid fa-user mr-1"/>;
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

    // Show loading state while checking permissions
    if (isLoadingUser || currentUser === undefined) {
        return (<div className="page-container">
        <Card className="professional-card">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="text-blue-600 text-2xl animate-pulse"/>
            </div>
            <Typography.Title level={3} className="text-gray-800 mb-2">
              Đang tải...
            </Typography.Title>
            <Typography.Text type="secondary" className="text-base">
              Vui lòng đợi trong giây lát
            </Typography.Text>
          </div>
        </Card>
      </div>);
    }

    if (!hasAccess) {
        return (<div className="page-container">
        <Card className="professional-card">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="text-red-600 text-2xl"/>
            </div>
            <Typography.Title level={3} className="text-gray-800 mb-2">
              Không có quyền truy cập
            </Typography.Title>
            <Typography.Text type="secondary" className="text-base">
              Bạn cần có quyền Admin để truy cập trang này. Vui lòng liên hệ quản trị viên.
            </Typography.Text>
          </div>
        </Card>
      </div>);
    }
    return (<div className="page-container">
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography.Title level={2} className="!mb-2 !text-gray-800">
              Quản lý người dùng
            </Typography.Title>
            <Typography.Text type="secondary" className="text-base">
              Quản lý và theo dõi thông tin người dùng trong hệ thống
            </Typography.Text>
          </div>
          <Space>
            <Button icon={<FilterOutlined />} className="professional-button" size="large">
              Bộ lọc
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showCreateModal()} className="professional-button" size="large">
              Thêm người dùng
            </Button>
          </Space>
        </div>

        <Card className="mb-4" bodyStyle={{ padding: '16px 24px' }}>
          <Form {...searchFormProps} layout="inline" style={{ width: '100%' }}>
            <Form.Item name="name" style={{ marginBottom: 0, width: '100%' }}>
              <Input.Search placeholder="Tìm kiếm người dùng theo tên, email..." size="large" className="professional-input" style={{ maxWidth: 600 }} onSearch={() => searchFormProps?.form?.submit?.()} allowClear/>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Tổng người dùng" value={getStatsData().total} color="#3b82f6"/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Đang hoạt động" value={getStatsData().active} color="#10b981"/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Không hoạt động" value={getStatsData().inactive} color="#ef4444"/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Quản trị viên" value={getStatsData().admin} color="#f59e0b"/>
        </Col>
      </Row>

      {selectedRowKeys.length > 0 && (<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationCircleOutlined className="text-red-600 text-lg"/>
              </div>
              <div>
                <Typography.Text strong className="text-red-800 text-base">
                  Đã chọn {selectedRowKeys.length} người dùng
                </Typography.Text>
                <br />
                <Typography.Text className="text-red-600 text-sm">
                  Nhấn nút bên dưới để xóa tất cả người dùng đã chọn
                </Typography.Text>
              </div>
            </div>
            <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete} size="large" className="!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700 !text-white font-semibold px-6 py-2 h-auto">
              Xóa đã chọn ({selectedRowKeys.length})
            </Button>
          </div>
        </div>)}

      <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
        <Table {...tableProps} dataSource={getFilteredData()} rowSelection={rowSelection} pagination={{
            ...tableProps.pagination,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
            className: "custom-pagination",
        }} rowKey="_id" className="professional-table" size="middle" scroll={{ x: 1200 }}>
          <Table.Column<User> dataIndex="search" title={<div className="flex items-center space-x-2">
                <UserOutlined className="text-blue-500"/>
                <span className="font-semibold">Tên người dùng</span>
              </div>} defaultFilteredValue={getDefaultFilter('_id', filters)} filterIcon={<SearchOutlined />} filterDropdown={(props) => (<FilterDropdown {...props}>
                <Input placeholder="Tìm kiếm người dùng"/>
              </FilterDropdown>)}             render={(_, record) => (<div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserOutlined className="text-blue-600 text-lg"/>
                </div>
                <div className="flex-1 min-w-0">
                  <Typography.Text strong className="text-gray-800">
                    {record.name}
                  </Typography.Text>
                  <br />
                  <Typography.Text className="text-xs text-gray-500">
                    ID: {record._id?.slice(-6)}
                  </Typography.Text>
                </div>
              </div>)} width={200}/>
          
          <Table.Column<User> dataIndex="email" title={<div className="flex items-center space-x-2">
                <MailOutlined className="text-green-500"/>
                <span className="font-semibold">Email</span>
              </div>} defaultFilteredValue={getDefaultFilter('search', filters)} filterIcon={<SearchOutlined />} filterDropdown={(props) => (<FilterDropdown {...props}>
                <Input placeholder="Tìm kiếm email"/>
              </FilterDropdown>)} render={(email) => (<Typography.Text className="text-gray-700">
                {email || '-'}
              </Typography.Text>)} width={200}/>

          <Table.Column<User> dataIndex="phone" title={<div className="flex items-center space-x-2">
                <PhoneOutlined className="text-purple-500"/>
                <span className="font-semibold">Số điện thoại</span>
              </div>} render={(phone) => (<Typography.Text className="text-gray-700">
                {phone || '-'}
              </Typography.Text>)} width={150}/>
          
          <Table.Column<User> dataIndex="role" title={<div className="flex items-center space-x-2">
                <CrownOutlined className="text-orange-500"/>
                <span className="font-semibold">Vai trò & Quyền</span>
              </div>} render={(role) => (<div className="space-y-2">
                <Tag color={getRoleColor(role?.name || '')} className="px-3 py-1 rounded-full font-medium">
                  {getRoleIcon(role?.name || '')} {role?.name || 'N/A'}
                </Tag>
                {role?.permissions && (<PermissionDisplay permissions={role.permissions} maxDisplay={3} showCategories={false}/>)}
              </div>)} width={200} filters={[
            { text: 'Admin', value: 'Admin' },
            { text: 'Manager', value: 'Manager' },
            { text: 'Employee', value: 'Employee' },
        ]} onFilter={(value, record) => record.role?.name === value}/>

          <Table.Column<User> dataIndex="status" title={<div className="flex items-center space-x-2">
                <CheckCircleOutlined className="text-green-500"/>
                <span className="font-semibold">Trạng thái</span>
              </div>} render={(status) => (<Tag color={getStatusColor(status || '')} className="px-3 py-1 rounded-full font-medium">
                {getStatusIcon(status || '')} {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </Tag>)} width={130} filters={[
            { text: 'Hoạt động', value: 'active' },
            { text: 'Không hoạt động', value: 'inactive' },
        ]} onFilter={(value, record) => record.status === value}/>

          <Table.Column<User> dataIndex="createdAt" title={<div className="flex items-center space-x-2">
                <CalendarOutlined className="text-red-500"/>
                <span className="font-semibold">Ngày tạo</span>
              </div>} render={(date) => (<Typography.Text className="text-gray-700">
                {date ? new Date(date).toLocaleDateString('vi-VN') : '-'}
              </Typography.Text>)} width={120} sorter={(a, b) => {
            if (!a.createdAt)
                return 1;
            if (!b.createdAt)
                return -1;
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }}/>

          <Table.Column<User> fixed="right" dataIndex="_id" title={<div className="flex items-center justify-center">
                <span className="font-semibold">Thao tác</span>
              </div>} render={(value, record) => (<Space size="small">
                <Tooltip title="Xem chi tiết">
                  <Button icon={<EyeOutlined />} size="small" onClick={() => go({ to: `/users/show/${value}` })} className="!border-blue-200 !text-blue-600 hover:!border-blue-400 hover:!text-blue-800"/>
                </Tooltip>
                <Tooltip title="Chỉnh sửa">
                  <Button size="small" icon={<EditOutlined />} onClick={() => show(value)} className="!border-green-200 !text-green-600 hover:!border-green-400 hover:!text-green-800"/>
                </Tooltip>
                <Tooltip title="Xóa">
                  <Button size="small" icon={<DeleteOutlined />} onClick={() => {
                Modal.confirm({
                    title: 'Xác nhận xóa',
                    content: 'Bạn có chắc chắn muốn xóa người dùng này?',
                    okText: 'Xóa',
                    cancelText: 'Hủy',
                    okType: 'danger',
                    onOk: () => {
                        deleteUser({
                            resource: 'auth',
                            id: value,
                            successNotification: false,
                            errorNotification: false,
                        }, {
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
            }} className="!border-red-200 !text-red-600 hover:!border-red-400 hover:!text-red-800"/>
                </Tooltip>
            </Space>)} width={140}/>
      </Table>
      </Card>

      {children}

      <Modal {...modalProps} centered okText="Lưu" cancelText="Hủy"  title={<div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserOutlined className="text-blue-600"/>
          </div>
          <span className="text-lg font-semibold text-gray-800">Chỉnh sửa người dùng</span>
        </div>} destroyOnClose className="professional-modal enhanced-modal" width={800} styles={{
            body: { padding: "24px", maxHeight: "calc(80vh - 200px)", overflowY: "auto" }
        }}>
        <Form {...formProps} layout="vertical" className="space-y-4">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UserOutlined className="text-blue-500"/>
                    Tên người dùng
                  </span>} name="name" rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}>
                <Input className="professional-input enhanced-input" placeholder="Nhập tên người dùng" size="large"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <TagOutlined className="text-green-500"/>
                    Trạng thái
                  </span>} name="status">
                <Select className="professional-input enhanced-input" placeholder="Chọn trạng thái" size="large" options={[
            { label: "Hoạt động", value: "active" },
            { label: "Không hoạt động", value: "inactive" }
        ]}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CrownOutlined className="text-yellow-500"/>
                    Vai trò
                  </span>} name="role">
                <Select className="professional-input enhanced-input" options={roleOptions} placeholder="Chọn vai trò" size="large" filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <PhoneOutlined className="text-purple-500"/>
                    Số điện thoại
                  </span>} name="phone" rules={[
            { pattern: /^[0-9+\-\s()]+$/, message: "Số điện thoại không hợp lệ" }
        ]}>
                <Input className="professional-input enhanced-input" placeholder="Nhập số điện thoại" size="large"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MailOutlined className="text-orange-500"/>
                    Email
                  </span>} name="email" rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
        ]}>
                <Input className="professional-input enhanced-input" placeholder="Nhập email" size="large"/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <UserOutlined className="text-indigo-500"/>
                Địa chỉ
              </span>} name="address">
            <Input className="professional-input enhanced-input" placeholder="Nhập địa chỉ" size="large"/>
          </Form.Item>

          <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <UserOutlined className="text-red-500"/>
                Mật khẩu mới
              </span>} name="password" help="Để trống nếu không muốn thay đổi mật khẩu">
            <Input.Password className="professional-input enhanced-input" placeholder="Nhập mật khẩu mới" size="large"/>
          </Form.Item>
        </Form>
      </Modal>

      <ProfessionalModal {...createModalProps} okText="Lưu" cancelText="Hủy" title="Thêm người dùng mới" icon={<UserOutlined className="text-blue-600"/>} width={700} destroyOnClose>
        <Form {...createFormProps} layout="vertical" className="space-y-4">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Tên người dùng" name="name" icon={<UserOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}>
                <Input placeholder="Nhập tên người dùng"/>
              </ProfessionalFormItem>
            </Col>
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Trạng thái" name="status" icon={<TagOutlined className="text-green-500"/>} initialValue="active">
                <Select placeholder="Chọn trạng thái" options={[
            { label: "Hoạt động", value: "active" },
            { label: "Không hoạt động", value: "inactive" }
        ]}/>
              </ProfessionalFormItem>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Email" name="email" icon={<MailOutlined className="text-orange-500"/>} rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
        ]}>
                <Input placeholder="Nhập email"/>
              </ProfessionalFormItem>
            </Col>
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Mật khẩu" name="password" icon={<UserOutlined className="text-red-500"/>} rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
        ]}>
                <Input placeholder="Nhập mật khẩu"/>
              </ProfessionalFormItem>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Số điện thoại" name="phone" icon={<PhoneOutlined className="text-purple-500"/>} rules={[
            { pattern: /^[0-9+\-\s()]+$/, message: "Số điện thoại không hợp lệ" }
        ]}>
                <Input placeholder="Nhập số điện thoại"/>
              </ProfessionalFormItem>
            </Col>
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Địa chỉ" name="address" icon={<UserOutlined className="text-indigo-500"/>}>
                <Input placeholder="Nhập địa chỉ"/>
              </ProfessionalFormItem>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Vai trò" name="role" icon={<CrownOutlined className="text-yellow-500"/>} rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
                <Select options={roleOptions} placeholder="Chọn vai trò" showSearch filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}/>
              </ProfessionalFormItem>
            </Col>
          </Row>
        </Form>
      </ProfessionalModal>
    </div>);
};