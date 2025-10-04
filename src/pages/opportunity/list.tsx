import { Opportunity } from "@/interfaces/opportunity";
import { FilterableStatsCard } from '@/components/cards';
import { AimOutlined, CalendarOutlined, DollarOutlined, EditOutlined, EyeOutlined, FilterOutlined, PlusOutlined, RightOutlined, RiseOutlined, SearchOutlined, TagOutlined, UserOutlined, FlagOutlined, FileTextOutlined, PercentageOutlined, LinkOutlined, ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { FilterDropdown, useTable, useModalForm, useSelect } from "@refinedev/antd";
import { getDefaultFilter, HttpError, useGo, useDeleteMany, useDelete, useGetIdentity, useInvalidate } from "@refinedev/core";
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Progress, Row, Select, Space, Steps, Table, Tag, Tooltip, Typography, Modal } from "antd";
import dayjs from "dayjs";
import { OpportunityEditModal } from "@/components/modal";
import { OpportunityStage } from "@/interfaces/opportunity";
import React, { useEffect, useState } from "react";
import type { User } from "@/interfaces/user";
import { message } from "antd";
import { BackButton } from "@/components/back-button";
export const OpportunityList = ({ children }: React.PropsWithChildren) => {
    const go = useGo();
    const { mutate: deleteManyOpportunities } = useDeleteMany();
    const { mutate: deleteOpportunity } = useDelete();
    const { data: currentUser } = useGetIdentity<User>();
    const invalidate = useInvalidate();
    const isAdmin = currentUser?.role?.name === 'Admin';
    const [activeFilter, setActiveFilter] = useState<string>('total');
    const [originalData, setOriginalData] = useState<readonly Opportunity[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<Opportunity[]>([]);
    const { tableProps, filters, searchFormProps } = useTable<Opportunity, HttpError, Opportunity>({
        resource: isAdmin ? "opportunities" : `opportunities/owner/${currentUser?._id}`,
        syncWithLocation: false,
        onSearch: (values) => [
            {
                field: "search",
                operator: "contains",
                value: values.name,
            },
        ],
        sorters: {
            initial: [{ field: "createdAt", order: "desc" }],
        },
        filters: {
            initial: [{ field: "name", operator: "contains", value: undefined }],
        },
        pagination: { pageSize: 12 },
        queryOptions: {
            keepPreviousData: true,
            retry: 0,
            onError: (error: any) => {
                const msg = error?.response?.data?.message || error?.message || 'Không thể tải danh sách cơ hội. Vui lòng thử lại.';
                message.error(msg);
            },
        },
    });
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
    const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
    useEffect(() => {
        if (selectedOpportunity) {
            setCurrentStageIndex(getStageIndex(selectedOpportunity.opportunityStage));
        }
    }, [selectedOpportunity]);
    useEffect(() => {
        if (tableProps.dataSource && tableProps.dataSource.length > 0) {
            setOriginalData(tableProps.dataSource);
        }
    }, [tableProps.dataSource]);
    const getFilteredData = (): Opportunity[] => {
        if (activeFilter === 'total') {
            return [...originalData];
        }
        switch (activeFilter) {
            case 'won':
                return originalData.filter(opp => opp.opportunityStage === 'CLOSED_WON');
            case 'processing':
                return originalData.filter(opp => ['QUALIFICATION', 'NEEDS_ANALYSIS', 'PROPOSAL', 'NEGOTIATION'].includes(opp.opportunityStage));
            case 'lost':
                return originalData.filter(opp => opp.opportunityStage === 'CLOSED_LOST');
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
            won: originalData.filter(opp => opp.opportunityStage === 'CLOSED_WON').length,
            processing: originalData.filter(opp => ['QUALIFICATION', 'NEEDS_ANALYSIS', 'PROPOSAL', 'NEGOTIATION'].includes(opp.opportunityStage)).length,
            lost: originalData.filter(opp => opp.opportunityStage === 'CLOSED_LOST').length,
        };
    };
    const { Step } = Steps;
    const DetailRow = ({ label, value }: {
        label: string;
        value: any;
    }) => (<div style={{ display: "flex", borderBottom: "1px solid #eee", padding: "6px 0" }}>
      <strong style={{ flex: "0 0 40%" }}>{label}:</strong>
      <span style={{ flex: "1" }}>{value ?? "-"}</span>
    </div>);
    const stageList = [
        { value: "QUALIFICATION", label: "Đánh giá" },
        { value: "NEEDS_ANALYSIS", label: "Phân tích nhu cầu" },
        { value: "PROPOSAL", label: "Đề xuất" },
        { value: "NEGOTIATION", label: "Thương lượng" },
        { value: "CLOSED_WON", label: "Thành công" },
        { value: "CLOSED_LOST", label: "Thất bại" },
    ];
    const opportunityStageLabel: Record<string, string> = {
        QUALIFICATION: "Đánh giá",
        NEEDS_ANALYSIS: "Phân tích nhu cầu",
        PROPOSAL: "Đề xuất",
        NEGOTIATION: "Thương lượng",
        CLOSED_WON: "Thành công",
        CLOSED_LOST: "Thất bại",
    };
    const getStageIndex = (stage: string) => stageList.findIndex((s) => s.value === stage);
    const getStepStatus = (i: number, currentStage?: string) => {
        if (!currentStage)
            return "wait";
        const currentIndex = getStageIndex(currentStage);
        if (currentIndex === -1)
            return "wait";
        if (currentStage === "CLOSED_WON") {
            return i <= currentIndex ? "finish" : "wait";
        }
        if (currentStage === "CLOSED_LOST") {
            if (i < currentIndex)
                return "wait";
            if (i === currentIndex)
                return "error";
            return "wait";
        }
        if (i < currentIndex)
            return "finish";
        if (i === currentIndex)
            return "process";
        return "wait";
    };
    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'QUALIFICATION': return 'blue';
            case 'NEEDS_ANALYSIS': return 'orange';
            case 'PROPOSAL': return 'purple';
            case 'NEGOTIATION': return 'gold';
            case 'CLOSED_WON': return 'green';
            case 'CLOSED_LOST': return 'red';
            default: return 'default';
        }
    };
    const getStageIcon = (stage: string) => {
        switch (stage) {
            case 'QUALIFICATION':
                return <i className="fa-solid fa-bullseye mr-1"/>;
            case 'NEEDS_ANALYSIS':
                return <i className="fa-solid fa-magnifying-glass mr-1"/>;
            case 'PROPOSAL':
                return <i className="fa-solid fa-clipboard mr-1"/>;
            case 'NEGOTIATION':
                return <i className="fa-solid fa-handshake mr-1"/>;
            case 'CLOSED_WON':
                return <i className="fa-solid fa-circle-check mr-1"/>;
            case 'CLOSED_LOST':
                return <i className="fa-solid fa-circle-xmark mr-1"/>;
            default:
                return <i className="fa-solid fa-chart-line mr-1"/>;
        }
    };
    const { formProps: editFormProps, modalProps: editModalProps, show: showEditModal } = useModalForm<Opportunity>({
        action: "edit",
        resource: "opportunities",
        redirect: false,
        mutationMode: "pessimistic",
        successNotification: {
            message: "Cập nhật cơ hội thành công",
            type: "success",
        },
        onMutationSuccess: () => {
            invalidate({
                resource: "opportunities",
                invalidates: ["list", "many"],
            });
            if (!isAdmin && currentUser?._id) {
                invalidate({
                    resource: `opportunities/owner/${currentUser._id}`,
                    invalidates: ["list", "many"],
                });
            }
        },
    });
    React.useEffect(() => {
        if (editFormProps?.form && currentUser?._id) {
            editFormProps.form.setFieldsValue({ ownerId: currentUser._id });
        }
    }, [editFormProps?.form, currentUser?._id]);
    const { selectProps: leadSelectProps } = useSelect({
        resource: "leads",
        optionLabel: "name",
        optionValue: "_id",
    });
    const { selectProps: campaignSelectProps } = useSelect({
        resource: "campaigns",
        optionLabel: "name",
        optionValue: "_id",
    });
    const { selectProps: rawOwnerSelectProps } = useSelect({
        resource: "auth",
        optionLabel: "name",
        optionValue: "_id",
        pagination: { mode: 'off' },
        queryOptions: { enabled: isAdmin },
    });
    const ownerSelectProps = React.useMemo(() => ({ ...rawOwnerSelectProps }), [rawOwnerSelectProps]);
    const formatCurrency = (amount: number) => {
        try {
            const safeAmount = Number(amount) || 0;
            if (safeAmount > Number.MAX_SAFE_INTEGER) {
                return 'Số quá lớn';
            }
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(safeAmount);
        }
        catch (error) {
            console.error('Error formatting currency:', error);
            return 'Lỗi định dạng';
        }
    };
    const handleDeleteOpportunity = (opportunityId: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa cơ hội',
            content: (<div>
          <p>Bạn có chắc chắn muốn xóa cơ hội này?</p>
          <p className="text-red-600 mt-2">
            <ExclamationCircleOutlined className="mr-1"/>
            Hành động này không thể hoàn tác!
          </p>
        </div>),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                deleteOpportunity({
                    resource: 'opportunities',
                    id: opportunityId,
                    successNotification: false,
                    errorNotification: false,
                }, {
                    onSuccess: () => {
                        message.success('Xóa cơ hội thành công');
                        invalidate({
                            resource: "opportunities",
                            invalidates: ["list", "many"],
                        });
                        if (!isAdmin && currentUser?._id) {
                            invalidate({
                                resource: `opportunities/owner/${currentUser._id}`,
                                invalidates: ["list", "many"],
                            });
                        }
                    },
                    onError: (error: any) => {
                        const errorMessage = error?.response?.data?.message ||
                            error?.message ||
                            'Xóa cơ hội thất bại, vui lòng thử lại.';
                        message.error(errorMessage);
                    },
                });
            },
        });
    };
    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            Modal.warning({
                title: 'Chưa chọn cơ hội',
                content: 'Vui lòng chọn ít nhất một cơ hội để xóa.',
            });
            return;
        }
        Modal.confirm({
            title: 'Xác nhận xóa nhiều cơ hội',
            content: (<div>
          <p>Bạn có chắc chắn muốn xóa <strong>{selectedRowKeys.length}</strong> cơ hội đã chọn?</p>
          <p className="text-red-600 mt-2">
            <ExclamationCircleOutlined className="mr-1"/>
            Hành động này không thể hoàn tác!
          </p>
        </div>),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                deleteManyOpportunities({
                    resource: 'opportunities',
                    ids: selectedRowKeys,
                    successNotification: false,
                    errorNotification: false,
                }, {
                    onSuccess: () => {
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        Modal.success({
                            title: 'Xóa thành công',
                            content: `Đã xóa ${selectedRowKeys.length} cơ hội thành công.`,
                        });
                        invalidate({
                            resource: "opportunities",
                            invalidates: ["list", "many"],
                        });
                        if (!isAdmin && currentUser?._id) {
                            invalidate({
                                resource: `opportunities/owner/${currentUser._id}`,
                                invalidates: ["list", "many"],
                            });
                        }
                    },
                    onError: (error: any) => {
                        const message = error?.response?.data?.message ||
                            error?.message ||
                            'Xóa cơ hội thất bại, vui lòng thử lại.';
                        Modal.error({
                            title: 'Không thể xóa cơ hội',
                            content: message,
                        });
                    },
                });
            },
        });
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: Opportunity[]) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
            setSelectedRows(selectedRows);
        },
    };
    return (<div className="page-container">
     
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Typography.Title level={2} className="!mb-2 !text-gray-800">
              Quản lý cơ hội bán hàng
            </Typography.Title>
            <Typography.Text type="secondary" className="text-base">
              Theo dõi và quản lý các cơ hội bán hàng của bạn
            </Typography.Text>
          </div>
          <Space>
            <Button icon={<FilterOutlined />} className="professional-button" size="large">
              Bộ lọc
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => go({
            to: { resource: "opportunities", action: "create" },
            options: { keepQuery: true },
            type: "push",
        })} className="professional-button" size="large">
              Thêm cơ hội
            </Button>
          </Space>
        </div>

        
        <Card className="mb-4" bodyStyle={{ padding: '16px 24px' }}>
          <Form {...searchFormProps} layout="inline" style={{ width: '100%' }}>
            <Form.Item name="name" style={{ marginBottom: 0, width: '100%' }}>
              <Input.Search placeholder="Tìm kiếm cơ hội theo tên hoặc khách hàng..." size="large" className="professional-input" style={{ maxWidth: 600 }} onSearch={() => searchFormProps?.form?.submit?.()} allowClear/>
            </Form.Item>
          </Form>
        </Card>
      </div>

      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Tổng cơ hội" value={getStatsData().total} color="#3b82f6" isActive={activeFilter === 'total'} onClick={() => handleFilterClick('total')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Đã thành công" value={getStatsData().won} color="#10b981" isActive={activeFilter === 'won'} onClick={() => handleFilterClick('won')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Đang xử lý" value={getStatsData().processing} color="#f59e0b" isActive={activeFilter === 'processing'} onClick={() => handleFilterClick('processing')}/>
        </Col>
        <Col xs={24} sm={6}>
          <FilterableStatsCard title="Đã thất bại" value={getStatsData().lost} color="#ef4444" isActive={activeFilter === 'lost'} onClick={() => handleFilterClick('lost')}/>
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
                  Đã chọn {selectedRowKeys.length} cơ hội
                </Typography.Text>
                <br />
                <Typography.Text className="text-red-600 text-sm">
                  Nhấn nút bên dưới để xóa tất cả cơ hội đã chọn
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} cơ hội`,
            className: "custom-pagination",
        }} rowKey="_id" className="professional-table" size="middle" scroll={{ x: 1400 }}>
          <Table.Column<Opportunity> dataIndex="search" title={<div className="flex items-center space-x-2">
                <AimOutlined className="text-blue-500"/>
                <span className="font-semibold">Tên cơ hội</span>
              </div>} defaultFilteredValue={getDefaultFilter("_id", filters)} filterIcon={<SearchOutlined />} filterDropdown={(props) => (<FilterDropdown {...props}>
                <Input placeholder="Tìm kiếm cơ hội"/>
              </FilterDropdown>)} render={(_, record) => (<div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <AimOutlined className="text-white text-sm"/>
                </div>
                <div>
                  <Typography.Text strong className="text-gray-800">
                    {record.name}
                  </Typography.Text>
                  <br />
                  <Typography.Text className="text-xs text-gray-500">
                    ID: {record._id?.slice(-6)}
                  </Typography.Text>
                </div>
              </div>)} width={250}/>

          <Table.Column<Opportunity> dataIndex="opportunityStage" title={<div className="flex items-center space-x-2">
                <TagOutlined className="text-orange-500"/>
                <span className="font-semibold">Giai đoạn</span>
              </div>} render={(stage) => (<Tag color={getStageColor(stage)} className="px-3 py-1 rounded-full font-medium">
                {getStageIcon(stage)} {opportunityStageLabel[stage]}
              </Tag>)} width={170} filters={stageList.map(stage => ({
            text: stage.label,
            value: stage.value
        }))} onFilter={(value, record) => record.opportunityStage === value}/>

          <Table.Column<Opportunity> dataIndex="amount" title={<div className="flex items-center space-x-2">
                <DollarOutlined className="text-green-500"/>
                <span className="font-semibold">Giá trị</span>
              </div>} render={(amount) => (<Typography.Text strong className="text-green-600 text-lg">
                {formatCurrency(amount || 0)}
              </Typography.Text>)} width={180} sorter={(a, b) => (a.amount || 0) - (b.amount || 0)}/>

          <Table.Column<Opportunity> dataIndex="probability" title={<div className="flex items-center space-x-2">
                <RiseOutlined className="text-purple-500"/>
                <span className="font-semibold">Xác suất</span>
              </div>} render={(probability) => (<div className="flex items-center space-x-2">
                <Progress percent={probability || 0} size="small" strokeColor="#3b82f6" showInfo={false} className="flex-1"/>
                <Typography.Text strong className="text-blue-600 text-sm">
                  {probability || 0}%
                </Typography.Text>
              </div>)} width={140} sorter={(a, b) => (a.probability || 0) - (b.probability || 0)}/>

          <Table.Column<Opportunity> dataIndex="leadId" title={<div className="flex items-center space-x-2">
                <UserOutlined className="text-cyan-500"/>
                <span className="font-semibold">Khách hàng</span>
              </div>} render={(lead) => (<Typography.Text className="text-gray-700">
                {typeof lead === "object" ? lead?.name : lead || "Chưa có"}
              </Typography.Text>)} width={150}/>

          <Table.Column<Opportunity> dataIndex="closeDate" title={<div className="flex items-center space-x-2">
                <CalendarOutlined className="text-indigo-500"/>
                <span className="font-semibold">Ngày kết thúc</span>
              </div>} render={(date) => (<Typography.Text className="text-gray-700">
                {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
              </Typography.Text>)} width={140} sorter={(a, b) => {
            if (!a.closeDate)
                return 1;
            if (!b.closeDate)
                return -1;
            return new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
        }}/>

          <Table.Column<Opportunity> dataIndex="nextStep" title={<div className="flex items-center space-x-2">
                <RightOutlined className="text-emerald-500"/>
                <span className="font-semibold">Bước tiếp theo</span>
              </div>} render={(nextStep) => (<Typography.Text className="text-gray-700" ellipsis>
                {nextStep || "-"}
              </Typography.Text>)} width={180}/>

          <Table.Column<Opportunity> fixed="right" dataIndex="_id" title={<div className="flex items-center justify-center">
                <span className="font-semibold">Thao tác</span>
              </div>} render={(_, record) => (<Space size="small">
                <Tooltip title="Xem chi tiết">
                  <Button size="small" icon={<EyeOutlined />} onClick={() => {
                go({
                    to: `/opportunities/preview/${record._id}`,
                    options: { keepQuery: true },
                    type: "push",
                });
            }} className="!border-blue-200 !text-blue-600 hover:!border-blue-400 hover:!text-blue-800"/>
                </Tooltip>
                <Tooltip title="Chỉnh sửa">
                  <Button size="small" icon={<EditOutlined />} onClick={() => showEditModal(record._id)} className="!border-green-200 !text-green-600 hover:!border-green-400 hover:!text-green-800"/>
                </Tooltip>
                <Tooltip title="Xóa">
                  <Button icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteOpportunity(record._id)} className="!border-red-200 !text-red-600 hover:!border-red-400 hover:!text-red-800"/>
                </Tooltip>
              </Space>)} width={140}/>
        </Table>
      </Card>

      {children}


      <div>
        <Modal open={detailVisible} onCancel={() => setDetailVisible(false)} centered okText="Lưu" cancelText="Hủy" footer={null} width={900} styles={{ body: { maxHeight: "calc(80vh - 200px)", overflowY: "auto" } }} title="Chi tiết cơ hội">
          {selectedOpportunity && (<div>
              <Card className="mb-2" title="Giai đoạn" bordered>
                <Steps type="navigation" size="small" current={currentStageIndex}>
                  {stageList.map((stage, i) => (<Step key={stage.value} title={opportunityStageLabel[stage.value]} status={getStepStatus(i, selectedOpportunity.opportunityStage)}/>))}
                </Steps>
              </Card>

              <Card title="Chi tiết" bordered>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <DetailRow label="Tên cơ hội" value={selectedOpportunity.name}/>
                    <DetailRow label="Mô tả" value={selectedOpportunity.description}/>
                    <DetailRow label="Ngày kết thúc" value={selectedOpportunity.closeDate
                ? dayjs(selectedOpportunity.closeDate).format("DD/MM/YYYY HH:mm")
                : "-"}/>
                    <DetailRow label="Bước tiếp theo" value={selectedOpportunity.nextStep}/>
                    <DetailRow label="Giai đoạn" value={opportunityStageLabel[selectedOpportunity.opportunityStage]}/>
                  </Col>
                  <Col span={12}>
                    <DetailRow label="Lead" value={typeof selectedOpportunity.leadId === "string"
                ? selectedOpportunity.leadId
                : selectedOpportunity.leadId?.name}/>
                
                    <DetailRow label="Xác suất" value={`${selectedOpportunity.probability}%`}/>
                    <DetailRow label="Giá trị dự kiến" value={selectedOpportunity.amount?.toLocaleString()}/>
                    <DetailRow label="Người phụ trách" value={selectedOpportunity.ownerId}/>
                  </Col>
                </Row>
              </Card>
            </div>)}
        </Modal>
      </div>

      
      <OpportunityEditModal modalProps={editModalProps} formProps={editFormProps} ownerSelectProps={ownerSelectProps} leadSelectProps={leadSelectProps} campaignSelectProps={campaignSelectProps} isAdmin={isAdmin}/>

    </div>);
};
