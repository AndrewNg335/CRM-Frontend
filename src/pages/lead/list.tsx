import { LeadEditModal, LeadCreateModal } from '@/components/modal';
import { FilterableStatsCard } from '@/components/cards';
import { Lead } from '@/interfaces/lead';
import { DeleteOutlined, EditOutlined, EnvironmentOutlined, EyeOutlined, FileTextOutlined, FilterOutlined, LinkOutlined, MailOutlined, PhoneOutlined, PlusOutlined, SearchOutlined, TagOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { EditButton, FilterDropdown, useModalForm, useTable, useSelect } from '@refinedev/antd';
import { getDefaultFilter, HttpError, useDelete, useDeleteMany, useGo, useGetIdentity, useInvalidate, useCustom } from '@refinedev/core';
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import type { User } from '@/interfaces/user';
export const LeadList = ({ children }: React.PropsWithChildren) => {
    const go = useGo();
    const { mutate: deleteLead } = useDelete();
    const { mutate: deleteManyLeads } = useDeleteMany();
    const { data: currentUser } = useGetIdentity<User>();
    const invalidate = useInvalidate();
    const isAdmin = currentUser?.role?.name === 'Admin';
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<Lead[]>([]);
    const { tableProps, filters, searchFormProps } = useTable<Lead, HttpError, Lead>({
        resource: isAdmin ? 'leads' : `leads/user/${currentUser?._id}`,
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
    });

    const statsUrl = React.useMemo(() => {
        if (!currentUser?._id) return null;
        return isAdmin ? 'leads/stats' : `leads/user/${currentUser._id}/stats`;
    }, [isAdmin, currentUser?._id]);

    const { data: statsData } = useCustom<{
        data: {
            total: number;
            new: number;
            contacting: number;
            converted: number;
            not_interested: number;
        }
    }>({
        url: statsUrl || 'leads/stats',
        method: 'get',
        queryOptions: {
            enabled: !!statsUrl,
        },
    });

    const stats = statsData?.data?.data || {
        total: 0,
        new: 0,
        contacting: 0,
        converted: 0,
        not_interested: 0,
    };
    const { formProps, modalProps, show, } = useModalForm({
        action: "edit",
        resource: "leads",
        redirect: false,
        mutationMode: "pessimistic",
        successNotification: {
            message: "Cập nhật khách hàng thành công",
            type: "success",
        },
        onMutationSuccess: () => {
            invalidate({
                resource: "leads",
                invalidates: ["list", "many"],
            });
            if (!isAdmin && currentUser?._id) {
                invalidate({
                    resource: `leads/user/${currentUser._id}`,
                    invalidates: ["list", "many"],
                });
            }
            // Invalidate stats
            if (statsUrl) {
                invalidate({
                    resource: statsUrl,
                    invalidates: ["all"],
                });
            }
        },
    });
    React.useEffect(() => {
        if (formProps?.form && currentUser?._id) {
            formProps.form.setFieldsValue({
                responsibleUserId: currentUser._id,
            });
        }
    }, [formProps?.form, currentUser?._id]);
    const { formProps: createFormProps, modalProps: createModalProps, show: showCreateModal, } = useModalForm({
        action: "create",
        resource: "leads",
        redirect: false,
        mutationMode: "pessimistic",
        successNotification: {
            message: "Tạo khách hàng thành công",
            type: "success",
        },
        onMutationSuccess: () => {
            invalidate({
                resource: "leads",
                invalidates: ["list", "many"],
            });
            if (!isAdmin && currentUser?._id) {
                invalidate({
                    resource: `leads/user/${currentUser._id}`,
                    invalidates: ["list", "many"],
                });
            }
            // Invalidate stats
            if (statsUrl) {
                invalidate({
                    resource: statsUrl,
                    invalidates: ["all"],
                });
            }
        },
    });
    const { selectProps: rawOwnerSelectProps } = useSelect({
        resource: "auth",
        optionLabel: "name",
        optionValue: "_id",
        pagination: { mode: 'off' },
        queryOptions: { enabled: isAdmin },
    });
    const ownerSelectProps = React.useMemo(() => ({ ...rawOwnerSelectProps }), [rawOwnerSelectProps]);
    React.useEffect(() => {
        if (createFormProps?.form && currentUser?._id) {
            createFormProps.form.setFieldsValue({
                responsibleUserId: currentUser._id,
                status: 'new',
            });
        }
    }, [createFormProps?.form, currentUser?._id]);
    React.useEffect(() => {
        if (createModalProps?.open && createFormProps?.form && currentUser?._id) {
            createFormProps.form.resetFields();
            createFormProps.form.setFieldsValue({
                responsibleUserId: currentUser._id,
                status: 'new',
            });
        }
    }, [createModalProps?.open, createFormProps?.form, currentUser?._id]);
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'blue';
            case 'contacting': return 'orange';
            case 'converted': return 'green';
            case 'not_interested': return 'red';
            default: return 'default';
        }
    };
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Mới';
            case 'contacting': return 'Đang liên hệ';
            case 'converted': return 'Đã chuyển đổi';
            case 'not_interested': return 'Không quan tâm';
            default: return status;
        }
    };
    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'website':
                return <i className="fa-solid fa-globe text-blue-500"/>;
            case 'facebook':
                return <i className="fa-brands fa-facebook text-blue-600"/>;
            case 'google_ads':
                return <i className="fa-brands fa-google text-red-500"/>;
            case 'referral':
                return <i className="fa-solid fa-user-group text-green-500"/>;
            default:
                return <i className="fa-regular fa-clipboard text-gray-400"/>;
        }
    };
    const getSourceLabel = (source: string) => {
        switch (source) {
            case 'website': return 'Website';
            case 'facebook': return 'Facebook';
            case 'google_ads': return 'Google Ads';
            case 'referral': return 'Giới thiệu';
            case 'other': return 'Khác';
            default: return source?.replace('_', ' ');
        }
    };
    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            Modal.warning({
                title: 'Chưa chọn khách hàng',
                content: 'Vui lòng chọn ít nhất một khách hàng để xóa.',
            });
            return;
        }
        Modal.confirm({
            title: 'Xác nhận xóa nhiều khách hàng',
            content: (<div>
          <p>Bạn có chắc chắn muốn xóa <strong>{selectedRowKeys.length}</strong> khách hàng đã chọn?</p>
          <p className="text-red-600 mt-2">
            <ExclamationCircleOutlined className="mr-1"/>
            Hành động này không thể hoàn tác!
          </p>
        </div>),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                deleteManyLeads({
                    resource: 'leads',
                    ids: selectedRowKeys,
                    successNotification: false,
                    errorNotification: false,
                }, {
                    onSuccess: () => {
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        Modal.success({
                            title: 'Xóa thành công',
                            content: `Đã xóa ${selectedRowKeys.length} khách hàng thành công.`,
                        });
                        invalidate({
                            resource: "leads",
                            invalidates: ["list", "many"],
                        });
                        if (!isAdmin && currentUser?._id) {
                            invalidate({
                                resource: `leads/user/${currentUser._id}`,
                                invalidates: ["list", "many"],
                            });
                        }
                        // Invalidate stats
                        if (statsUrl) {
                            invalidate({
                                resource: statsUrl,
                                invalidates: ["all"],
                            });
                        }
                    },
                    onError: (error: any) => {
                        const message = error?.response?.data?.message ||
                            error?.message ||
                            'Xóa khách hàng thất bại, vui lòng thử lại.';
                        Modal.error({
                            title: 'Không thể xóa khách hàng',
                            content: message,
                        });
                    },
                });
            },
        });
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: Lead[]) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
            setSelectedRows(selectedRows);
        },
    };
    return (<div className="page-container">
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography.Title level={2} className="!mb-2 !text-gray-800">
              Quản lý khách hàng tiềm năng
            </Typography.Title>
            <Typography.Text type="secondary" className="text-base">
              Quản lý và theo dõi thông tin khách hàng tiềm năng
            </Typography.Text>
          </div>
          <Space>
            <Button icon={<FilterOutlined />} className="professional-button" size="large">
              Bộ lọc
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showCreateModal()} className="professional-button" size="large">
              Thêm khách hàng
            </Button>
          </Space>
        </div>

        <Card className="mb-4" bodyStyle={{ padding: '16px 24px' }}>
          <Form {...searchFormProps} layout="inline" style={{ width: '100%' }}>
            <Form.Item name="name" style={{ marginBottom: 0, width: '100%' }}>
              <Input.Search placeholder="Tìm kiếm khách hàng theo tên, email, số điện thoại" size="large" className="professional-input" style={{ maxWidth: 600 }} onSearch={() => searchFormProps?.form?.submit?.()} allowClear/>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Tổng khách hàng" value={stats.total} color="#3b82f6"/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Đã chuyển đổi" value={stats.converted} color="#10b981"/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Đang liên hệ" value={stats.contacting} color="#f59e0b"/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Khách hàng mới" value={stats.new} color="#8b5cf6"/>
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
                  Đã chọn {selectedRowKeys.length} khách hàng
                </Typography.Text>
                <br />
                <Typography.Text className="text-red-600 text-sm">
                  Nhấn nút bên dưới để xóa tất cả khách hàng đã chọn
                </Typography.Text>
              </div>
            </div>
            <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete} size="large" className="!bg-red-600 !border-red-600 hover:!bg-red-700 hover:!border-red-700 !text-white font-semibold px-6 py-2 h-auto">
              Xóa đã chọn ({selectedRowKeys.length})
            </Button>
          </div>
        </div>)}

      <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
        <Table {...tableProps} rowSelection={rowSelection} pagination={{
            ...tableProps.pagination,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khách hàng`,
            locale: { jump_to: 'Đến trang', page: '', items_per_page: '/ trang' },
            className: "custom-pagination",
        }} rowKey="_id" className="professional-table" size="middle" scroll={{ x: isAdmin ? 1360 : 1200 }} locale={{
            emptyText: 'Không có dữ liệu',
            filterTitle: 'Lọc',
            filterConfirm: 'Xác nhận',
            filterReset: 'Đặt lại',
            filterEmptyText: 'Không có bộ lọc',
            selectAll: 'Chọn tất cả',
            selectInvert: 'Đảo ngược lựa chọn',
            selectionAll: 'Chọn tất cả dữ liệu',
            sortTitle: 'Sắp xếp',
            expand: 'Mở rộng',
            collapse: 'Thu gọn',
            triggerDesc: 'Nhấn để sắp xếp giảm dần',
            triggerAsc: 'Nhấn để sắp xếp tăng dần',
            cancelSort: 'Nhấn để hủy sắp xếp',
        }}>
          <Table.Column<Lead> dataIndex="search" title={<div className="flex items-center space-x-2">
                <UserOutlined className="text-blue-500"/>
                <span className="font-semibold">Tên khách hàng</span>
              </div>} defaultFilteredValue={getDefaultFilter('_id', filters)} filterIcon={<SearchOutlined />} filterDropdown={(props) => (<FilterDropdown {...props}>
                <Input placeholder="Tìm kiếm khách hàng"/>
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
          
          <Table.Column<Lead> dataIndex="search" title={<div className="flex items-center space-x-2">
                <MailOutlined className="text-green-500"/>
                <span className="font-semibold">Email</span>
              </div>} defaultFilteredValue={getDefaultFilter('search', filters)} filterIcon={<SearchOutlined />} filterDropdown={(props) => (<FilterDropdown {...props}>
                <Input placeholder="Tìm kiếm email"/>
              </FilterDropdown>)} render={(_, record) => (<Typography.Text className="text-gray-700">
                {(record as any).email || '-'}
              </Typography.Text>)} width={200}/>

          <Table.Column<Lead> dataIndex="search" title={<div className="flex items-center space-x-2">
                <PhoneOutlined className="text-purple-500"/>
                <span className="font-semibold">Số điện thoại</span>
              </div>} defaultFilteredValue={getDefaultFilter('search', filters)} filterIcon={<SearchOutlined />} filterDropdown={(props) => (<FilterDropdown {...props}>
                <Input placeholder="Tìm kiếm số điện thoại"/>
              </FilterDropdown>)} render={(_, record) => (<Typography.Text className="text-gray-700">
                {(record as any).phoneNumber || (record as any).phone || '-'}
              </Typography.Text>)} width={150}/>
          
          <Table.Column<Lead> dataIndex="status" title={<div className="flex items-center space-x-2">
                <TagOutlined className="text-orange-500"/>
                <span className="font-semibold">Trạng thái</span>
              </div>} render={(status) => (<Tag color={getStatusColor(status || '')} className="px-3 py-1 rounded-full font-medium">
                {getStatusLabel(status || '')}
              </Tag>)} width={130} filters={[
            { text: 'Mới', value: 'new' },
            { text: 'Đang liên hệ', value: 'contacting' },
            { text: 'Đã chuyển đổi', value: 'converted' },
            { text: 'Không quan tâm', value: 'not_interested' },
        ]} onFilter={(value, record) => record.status === value}/>

          <Table.Column<Lead> dataIndex="source" title={<div className="flex items-center space-x-2">
                <LinkOutlined className="text-cyan-500"/>
                <span className="font-semibold">Nguồn</span>
              </div>} render={(source) => (<div className="flex items-center space-x-2">
                {source && (<>
                    <span className="text-lg">{getSourceIcon(source)}</span>
                    <Typography.Text className="text-gray-700 capitalize">
                      {getSourceLabel(source) || '-'}
                    </Typography.Text>
                  </>)}
              </div>)} width={120} filters={[
            { text: 'Website', value: 'website' },
            { text: 'Facebook', value: 'facebook' },
            { text: 'Google Ads', value: 'google_ads' },
            { text: 'Giới thiệu', value: 'referral' },
            { text: 'Khác', value: 'other' },
        ]} onFilter={(value, record) => record.source === value}/>

          <Table.Column<Lead> dataIndex="address" title={<div className="flex items-center space-x-2">
                <EnvironmentOutlined className="text-red-500"/>
                <span className="font-semibold">Địa chỉ</span>
              </div>} render={(address) => (<Typography.Text className="text-gray-700" ellipsis>
                {address || '-'}
              </Typography.Text>)} width={180}/>

          {isAdmin && (<Table.Column<Lead> dataIndex="responsibleUserId" title={<div className="flex items-center space-x-2">
                  <UserOutlined className="text-teal-500"/>
                  <span className="font-semibold">Người phụ trách</span>
                </div>} render={(responsibleUserId, record) => {
                const responsibleUser = ownerSelectProps?.options?.find((user: any) => user.value === responsibleUserId);
                return (<div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <UserOutlined className="text-teal-600 text-sm"/>
                    </div>
                    <Typography.Text className="text-gray-700">
                      {responsibleUser?.label || 'Chưa gán'}
                    </Typography.Text>
                  </div>);
            }} width={160}/>)}

          <Table.Column<Lead> fixed="right" dataIndex="_id" title={<div className="flex items-center justify-center">
                <span className="font-semibold">Thao tác</span>
              </div>} render={(value, record) => (<Space size="small">
                <Tooltip title="Xem chi tiết">
                  <Button icon={<EyeOutlined />} size="small" onClick={() => go({ to: `/leads/edit/${value}` })} className="!border-blue-200 !text-blue-600 hover:!border-blue-400 hover:!text-blue-800"/>
                </Tooltip>
                <Tooltip title="Chỉnh sửa">
                  <Button size="small" icon={<EditOutlined />} onClick={() => show(value)} className="!border-green-200 !text-green-600 hover:!border-green-400 hover:!text-green-800"/>
                </Tooltip>
                <Tooltip title="Xóa">
                  <Button size="small" icon={<DeleteOutlined />} onClick={() => {
                Modal.confirm({
                    title: 'Xác nhận xóa',
                    content: 'Bạn có chắc chắn muốn xóa khách hàng này?',
                    okText: 'Xóa',
                    cancelText: 'Hủy',
                    okType: 'danger',
                    onOk: () => {
                        deleteLead({
                            resource: 'leads',
                            id: value,
                            successNotification: false,
                            errorNotification: false,
                        }, {
                            onSuccess: () => {
                                invalidate({
                                    resource: "leads",
                                    invalidates: ["list", "many"],
                                });
                                if (!isAdmin && currentUser?._id) {
                                    invalidate({
                                        resource: `leads/user/${currentUser._id}`,
                                        invalidates: ["list", "many"],
                                    });
                                }
                                // Invalidate stats
                                if (statsUrl) {
                                    invalidate({
                                        resource: statsUrl,
                                        invalidates: ["all"],
                                    });
                                }
                            },
                            onError: (error: any) => {
                                const message = error?.response?.data?.message ||
                                    error?.message ||
                                    'Xoá khách hàng thất bại, vui lòng thử lại.';
                                Modal.error({
                                    title: 'Không thể xoá khách hàng',
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

      <LeadEditModal modalProps={modalProps} formProps={formProps} ownerSelectProps={ownerSelectProps} isAdmin={isAdmin}/>

      <LeadCreateModal modalProps={createModalProps} formProps={createFormProps} ownerSelectProps={ownerSelectProps} isAdmin={isAdmin}/>
    </div>);
};
