import { FilterableStatsCard } from '@/components/cards';
import { ProfessionalFormItem, ProfessionalModal } from '@/components/modal';
import type { Role } from '@/interfaces/role';
import { PERMISSION_CATEGORIES, PERMISSION_DESCRIPTIONS } from '@/interfaces/role';
import type { User } from '@/interfaces/user';
import { hasAdminAccess } from '@/utilities';
import {
  CheckOutlined, CloseOutlined, CrownOutlined, DeleteOutlined,
  EditOutlined, ExclamationCircleOutlined, EyeOutlined, FilterOutlined,
  PlusOutlined, SearchOutlined, SettingOutlined, TeamOutlined,
  UserOutlined, UserSwitchOutlined
} from '@ant-design/icons';
import { FilterDropdown, useModalForm, useTable } from '@refinedev/antd';
import { getDefaultFilter, HttpError, useDelete, useDeleteMany, useGetIdentity, useGo, useInvalidate } from '@refinedev/core';
import { Badge, Button, Card, Checkbox, Col, Form, Input, Modal, Row, Space, Table, Tooltip, Typography } from 'antd';
import React, { useCallback, useMemo } from "react";
const ROLE_FILTER_TYPES = {
  TOTAL: 'total',
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
} as const;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getRoleIcon = (roleName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Admin': <CrownOutlined className="mr-1"/>,
    'Sales Manager': <UserSwitchOutlined className="mr-1"/>,
    'Sales': <UserOutlined className="mr-1"/>
  };
  return iconMap[roleName] || <TeamOutlined className="mr-1"/>;
};

const normalizePermissions = (permissions: unknown): string[] => {
  if (Array.isArray(permissions)) return permissions;
  if (permissions && typeof permissions === 'object') {
    return Object.entries(permissions as Record<string, any>)
      .filter(([, v]) => !!v)
      .map(([k]) => k);
  }
  return [];
};

const PermissionCategory = ({ category, categoryKey }: { category: any, categoryKey: string }) => (
  <Card key={categoryKey} size="small" className="border border-gray-200">
    <div className="mb-3 flex items-center justify-between">
      <div>
        <Typography.Text strong className="text-gray-800">
          {category.name}
        </Typography.Text>
        <Typography.Text className="text-gray-500 ml-2">
          ({category.permissions.length} quyền)
        </Typography.Text>
      </div>
      <Form.Item shouldUpdate className="!mb-0">
        {({ getFieldValue, setFieldValue }) => {
          const selectedPermissions = (getFieldValue('permissions') || []) as string[];
          const categoryPermissions = category.permissions as unknown as string[];
          const isAllSelected = categoryPermissions.every((p: string) => selectedPermissions.includes(p));
          const isSomeSelected = categoryPermissions.some((p: string) => selectedPermissions.includes(p));

          const handleSelectAll = () => {
            const currentPermissions = (getFieldValue('permissions') || []) as string[];
            const newPermissions = [...new Set([...currentPermissions, ...categoryPermissions])];
            setFieldValue('permissions', newPermissions);
          };

          const handleDeselectAll = () => {
            const currentPermissions = (getFieldValue('permissions') || []) as string[];
            const newPermissions = currentPermissions.filter((p: string) => !categoryPermissions.includes(p));
            setFieldValue('permissions', newPermissions);
          };

          return (
            <Space size="small">
              <Button
                type={isAllSelected ? "primary" : "default"}
                size="small"
                icon={<CheckOutlined />}
                onClick={handleSelectAll}
                className={isAllSelected ? "!bg-green-500 !border-green-500" : ""}
              >
                Tất cả
              </Button>
              {(isSomeSelected || isAllSelected) && (
                <Button
                  type="default"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={handleDeselectAll}
                  className="!text-red-500 !border-red-500 hover:!bg-red-50"
                >
                  Bỏ chọn
                </Button>
              )}
            </Space>
          );
        }}
      </Form.Item>
    </div>
    <div className="space-y-2">
      {category.permissions.map((permission: string) => (
        <div key={permission}>
          <Checkbox value={permission} className="w-full">
            <div className="flex flex-col">
              <Typography.Text className="text-sm font-medium">
                {permission}
              </Typography.Text>
              <Typography.Text className="text-xs text-gray-500">
                {PERMISSION_DESCRIPTIONS[permission]}
              </Typography.Text>
            </div>
          </Checkbox>
        </div>
      ))}
    </div>
  </Card>
);

const LoadingAccess = () => (
  <div className="page-container">
    <Card className="professional-card">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CrownOutlined className="text-blue-600 text-2xl animate-pulse"/>
        </div>
        <Typography.Title level={3} className="text-gray-800 mb-2">
          Đang tải...
        </Typography.Title>
        <Typography.Text type="secondary" className="text-base">
          Vui lòng đợi trong giây lát
        </Typography.Text>
      </div>
    </Card>
  </div>
);

const UnauthorizedAccess = () => (
  <div className="page-container">
    <Card className="professional-card">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CrownOutlined className="text-red-600 text-2xl"/>
        </div>
        <Typography.Title level={3} className="text-gray-800 mb-2">
          Không có quyền truy cập
        </Typography.Title>
        <Typography.Text type="secondary" className="text-base">
          Bạn cần có quyền Admin để truy cập trang này. Vui lòng liên hệ quản trị viên.
        </Typography.Text>
      </div>
    </Card>
  </div>
);

export const RoleList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { mutate: deleteRole } = useDelete();
  const { mutate: deleteManyRoles } = useDeleteMany();
  const { data: currentUser, isLoading: isLoadingUser } = useGetIdentity<User>();
  const invalidate = useInvalidate();

  const hasAccess = hasAdminAccess(currentUser);

  const [activeFilter, setActiveFilter] = React.useState<string>(ROLE_FILTER_TYPES.TOTAL);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<Role[]>([]);
  const [editingRecord, setEditingRecord] = React.useState<Role | null>(null);

  const { tableProps, filters, searchFormProps } = useTable<Role, HttpError, Role>({
    resource: "roles",
    meta: { customUrl: `${API_BASE_URL}/roles` },
    syncWithLocation: false,
    onSearch: (values) => [{
      field: 'search',
      operator: 'contains',
      value: values.name,
    }],
    sorters: {
      initial: [{ field: 'createdAt', order: 'desc' }]
    },
    filters: {
      initial: [{ field: 'name', operator: 'contains', value: undefined }]
    },
    pagination: { pageSize: 12 },
    queryOptions: { enabled: hasAccess }
  });

  const filteredData = useMemo(() => {
    if (!tableProps.dataSource) return [];
    
    if (activeFilter === ROLE_FILTER_TYPES.TOTAL) {
      return [...tableProps.dataSource];
    }

  }, [tableProps.dataSource, activeFilter]);

  const statsData = useMemo(() => ({
    total: tableProps.pagination && typeof tableProps.pagination === 'object'
      ? tableProps.pagination.total || 0
      : 0,
    admin: tableProps.dataSource?.filter(role => role.name === 'Admin').length || 0,
    permissions: 56
  }), [tableProps.pagination, tableProps.dataSource]);

  const handleFilterClick = useCallback((filterType: string) => {
    setActiveFilter(filterType);
  }, []);

  const handleInvalidate = useCallback(() => {
    invalidate({
      resource: "roles",
      invalidates: ["list", "many"]
    });
  }, [invalidate]);

  const handleBulkDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      Modal.warning({
        title: 'Chưa chọn vai trò',
        content: 'Vui lòng chọn ít nhất một vai trò để xóa.'
      });
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa nhiều vai trò',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa <strong>{selectedRowKeys.length}</strong> vai trò đã chọn?</p>
          <p className="text-red-600 mt-2">
            <ExclamationCircleOutlined className="mr-1"/>
            Hành động này không thể hoàn tác!
          </p>
        </div>
      ),
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        deleteManyRoles(
          {
            resource: 'roles',
            ids: selectedRowKeys,
            successNotification: false,
            errorNotification: false
          },
          {
            onSuccess: () => {
              setSelectedRowKeys([]);
              setSelectedRows([]);
              Modal.success({
                title: 'Xóa thành công',
                content: `Đã xóa ${selectedRowKeys.length} vai trò thành công.`
              });
              handleInvalidate();
            },
            onError: (error: any) => {
              Modal.error({
                title: 'Không thể xóa vai trò',
                content: error?.response?.data?.message || error?.message || 'Xóa vai trò thất bại, vui lòng thử lại.'
              });
            }
          }
        );
      }
    });
  }, [selectedRowKeys, deleteManyRoles, handleInvalidate]);

  const handleDeleteSingle = useCallback((id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa vai trò này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        deleteRole(
          {
            resource: 'roles',
            id,
            successNotification: false,
            errorNotification: false
          },
          {
            onError: (error: any) => {
              Modal.error({
                title: 'Không thể xóa vai trò',
                content: error?.response?.data?.message || error?.message || 'Xóa vai trò thất bại, vui lòng thử lại.'
              });
            }
          }
        );
      }
    });
  }, [deleteRole]);

  const rowSelection = useMemo(() => ({
    selectedRowKeys,
    onChange: (keys: React.Key[], rows: Role[]) => {
      setSelectedRowKeys(keys as string[]);
      setSelectedRows(rows);
    },
    getCheckboxProps: (record: Role) => ({
      disabled: record.name === 'Admin',
      name: record.name
    })
  }), [selectedRowKeys]);

  const { formProps, modalProps, show } = useModalForm<any>({
    action: "edit",
    resource: "roles",
    meta: { customUrl: (id: string) => `${API_BASE_URL}/roles/${id}` },
    redirect: false,
    mutationMode: "pessimistic",
    autoSubmitClose: true,
    autoResetForm: false,
    successNotification: {
      message: "Cập nhật vai trò thành công",
      type: "success"
    },
    onMutationSuccess: handleInvalidate
  });

  const handleOpenEdit = useCallback((record: Role) => {
    setEditingRecord(record);
    show(record._id);
    if (formProps?.form) {
      formProps.form.setFieldsValue(record);
    }
  }, [show, formProps]);

  const { formProps: createFormProps, modalProps: createModalProps, show: showCreateModal } = useModalForm({
    action: "create",
    resource: "roles",
    redirect: false,
    mutationMode: "pessimistic",
    successNotification: {
      message: "Tạo vai trò thành công",
      type: "success"
    },
    onMutationSuccess: handleInvalidate
  });

  // Show loading state while checking permissions
  if (isLoadingUser || currentUser === undefined) {
    return <LoadingAccess />;
  }

  if (!hasAccess) {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography.Title level={2} className="!mb-2 !text-gray-800">
              Quản lý vai trò
            </Typography.Title>
            <Typography.Text type="secondary" className="text-base">
              Quản lý và phân quyền vai trò trong hệ thống
            </Typography.Text>
          </div>
          <Space>
            <Button icon={<FilterOutlined />} className="professional-button" size="large">
              Bộ lọc
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showCreateModal()}
              className="professional-button"
              size="large"
            >
              Thêm vai trò
            </Button>
          </Space>
        </div>

        <Card className="mb-4" bodyStyle={{ padding: '16px 24px' }}>
          <Form {...searchFormProps} layout="inline" style={{ width: '100%' }}>
            <Form.Item name="name" style={{ marginBottom: 0, width: '100%' }}>
              <Input.Search
                placeholder="Tìm kiếm vai trò theo tên..."
                size="large"
                className="professional-input"
                style={{ maxWidth: 600 }}
                onSearch={() => searchFormProps?.form?.submit?.()}
                allowClear
              />
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <FilterableStatsCard
            title="Tổng vai trò"
            value={statsData.total}
            color="#3b82f6"
          />
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard
            title="Tổng quyền hạn"
            value={statsData.permissions}
            color="#3b82f6"
          />
        </Col>
      </Row>

      {selectedRowKeys.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationCircleOutlined className="text-red-600 text-lg"/>
              </div>
              <div>
                <Typography.Text strong className="text-red-800 text-base">
                  Đã chọn {selectedRowKeys.length} vai trò
                </Typography.Text>
                <br />
                <Typography.Text className="text-red-600 text-sm">
                  Nhấn nút bên dưới để xóa tất cả vai trò đã chọn
                </Typography.Text>
              </div>
            </div>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBulkDelete}
              size="large"
              className="!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700 !text-white font-semibold px-6 py-2 h-auto"
            >
              Xóa đã chọn ({selectedRowKeys.length})
            </Button>
          </div>
        </div>
      )}

      <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
        <Table
          {...tableProps}
          dataSource={filteredData}
          rowSelection={rowSelection}
          pagination={{
            ...tableProps.pagination,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} vai trò`,
            className: "custom-pagination"
          }}
          rowKey="_id"
          className="professional-table"
          size="middle"
          scroll={{ x: 1200 }}
        >
          <Table.Column<Role>
            dataIndex="name"
            title={
              <div className="flex items-center space-x-2">
                <CrownOutlined className="text-blue-500"/>
                <span className="font-semibold">Tên vai trò</span>
              </div>
            }
            defaultFilteredValue={getDefaultFilter('name', filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Tìm kiếm vai trò"/>
              </FilterDropdown>
            )}
            render={(name, record) => (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getRoleIcon(name)}
                </div>
                <div className="flex-1 min-w-0">
                  <Typography.Text strong className="text-gray-800">
                    {name}
                  </Typography.Text>
                  <br />
                  <Typography.Text className="text-xs text-gray-500">
                    ID: {record._id?.slice(-6)}
                  </Typography.Text>
                </div>
              </div>
            )}
            width={200}
          />

          <Table.Column<Role>
            dataIndex="permissions"
            title={
              <div className="flex items-center space-x-2">
                <SettingOutlined className="text-purple-500"/>
                <span className="font-semibold">Số quyền</span>
              </div>
            }
            render={(permissions) => (
              <Badge
                count={permissions?.length || 0}
                style={{ backgroundColor: '#3b82f6' }}
                showZero
              />
            )}
            width={120}
            sorter={(a, b) => (a.permissions?.length || 0) - (b.permissions?.length || 0)}
          />

          <Table.Column<Role>
            fixed="right"
            dataIndex="_id"
            title={
              <div className="flex items-center justify-center">
                <span className="font-semibold">Thao tác</span>
              </div>
            }
            render={(value, record) => (
              <Space size="small">
                <Tooltip title="Xem chi tiết">
                  <Button
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => go({ to: `/roles/show/${value}` })}
                    className="!border-blue-200 !text-blue-600 hover:!border-blue-400 hover:!text-blue-800"
                  />
                </Tooltip>
                <Tooltip title="Chỉnh sửa">
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleOpenEdit(record)}
                    className="!border-green-200 !text-green-600 hover:!border-green-400 hover:!text-green-800"
                  />
                </Tooltip>
                <Tooltip title="Xóa">
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    disabled={record.name === 'Admin'}
                    onClick={() => handleDeleteSingle(value)}
                    className="!border-red-200 !text-red-600 hover:!border-red-400 hover:!text-red-800"
                  />
                </Tooltip>
              </Space>
            )}
            width={50}
          />
        </Table>
      </Card>

      {children}

      <Modal
        {...modalProps}
        centered
        okText="Lưu"
        cancelText="Hủy"
        forceRender
        destroyOnClose={false}
        afterClose={() => {
          formProps?.form?.resetFields?.();
          setEditingRecord(null);
        }}
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <CrownOutlined className="text-blue-600"/>
            </div>
            <span className="text-lg font-semibold text-gray-800">Chỉnh sửa vai trò</span>
          </div>
        }
        className="professional-modal enhanced-modal"
        width={900}
        styles={{
          body: { padding: "24px", maxHeight: "calc(80vh - 200px)", overflowY: "auto" }
        }}
      >
        <Form
          {...formProps}
          layout="vertical"
          className="space-y-4"
          key={editingRecord?._id || 'new'}
          initialValues={{
            name: editingRecord?.name || '',
            permissions: editingRecord ? normalizePermissions(editingRecord.permissions) : []
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CrownOutlined className="text-blue-500"/>
                    Tên vai trò
                  </span>
                }
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên vai trò" }]}
              >
                <Input className="professional-input enhanced-input" placeholder="Nhập tên vai trò" size="large"/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SettingOutlined className="text-purple-500"/>
                Quyền hạn
              </span>
            }
            name="permissions"
            rules={[{ required: true, message: "Vui lòng chọn ít nhất một quyền" }]}
          >
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(PERMISSION_CATEGORIES).map(([key, category]) => (
                  <PermissionCategory key={key} category={category} categoryKey={key} />
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>

      <ProfessionalModal
        {...createModalProps}
        okText="Lưu"
        cancelText="Hủy"
        title="Thêm vai trò mới"
        icon={<CrownOutlined className="text-blue-600"/>}
        width={900}
        destroyOnClose
      >
        <Form {...createFormProps} layout="vertical" className="space-y-4">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem
                label="Tên vai trò"
                name="name"
                icon={<CrownOutlined className="text-blue-500"/>}
                rules={[{ required: true, message: "Vui lòng nhập tên vai trò" }]}
              >
                <Input placeholder="Nhập tên vai trò"/>
              </ProfessionalFormItem>
            </Col>
          </Row>

          <ProfessionalFormItem
            label="Quyền hạn"
            name="permissions"
            icon={<SettingOutlined className="text-purple-500"/>}
            rules={[{ required: true, message: "Vui lòng chọn ít nhất một quyền" }]}
          >
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(PERMISSION_CATEGORIES).map(([key, category]) => (
                  <PermissionCategory key={key} category={category} categoryKey={key} />
                ))}
              </div>
            </Checkbox.Group>
          </ProfessionalFormItem>
        </Form>
      </ProfessionalModal>
    </div>
  );
};