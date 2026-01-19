import { FilterableStatsCard } from '@/components/cards';
import { Campaign } from "@/interfaces/campaign";
import { CheckCircleOutlined, DeleteOutlined, DollarOutlined, EditOutlined, ExclamationCircleOutlined, EyeOutlined, FileTextOutlined, FilterOutlined, PlusOutlined, RiseOutlined, RocketOutlined, SearchOutlined, TagOutlined, UserOutlined } from "@ant-design/icons";
import { DeleteButton, EditButton, FilterDropdown, useTable } from "@refinedev/antd";
import { getDefaultFilter, HttpError, useDeleteMany, useGo } from "@refinedev/core";
import { Badge, Button, Card, Col, Form, Input, message, Modal, Progress, Row, Space, Table, Tag, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
export const CampaignList = ({ children }: React.PropsWithChildren) => {
    const go = useGo();
    const { mutate: deleteManyCampaigns } = useDeleteMany();
    const [activeFilter, setActiveFilter] = useState<string>('total');
    const [originalData, setOriginalData] = useState<readonly Campaign[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<Campaign[]>([]);
    const { tableProps, filters, searchFormProps } = useTable<Campaign, HttpError, {
        name?: string;
    } | any>({
        resource: "campaigns",
        syncWithLocation: false,
        onSearch: (values) => [
            {
                field: "search",
                operator: "contains",
                value: values.name,
            },
        ],
        sorters: {
            initial: [
                {
                    field: "createdAt",
                    order: "desc",
                },
            ],
        },
        filters: {
            initial: [
                {
                    field: "name",
                    operator: "contains",
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
                const msg = error?.response?.data?.message || error?.message || 'Không thể tải danh sách chiến dịch. Vui lòng thử lại.';
                message.error(msg);
            },
        },
    });
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'planned': return 'blue';
            case 'in progress': return 'green';
            case 'completed': return 'purple';
            default: return 'default';
        }
    };
    const getStatusLabel = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'planned': return 'Lên kế hoạch';
            case 'in progress': return 'Đang thực hiện';
            case 'completed': return 'Hoàn thành';
            default: return status;
        }
    };
    useEffect(() => {
        if (tableProps.dataSource && tableProps.dataSource.length > 0) {
            setOriginalData(tableProps.dataSource);
        }
    }, [tableProps.dataSource]);
    const getFilteredData = (): Campaign[] => {
        if (activeFilter === 'total') {
            return [...originalData];
        }
        switch (activeFilter) {
            case 'active':
                return originalData.filter(campaign => campaign.isActive);
            case 'leads':
                return [...originalData].sort((a, b) => (b.leadCount || 0) - (a.leadCount || 0));
            case 'opportunities':
                return [...originalData].sort((a, b) => (b.opportunityCount || 0) - (a.opportunityCount || 0));
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
            active: originalData.filter(campaign => campaign.isActive).length,
            totalLeads: originalData.reduce((sum, campaign) => sum + (campaign.leadCount || 0), 0),
            totalOpportunities: originalData.reduce((sum, campaign) => sum + (campaign.opportunityCount || 0), 0),
        };
    };
    const calculateConversionRate = (leadCount: number, opportunityCount: number) => {
        if (leadCount === 0)
            return 0;
        return Math.round((opportunityCount / leadCount) * 100);
    };
    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            Modal.warning({
                title: 'Chưa chọn chiến dịch',
                content: 'Vui lòng chọn ít nhất một chiến dịch để xóa.',
            });
            return;
        }
        Modal.confirm({
            title: 'Xác nhận xóa nhiều chiến dịch',
            content: (<div>
          <p>Bạn có chắc chắn muốn xóa <strong>{selectedRowKeys.length}</strong> chiến dịch đã chọn?</p>
          <p className="text-red-600 mt-2">
            <ExclamationCircleOutlined className="mr-1"/>
            Hành động này không thể hoàn tác!
          </p>
        </div>),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                deleteManyCampaigns({
                    resource: 'campaigns',
                    ids: selectedRowKeys,
                    successNotification: false,
                    errorNotification: false,
                }, {
                    onSuccess: () => {
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        Modal.success({
                            title: 'Xóa thành công',
                            content: `Đã xóa ${selectedRowKeys.length} chiến dịch thành công.`,
                        });
                    },
                    onError: (error: any) => {
                        const message = error?.response?.data?.message ||
                            error?.message ||
                            'Xóa chiến dịch thất bại, vui lòng thử lại.';
                        Modal.error({
                            title: 'Không thể xóa chiến dịch',
                            content: message,
                        });
                    },
                });
            },
        });
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: Campaign[]) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
            setSelectedRows(selectedRows);
        },
    };
    return (<div className="page-container">
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography.Title level={2} className="!mb-2 !text-gray-800">
              Quản lý chiến dịch marketing
            </Typography.Title>
            <Typography.Text type="secondary" className="text-base">
              Theo dõi và quản lý các chiến dịch marketing của bạn
            </Typography.Text>
          </div>
          <Space>
            <Button icon={<FilterOutlined />} className="professional-button" size="large">
              Bộ lọc
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => go({
            to: { resource: "campaigns", action: "create" },
            options: { keepQuery: true },
            type: "replace",
        })} className="professional-button" size="large">
              Thêm chiến dịch
            </Button>
          </Space>
        </div>

        <Card className="mb-4" bodyStyle={{ padding: '16px 24px' }}>
          <Form {...searchFormProps} layout="inline" style={{ width: '100%' }}>
            <Form.Item name="name" style={{ marginBottom: 0, width: '100%' }}>
              <Input.Search placeholder="Tìm kiếm chiến dịch theo tên hoặc mô tả..." size="large" className="professional-input" style={{ maxWidth: 600 }} onSearch={() => searchFormProps?.form?.submit?.()} allowClear/>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Tổng chiến dịch" value={getStatsData().total} color="#3b82f6" isActive={activeFilter === 'total'} onClick={() => handleFilterClick('total')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Đang hoạt động" value={getStatsData().active} color="#10b981" isActive={activeFilter === 'active'} onClick={() => handleFilterClick('active')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Tổng khách hàng" value={getStatsData().totalLeads} color="#8b5cf6" isActive={activeFilter === 'leads'} onClick={() => handleFilterClick('leads')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Tổng cơ hội" value={getStatsData().totalOpportunities} color="#f59e0b" isActive={activeFilter === 'opportunities'} onClick={() => handleFilterClick('opportunities')}/>
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
                  Đã chọn {selectedRowKeys.length} chiến dịch
                </Typography.Text>
                <br />
                <Typography.Text className="text-red-600 text-sm">
                  Nhấn nút bên dưới để xóa tất cả chiến dịch đã chọn
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chiến dịch`,
            className: "custom-pagination",
        }} rowKey="_id" className="professional-table" size="middle" scroll={{ x: 1200 }}>
          <Table.Column<Campaign> dataIndex="search" title={<div className="flex items-center space-x-2">
                <RocketOutlined className="text-blue-500"/>
                <span className="font-semibold">Tên chiến dịch</span>
              </div>} defaultFilteredValue={getDefaultFilter("_id", filters)} filterIcon={<SearchOutlined />} filterDropdown={(props) => (<FilterDropdown {...props}>
                <Input placeholder="Tìm kiếm chiến dịch"/>
              </FilterDropdown>)}             render={(_, record) => (<div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#ede9fe" }}>
                  <RocketOutlined className="text-sm" style={{ color: "#8b5cf6" }}/>
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
              </div>)} width={250}/>

          <Table.Column<Campaign> dataIndex="description" title={<div className="flex items-center space-x-2">
                <FileTextOutlined className="text-green-500"/>
                <span className="font-semibold">Mô tả</span>
              </div>} render={(description) => (<Typography.Text className="text-gray-700" ellipsis>
                {description || '-'}
              </Typography.Text>)} width={200}/>

          <Table.Column<Campaign> dataIndex="campaignStatus" title={<div className="flex items-center space-x-2">
                <TagOutlined className="text-orange-500"/>
                <span className="font-semibold">Trạng thái</span>
              </div>} render={(status) => (<Tag color={getStatusColor(status || '')} className="px-3 py-1 rounded-full font-medium">
                {getStatusLabel(status || '')}
              </Tag>)} width={120} filters={[
            { text: 'Lên kế hoạch', value: 'Planned' },
            { text: 'Đang thực hiện', value: 'In Progress' },
            { text: 'Hoàn thành', value: 'Completed' },
        ]} filteredValue={getDefaultFilter('campaignStatus', filters)}/>

          <Table.Column<Campaign> dataIndex="isActive" title={<div className="flex items-center space-x-2">
                <CheckCircleOutlined className="text-purple-500"/>
                <span className="font-semibold">Hoạt động</span>
              </div>} render={(isActive) => (<Badge status={isActive ? "success" : "default"} text={isActive ? "Đang hoạt động" : "Tạm dừng"} className="font-medium"/>)} width={130} filters={[
            { text: 'Hoạt động', value: true },
            { text: 'Tạm dừng', value: false },
        ]} filteredValue={getDefaultFilter('isActive', filters)}/>

          <Table.Column<Campaign> dataIndex="leadCount" title={<div className="flex items-center space-x-2">
                <UserOutlined className="text-cyan-500"/>
                <span className="font-semibold">Khách hàng</span>
              </div>} render={(count) => (<div className="text-center">
                <Typography.Text strong className="text-blue-600 text-lg">
                  {count || 0}
                </Typography.Text>
              </div>)} width={100} sorter={(a, b) => (a.leadCount || 0) - (b.leadCount || 0)}/>

          <Table.Column<Campaign> dataIndex="opportunityCount" title={<div className="flex items-center space-x-2">
                <DollarOutlined className="text-emerald-500"/>
                <span className="font-semibold">Cơ hội</span>
              </div>} render={(count) => (<div className="text-center">
                <Typography.Text strong className="text-green-600 text-lg">
                  {count || 0}
                </Typography.Text>
              </div>)} width={100} sorter={(a, b) => (a.opportunityCount || 0) - (b.opportunityCount || 0)}/>

          <Table.Column<Campaign> title={<div className="flex items-center space-x-2">
                <RiseOutlined className="text-indigo-500"/>
                <span className="font-semibold">Tỷ lệ chuyển đổi</span>
              </div>} render={(_, record) => {
            const rate = calculateConversionRate(record.leadCount || 0, record.opportunityCount || 0);
            return (<div className="flex items-center space-x-2">
                  <Progress percent={rate} size="small" strokeColor="#10b981" showInfo={false} className="flex-1"/>
                  <Typography.Text strong className="text-gray-700 text-sm">
                    {rate}%
                  </Typography.Text>
                </div>);
        }} width={150} sorter={(a, b) => calculateConversionRate(a.leadCount || 0, a.opportunityCount || 0) -
            calculateConversionRate(b.leadCount || 0, b.opportunityCount || 0)}/>

          <Table.Column<Campaign> fixed="right" dataIndex="_id" title={<div className="flex items-center justify-center">
                <span className="font-semibold">Thao tác</span>
              </div>} render={(value) => (<Space size="small">
                <Tooltip title="Xem chi tiết">
                  <Button size="small" icon={<EyeOutlined />} onClick={() => go({ to: `/campaigns/show/${value}` })} className="!border-blue-200 !text-blue-600 hover:!border-blue-400 hover:!text-blue-800"/>
                </Tooltip>
                <Tooltip title="Chỉnh sửa">
                  <EditButton hideText icon={<EditOutlined />} size="small" recordItemId={value} className="!border-green-200 !text-green-600 hover:!border-green-400 hover:!text-green-800"/>
                </Tooltip>
                <Tooltip title="Xóa">
                  <DeleteButton hideText size="small" recordItemId={value} className="!border-red-200 !text-red-600 hover:!border-red-400 hover:!text-red-800"/>
                </Tooltip>
              </Space>)} width={120}/>
        </Table>
      </Card>

      {children}
    </div>);
};