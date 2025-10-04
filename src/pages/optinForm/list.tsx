import { OptinForm } from "@/interfaces/optinForm";
import { FilterableStatsCard } from '@/components/cards';
import { CopyFilled, CopyOutlined, EyeFilled, EyeOutlined, SearchOutlined, PlusOutlined, FilterOutlined, MoreOutlined, FormOutlined, LinkOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, UserOutlined, CalendarOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { CreateButton, DeleteButton, EditButton, FilterDropdown, List, useTable, } from "@refinedev/antd";
import { getDefaultFilter, HttpError, useGo, useDeleteMany } from "@refinedev/core";
import { Button, Input, message, Space, Table, Tag, Card, Row, Col, Typography, Tooltip, Dropdown, Menu, Badge, Form, Modal } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
export const OptinFormList = ({ children }: React.PropsWithChildren) => {
    const go = useGo();
    const { mutate: deleteManyOptinForms } = useDeleteMany();
    const [activeFilter, setActiveFilter] = useState<string>('total');
    const [originalData, setOriginalData] = useState<readonly OptinForm[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<OptinForm[]>([]);
    const { tableProps, filters, searchFormProps } = useTable<OptinForm, HttpError, OptinForm>({
        resource: "optin-forms",
        syncWithLocation: false,
        onSearch: (values) => [
            {
                field: "search",
                operator: "contains",
                value: values.title,
            },
        ],
        sorters: {
            initial: [{ field: "createdAt", order: "desc" }],
        },
        filters: {
            initial: [{ field: "title", operator: "contains", value: undefined }],
        },
        pagination: { pageSize: 12 },
        queryOptions: {
            keepPreviousData: true,
            retry: 0,
            onError: (error: any) => {
                const msg = error?.response?.data?.message || error?.message || 'Không thể tải danh sách form đăng ký. Vui lòng thử lại.';
                message.error(msg);
            },
        },
    });
    useEffect(() => {
        if (tableProps.dataSource && tableProps.dataSource.length > 0) {
            setOriginalData(tableProps.dataSource);
        }
    }, [tableProps.dataSource]);
    const getFilteredData = (): OptinForm[] => {
        if (activeFilter === 'total') {
            return [...originalData];
        }
        switch (activeFilter) {
            case 'active':
                return originalData.filter(form => form.isActive);
            case 'inactive':
                return originalData.filter(form => !form.isActive);
            case 'submissions':
                return [...originalData].sort((a, b) => ((b as any).submissionCount || 0) - ((a as any).submissionCount || 0));
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
            active: originalData.filter(form => form.isActive).length,
            inactive: originalData.filter(form => !form.isActive).length,
            totalSubmissions: originalData.reduce((sum, form) => sum + ((form as any).submissionCount || 0), 0),
        };
    };
    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            Modal.warning({
                title: 'Chưa chọn form',
                content: 'Vui lòng chọn ít nhất một form để xóa.',
            });
            return;
        }
        Modal.confirm({
            title: 'Xác nhận xóa nhiều form',
            content: (<div>
          <p>Bạn có chắc chắn muốn xóa <strong>{selectedRowKeys.length}</strong> form đã chọn?</p>
          <p className="text-red-600 mt-2">
            <ExclamationCircleOutlined className="mr-1"/>
            Hành động này không thể hoàn tác!
          </p>
        </div>),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                deleteManyOptinForms({
                    resource: 'optin-forms',
                    ids: selectedRowKeys,
                    successNotification: false,
                    errorNotification: false,
                }, {
                    onSuccess: () => {
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        Modal.success({
                            title: 'Xóa thành công',
                            content: `Đã xóa ${selectedRowKeys.length} form thành công.`,
                        });
                    },
                    onError: (error: any) => {
                        const message = error?.response?.data?.message ||
                            error?.message ||
                            'Xóa form thất bại, vui lòng thử lại.';
                        Modal.error({
                            title: 'Không thể xóa form',
                            content: message,
                        });
                    },
                });
            },
        });
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: OptinForm[]) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
            setSelectedRows(selectedRows);
        },
    };
    return (<div className="page-container">
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography.Title level={2} className="!mb-2 !text-gray-800">
              Quản lý form đăng ký
            </Typography.Title>
            <Typography.Text type="secondary" className="text-base">
              Tạo và quản lý các form thu thập thông tin khách hàng
            </Typography.Text>
          </div>
          <Space>
            <Button icon={<FilterOutlined />} className="professional-button" size="large">
              Bộ lọc
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => go({
            to: { resource: "optin-forms", action: "create" },
            options: { keepQuery: true },
            type: "push",
        })} className="professional-button" size="large">
              Thêm form đăng ký
            </Button>
          </Space>
        </div>

        
        <Card className="mb-4" bodyStyle={{ padding: '16px 24px' }}>
          <Form {...searchFormProps} layout="inline" style={{ width: '100%' }}>
            <Form.Item name="title" style={{ marginBottom: 0, width: '100%' }}>
              <Input.Search placeholder="Tìm kiếm form theo tiêu đề hoặc mô tả..." size="large" className="professional-input" style={{ maxWidth: 600 }} onSearch={() => searchFormProps?.form?.submit?.()} allowClear/>
            </Form.Item>
          </Form>
        </Card>
      </div>

      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Tổng form" value={getStatsData().total} color="#3b82f6" isActive={activeFilter === 'total'} onClick={() => handleFilterClick('total')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Đang hoạt động" value={getStatsData().active} color="#10b981" isActive={activeFilter === 'active'} onClick={() => handleFilterClick('active')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Tạm dừng" value={getStatsData().inactive} color="#f59e0b" isActive={activeFilter === 'inactive'} onClick={() => handleFilterClick('inactive')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Tổng lượt đăng ký" value={getStatsData().totalSubmissions} color="#8b5cf6" isActive={activeFilter === 'submissions'} onClick={() => handleFilterClick('submissions')}/>
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
                  Đã chọn {selectedRowKeys.length} form
                </Typography.Text>
                <br />
                <Typography.Text className="text-red-600 text-sm">
                  Nhấn nút bên dưới để xóa tất cả form đã chọn
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} form đăng ký`,
            className: "custom-pagination",
        }} rowKey="_id" className="professional-table" size="middle" scroll={{ x: 1200 }}>
          <Table.Column<OptinForm> dataIndex="search" title={<div className="flex items-center space-x-2">
                <FormOutlined className="text-blue-500"/>
                <span className="font-semibold">Tiêu đề</span>
              </div>} defaultFilteredValue={getDefaultFilter("_id", filters)} filterIcon={<SearchOutlined />} filterDropdown={(props) => (<FilterDropdown {...props}>
                <Input placeholder="Tìm kiếm form đăng ký"/>
              </FilterDropdown>)} render={(_, record) => (<div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <FormOutlined className="text-white text-sm"/>
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

          <Table.Column<OptinForm> dataIndex="description" title={<div className="flex items-center space-x-2">
                <FileTextOutlined className="text-green-500"/>
                <span className="font-semibold">Mô tả</span>
              </div>} render={(description) => (<Typography.Text className="text-gray-700" ellipsis>
                {description || '-'}
              </Typography.Text>)} width={200}/>

          <Table.Column<OptinForm> dataIndex="isActive" title={<div className="flex items-center space-x-2">
                <CheckCircleOutlined className="text-orange-500"/>
                <span className="font-semibold">Hoạt động</span>
              </div>} render={(isActive) => (<Badge status={isActive ? "success" : "default"} text={isActive ? "Đang hoạt động" : "Tạm dừng"} className="font-medium"/>)} width={130} filters={[
            { text: 'Hoạt động', value: true },
            { text: 'Tạm dừng', value: false },
        ]} onFilter={(value, record) => record.isActive === value}/>

          <Table.Column<OptinForm> title={<div className="flex items-center space-x-2">
                <UserOutlined className="text-purple-500"/>
                <span className="font-semibold">Lượt đăng ký</span>
              </div>} render={(_, record) => (<div className="text-center">
                <Typography.Text strong className="text-blue-600 text-lg">
                  {(record as any).submissionCount || 0}
                </Typography.Text>
              </div>)} width={120} sorter={(a, b) => ((a as any).submissionCount || 0) - ((b as any).submissionCount || 0)}/>

          <Table.Column<OptinForm> title={<div className="flex items-center space-x-2">
                <LinkOutlined className="text-cyan-500"/>
                <span className="font-semibold">Đường dẫn</span>
              </div>} render={(_, record) => (<div className="flex items-center space-x-2">
                <Typography.Text className="text-gray-600 text-xs truncate max-w-xs">
                  /optin-forms/preview/{record._id?.slice(-6)}
                </Typography.Text>
                <Tooltip title="Sao chép link">
                  <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => {
                const link = `${window.location.origin}/optin-forms/preview/${record._id}`;
                navigator.clipboard.writeText(link).then(() => {
                    message.success("Sao chép thành công!");
                });
            }} className="!text-blue-500 hover:!text-blue-700"/>
                </Tooltip>
              </div>)} width={200}/>

          <Table.Column<OptinForm> dataIndex="createdAt" title={<div className="flex items-center space-x-2">
                <CalendarOutlined className="text-indigo-500"/>
                <span className="font-semibold">Ngày tạo</span>
              </div>} render={(date) => (<Typography.Text className="text-gray-700">
                {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
              </Typography.Text>)} width={120} sorter={(a, b) => {
            if (!a.createdAt)
                return 1;
            if (!b.createdAt)
                return -1;
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }}/>

          <Table.Column<OptinForm> fixed="right" dataIndex="_id" title={<div className="flex items-center justify-center">
                <span className="font-semibold">Thao tác</span>
              </div>} render={(value) => (<Space size="small">
                <Tooltip title="Xem trước">
                  <Button size="small" icon={<EyeOutlined />} onClick={() => go({
                to: `/optin-forms/preview/${value}`,
                type: "push",
            })} className="!border-blue-200 !text-blue-600 hover:!border-blue-400 hover:!text-blue-800"/>
                </Tooltip>
                <Tooltip title="Chỉnh sửa">
                  <EditButton hideText icon={<EditOutlined />} size="small" recordItemId={value} className="!border-green-200 !text-green-600 hover:!border-green-400 hover:!text-green-800"/>
                </Tooltip>
                <Tooltip title="Xóa">
                  <DeleteButton hideText size="small" recordItemId={value} className="!border-red-200 !text-red-600 hover:!border-red-400 hover:!text-red-800"/>
                </Tooltip>
              </Space>)} width={140}/>
        </Table>
      </Card>

      {children}
    </div>);
};
