import { ReminderEditModal, ReminderCreateModal } from '@/components/modal';
import { FilterableStatsCard } from '@/components/cards';
import { Lead } from '@/interfaces/lead';
import { Reminder } from '@/interfaces/reminder';
import { AlignLeftOutlined, BellOutlined, CalendarOutlined, ClockCircleOutlined, EditOutlined, ExclamationCircleOutlined, FilterOutlined, PlusOutlined, SearchOutlined, TagOutlined, UserOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { FilterDropdown, useModalForm, useSelect, useTable } from '@refinedev/antd';
import { getDefaultFilter, HttpError, useGo, useDeleteMany, useDelete, useGetIdentity, useInvalidate } from '@refinedev/core';
import { Badge, Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag, Tooltip, Typography, message, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import type { User } from '@/interfaces/user';
export const ReminderList = ({ children }: React.PropsWithChildren) => {
    const go = useGo();
    const { mutate: deleteManyReminders } = useDeleteMany();
    const { mutate: deleteReminder } = useDelete();
    const { data: currentUser } = useGetIdentity<User>();
    const invalidate = useInvalidate();
    const [activeFilter, setActiveFilter] = useState<string>('total');
    const [originalData, setOriginalData] = useState<readonly Reminder[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<Reminder[]>([]);
    const { formProps: editFormProps, modalProps: editModalProps, show: showEditModal, queryResult, } = useModalForm({
        action: "edit",
        resource: "reminders",
        redirect: false,
        mutationMode: "pessimistic",
        successNotification: {
            message: "Cập nhật nhắc nhở thành công",
            type: "success",
        },
        onMutationSuccess: () => {
            if (currentUser?._id) {
                invalidate({
                    resource: `reminders/user/${currentUser._id}`,
                    invalidates: ["list", "many"],
                });
            }
        },
    });
    const { formProps: createFormProps, modalProps: createModalProps, show: showCreateModal, } = useModalForm({
        action: "create",
        resource: "reminders",
        redirect: false,
        mutationMode: "pessimistic",
        successNotification: {
            message: "Tạo nhắc nhở thành công",
            type: "success",
        },
        onMutationSuccess: () => {
            if (currentUser?._id) {
                invalidate({
                    resource: `reminders/user/${currentUser._id}`,
                    invalidates: ["list", "many"],
                });
            }
        },
    });
    React.useEffect(() => {
        if (editFormProps?.form && currentUser?._id) {
            editFormProps.form.setFieldsValue({
                userId: currentUser._id,
            });
        }
    }, [editFormProps?.form, currentUser?._id]);
    React.useEffect(() => {
        if (queryResult?.data?.data && editFormProps?.form) {
            const reminderData = queryResult.data.data;
            editFormProps.form.setFieldsValue({
                title: reminderData.title,
                description: reminderData.description,
                leadId: reminderData.leadId,
                ownerId: reminderData.ownerId,
                reminderDate: reminderData.timeReminder ? dayjs(reminderData.timeReminder) : null,
                reminderTime: reminderData.timeReminder ? dayjs(reminderData.timeReminder).format('HH:mm') : '',
                priority: reminderData.priority,
                reminderStatus: reminderData.reminderStatus,
                repeat: reminderData.repeat,
            });
        }
    }, [queryResult?.data?.data, editFormProps?.form]);
    React.useEffect(() => {
        if (createFormProps?.form && currentUser?._id) {
            createFormProps.form.setFieldsValue({
                userId: currentUser._id,
                ownerId: currentUser._id,
            });
        }
    }, [createFormProps?.form, currentUser?._id]);
    React.useEffect(() => {
        if (createModalProps?.open && createFormProps?.form && currentUser?._id) {
            createFormProps.form.resetFields();
            createFormProps.form.setFieldsValue({
                userId: currentUser._id,
                ownerId: currentUser._id,
                reminderStatus: 'PENDING',
                priority: 'MEDIUM',
                repeat: 'NEVER',
            });
        }
    }, [createModalProps?.open, createFormProps?.form, currentUser?._id]);
    const { selectProps: leadSelectProps } = useSelect<Lead>({
        resource: 'leads',
        optionLabel: 'name',
        optionValue: '_id',
    });
    const { tableProps, filters, searchFormProps } = useTable<Reminder, HttpError, {
        q?: string;
    }>({
        resource: `reminders/user/${currentUser?._id}`,
        syncWithLocation: false,
        onSearch: (values) => [
            {
                field: 'search',
                operator: 'contains',
                value: values.q,
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
                    field: 'title',
                    operator: 'contains',
                    value: undefined,
                },
            ],
        },
        pagination: {
            pageSize: 12,
        },
        queryOptions: {
            keepPreviousData: true,
            retry: 0,
            onError: (error: any) => {
                const msg = error?.response?.data?.message || error?.message || 'Không thể tải danh sách nhắc nhở. Vui lòng thử lại.';
                message.error(msg);
            },
        },
    });
    useEffect(() => {
        if (tableProps.dataSource && tableProps.dataSource.length > 0) {
            setOriginalData(tableProps.dataSource);
        }
    }, [tableProps.dataSource]);
    const getFilteredData = (): Reminder[] => {
        if (activeFilter === 'total') {
            return [...originalData];
        }
        switch (activeFilter) {
            case 'done':
                return originalData.filter(reminder => reminder.reminderStatus === 'DONE');
            case 'pending':
                return originalData.filter(reminder => reminder.reminderStatus === 'PENDING');
            case 'overdue':
                return originalData.filter(reminder => {
                    if (reminder.reminderStatus === 'PENDING' && reminder.timeReminder) {
                        return dayjs(reminder.timeReminder).isBefore(dayjs());
                    }
                    return false;
                });
            default:
                return [...originalData];
        }
    };
    const handleFilterClick = (filterType: string) => {
        setActiveFilter(filterType);
    };
    const getStatsData = () => {
        return {
            total: (tableProps.pagination && typeof tableProps.pagination === 'object') ? tableProps.pagination.total || 0 : 0,
            done: originalData.filter(reminder => reminder.reminderStatus === 'DONE').length,
            pending: originalData.filter(reminder => reminder.reminderStatus === 'PENDING').length,
            overdue: originalData.filter(reminder => {
                if (reminder.reminderStatus === 'PENDING' && reminder.timeReminder) {
                    return dayjs(reminder.timeReminder).isBefore(dayjs());
                }
                return false;
            }).length,
        };
    };
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'red';
            case 'MEDIUM': return 'orange';
            case 'LOW': return 'blue';
            default: return 'default';
        }
    };
    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'Cao';
            case 'MEDIUM': return 'Trung bình';
            case 'LOW': return 'Thấp';
            default: return priority;
        }
    };
    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'HIGH':
                return <i className="fa-solid fa-circle-exclamation text-red-500"/>;
            case 'MEDIUM':
                return <i className="fa-solid fa-circle-exclamation text-orange-400"/>;
            case 'LOW':
                return <i className="fa-solid fa-circle-exclamation text-blue-500"/>;
            default:
                return <i className="fa-regular fa-circle text-gray-400"/>;
        }
    };
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'DONE': return 'Hoàn thành';
            case 'PENDING': return 'Chờ xử lý';
            case 'CANCELLED': return 'Đã huỷ';
            default: return status;
        }
    };
    const handleDeleteReminder = (reminderId: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa nhắc nhở',
            content: (<div>
          <p>Bạn có chắc chắn muốn xóa nhắc nhở này?</p>
          <p className="text-red-600 mt-2">
            <ExclamationCircleOutlined className="mr-1"/>
            Hành động này không thể hoàn tác!
          </p>
        </div>),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                deleteReminder({
                    resource: 'reminders',
                    id: reminderId,
                    successNotification: false,
                    errorNotification: false,
                }, {
                    onSuccess: () => {
                        message.success('Xóa nhắc nhở thành công');
                        if (currentUser?._id) {
                            invalidate({
                                resource: `reminders/user/${currentUser._id}`,
                                invalidates: ["list", "many"],
                            });
                        }
                    },
                    onError: (error: any) => {
                        const errorMessage = error?.response?.data?.message ||
                            error?.message ||
                            'Xóa nhắc nhở thất bại, vui lòng thử lại.';
                        message.error(errorMessage);
                    },
                });
            },
        });
    };
    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            Modal.warning({
                title: 'Chưa chọn nhắc nhở',
                content: 'Vui lòng chọn ít nhất một nhắc nhở để xóa.',
            });
            return;
        }
        Modal.confirm({
            title: 'Xác nhận xóa nhiều nhắc nhở',
            content: (<div>
          <p>Bạn có chắc chắn muốn xóa <strong>{selectedRowKeys.length}</strong> nhắc nhở đã chọn?</p>
          <p className="text-red-600 mt-2">
            <ExclamationCircleOutlined className="mr-1"/>
            Hành động này không thể hoàn tác!
          </p>
        </div>),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                deleteManyReminders({
                    resource: 'reminders',
                    ids: selectedRowKeys,
                    successNotification: false,
                    errorNotification: false,
                }, {
                    onSuccess: () => {
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        Modal.success({
                            title: 'Xóa thành công',
                            content: `Đã xóa ${selectedRowKeys.length} nhắc nhở thành công.`,
                        });
                        if (currentUser?._id) {
                            invalidate({
                                resource: `reminders/user/${currentUser._id}`,
                                invalidates: ["list", "many"],
                            });
                        }
                    },
                    onError: (error: any) => {
                        const message = error?.response?.data?.message ||
                            error?.message ||
                            'Xóa nhắc nhở thất bại, vui lòng thử lại.';
                        Modal.error({
                            title: 'Không thể xóa nhắc nhở',
                            content: message,
                        });
                    },
                });
            },
        });
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: Reminder[]) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
            setSelectedRows(selectedRows);
        },
    };
    return (<div className="page-container">
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography.Title level={2} className="!mb-2 !text-gray-800">
              Quản lý nhắc nhở
            </Typography.Title>
            <Typography.Text type="secondary" className="text-base">
              Theo dõi và quản lý các nhắc nhở công việc
            </Typography.Text>
          </div>
          <Space>
            <Button icon={<FilterOutlined />} className="professional-button" size="large">
              Bộ lọc
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showCreateModal()} className="professional-button" size="large">
              Thêm nhắc nhở
            </Button>
          </Space>
        </div>

        
        <Card className="mb-4" bodyStyle={{ padding: '16px 24px' }}>
          <Form {...searchFormProps} layout="inline" style={{ width: '100%' }}>
            <Form.Item name="q" style={{ marginBottom: 0, width: '100%' }}>
              <Input.Search placeholder="Tìm kiếm nhắc nhở theo tiêu đề hoặc nội dung nhắc nhở" size="large" className="professional-input" style={{ maxWidth: 600 }} onSearch={() => searchFormProps?.form?.submit?.()} allowClear/>
            </Form.Item>
          </Form>
        </Card>
      </div>

      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Tổng nhắc nhở" value={getStatsData().total} color="#3b82f6" isActive={activeFilter === 'total'} onClick={() => handleFilterClick('total')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Đã hoàn thành" value={getStatsData().done} color="#10b981" isActive={activeFilter === 'done'} onClick={() => handleFilterClick('done')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Chờ xử lý" value={getStatsData().pending} color="#eab308" isActive={activeFilter === 'pending'} onClick={() => handleFilterClick('pending')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Quá hạn" value={getStatsData().overdue} color="#ef4444" isActive={activeFilter === 'overdue'} onClick={() => handleFilterClick('overdue')}/>
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
                  Đã chọn {selectedRowKeys.length} nhắc nhở
                </Typography.Text>
                <br />
                <Typography.Text className="text-red-600 text-sm">
                  Nhấn nút bên dưới để xóa tất cả nhắc nhở đã chọn
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhắc nhở`,
            className: "custom-pagination",
        }} rowKey="_id" className="professional-table" size="middle" scroll={{ x: 1000 }}>
          <Table.Column<Reminder> dataIndex="search" title={<div className="flex items-center space-x-2">
                <BellOutlined className="text-blue-500"/>
                <span className="font-semibold">Tiêu đề</span>
              </div>} defaultFilteredValue={getDefaultFilter('_id', filters)} filterIcon={<SearchOutlined />} filterDropdown={(props) => (<FilterDropdown {...props}>
                <Input placeholder="Tìm kiếm nhắc nhở"/>
              </FilterDropdown>)} render={(_, record) => (<div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BellOutlined className="text-white text-sm"/>
                </div>
                <div>
                  <Typography.Text strong className="text-gray-800">
                    {record.title}
                  </Typography.Text>
                  <br />
                  <Typography.Text className="text-xs text-gray-500">
                    ID: {record._id?.slice(-6)}
                  </Typography.Text>
                </div>
              </div>)} width={250}/>

          <Table.Column<Reminder> dataIndex="timeReminder" title={<div className="flex items-center space-x-2">
                <ClockCircleOutlined className="text-purple-500"/>
                <span className="font-semibold">Thời gian nhắc</span>
              </div>} render={(timeReminder, record) => {
            const now = dayjs();
            const reminderTime = timeReminder ? dayjs(timeReminder) : null;
            const isOverdue = record.reminderStatus === 'PENDING' && reminderTime && reminderTime.isBefore(now);
            return (<div className="flex flex-col space-y-1">
                  <Typography.Text className={`text-gray-700 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                    <ClockCircleOutlined className="mr-1"/>
                    {timeReminder ? dayjs(timeReminder).format("DD/MM/YYYY HH:mm") : '-'}
                  </Typography.Text>
                  {isOverdue && (<div className="inline-block">
                      <Tag color="red" className="text-xs" style={{ width: 'auto', display: 'inline-block' }}>
                        <i className="fa-solid fa-triangle-exclamation mr-1"/>Quá hạn
                      </Tag>
                    </div>)}
                </div>);
        }} width={200} sorter={(a, b) => {
            if (!a.timeReminder)
                return 1;
            if (!b.timeReminder)
                return -1;
            return new Date(a.timeReminder).getTime() - new Date(b.timeReminder).getTime();
        }}/>

          <Table.Column<Reminder> dataIndex="priority" title={<div className="flex items-center space-x-2">
                <ExclamationCircleOutlined className="text-yellow-500"/>
                <span className="font-semibold">Độ ưu tiên</span>
              </div>} render={(priority) => (<Tag color={getPriorityColor(priority)} className="px-3 py-1 rounded-full font-medium">
                {getPriorityIcon(priority)} {getPriorityLabel(priority)}
              </Tag>)} width={130} filters={[
            { text: 'Cao', value: 'HIGH' },
            { text: 'Trung bình', value: 'MEDIUM' },
            { text: 'Thấp', value: 'LOW' },
        ]} filteredValue={getDefaultFilter('priority', filters)}/>

          <Table.Column<Reminder> dataIndex="reminderStatus" title={<div className="flex items-center space-x-2">
                <ClockCircleOutlined className="text-purple-500"/>
                <span className="font-semibold">Trạng thái</span>
              </div>} render={(status) => (<div className="flex items-center gap-1">
                <Badge status={status === 'DONE' ? "success" : status === 'PENDING' ? "processing" : "error"} text={getStatusLabel(status)} className="font-medium"/>
              </div>)} width={130} filters={[
            { text: 'Hoàn thành', value: 'DONE' },
            { text: 'Chờ xử lý', value: 'PENDING' },
            { text: 'Đã hủy', value: 'CANCELLED' },
        ]} filteredValue={getDefaultFilter('reminderStatus', filters)}/>

          <Table.Column<Reminder> title={<div className="flex items-center space-x-2">
                <CalendarOutlined className="text-cyan-500"/>
                <span className="font-semibold">Ngày tạo</span>
              </div>} render={(_, record) => (<Typography.Text className="text-gray-700">
                {(record as any).createdAt ? dayjs((record as any).createdAt).format("DD/MM/YYYY") : "-"}
              </Typography.Text>)} width={120} sorter={(a, b) => {
            if (!(a as any).createdAt)
                return 1;
            if (!(b as any).createdAt)
                return -1;
            return new Date((a as any).createdAt).getTime() - new Date((b as any).createdAt).getTime();
        }}/>

          <Table.Column<Reminder> fixed="right" dataIndex="_id" title={<div className="flex items-center justify-center">
                <span className="font-semibold">Thao tác</span>
              </div>} render={(value) => (<Space size="small">
                <Tooltip title="Xem chi tiết">
                  <Button icon={<EyeOutlined />} size="small" onClick={() => go({ to: `/reminders/show/${value}` })} className="!border-blue-200 !text-blue-600 hover:!border-blue-400 hover:!text-blue-800"/>
                </Tooltip>
                <Tooltip title="Chỉnh sửa">
                  <Button icon={<EditOutlined />} size="small" onClick={() => {
                showEditModal(value);
            }} className="!border-green-200 !text-green-600 hover:!border-green-400 hover:!text-green-800"/>
                </Tooltip>
                <Tooltip title="Xóa">
                  <Button icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteReminder(value)} className="!border-red-200 !text-red-600 hover:!border-red-400 hover:!text-red-800"/>
                </Tooltip>
              </Space>)} width={120}/>
        </Table>
      </Card>

      
      <ReminderCreateModal modalProps={createModalProps} formProps={createFormProps} leadSelectProps={leadSelectProps} />

      
      <ReminderEditModal modalProps={editModalProps} formProps={editFormProps} leadSelectProps={leadSelectProps} />

      {children}
    </div>);
};
