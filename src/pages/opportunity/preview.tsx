import { BackButton } from "@/components/back-button";
import { ProfessionalFormItem, ProfessionalModal } from "@/components/modal";
import { Opportunity, OpportunityStage } from "@/interfaces/opportunity";
import type { User } from "@/interfaces/user";
import { AimOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined, EditOutlined, FileTextOutlined, FlagOutlined, LinkOutlined, PercentageOutlined, RiseOutlined, TagOutlined, TeamOutlined, TrophyOutlined, UserOutlined } from "@ant-design/icons";
import { useModalForm, useSelect } from "@refinedev/antd";
import { useGo, useOne, useGetIdentity } from "@refinedev/core";
import { Avatar, Button, Card, Col, DatePicker, Divider, Form, Input, InputNumber, message, Progress, Row, Select, Space, Statistic, Steps, Tag, Timeline, Typography } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router";
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const EditOpportunityModal = ({ modalProps, formProps, saveButtonProps, formLoading }: {
    modalProps: any;
    formProps: any;
    saveButtonProps: any;
    formLoading: boolean;
}) => {
    const { data: currentUser } = useGetIdentity<User>();
    const isAdmin = currentUser?.role?.name === 'Admin';
    
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
    const { selectProps: ownerSelectProps } = useSelect({
        resource: "auth",
        optionLabel: "name",
        optionValue: "_id",
        pagination: { mode: 'off' },
        queryOptions: { enabled: isAdmin },
    });
    return (<ProfessionalModal {...modalProps} okText="Lưu" cancelText="Hủy" title="Chỉnh sửa cơ hội bán hàng" icon={<DollarOutlined className="text-green-600"/>} width={800} destroyOnClose>
      <Form {...formProps} layout="vertical" className="space-y-4">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Tên cơ hội" name="name" icon={<FileTextOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng nhập tên cơ hội" }]}>
              <Input placeholder="Nhập tên cơ hội"/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Giai đoạn" name="opportunityStage" icon={<TagOutlined className="text-purple-500"/>} rules={[{ required: true, message: "Vui lòng chọn giai đoạn" }]}>
              <Select placeholder="Chọn giai đoạn" options={[
                { label: "Đánh giá", value: OpportunityStage.QUALIFICATION },
                { label: "Phân tích nhu cầu", value: OpportunityStage.NEEDS_ANALYSIS },
                { label: "Đề xuất", value: OpportunityStage.PROPOSAL },
                { label: "Thương lượng", value: OpportunityStage.NEGOTIATION },
                { label: "Thành công", value: OpportunityStage.CLOSED_WON },
                { label: "Thất bại", value: OpportunityStage.CLOSED_LOST },
              ]}/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <ProfessionalFormItem label="Mô tả" name="description" icon={<FileTextOutlined className="text-gray-500"/>}>
          <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết" showCount maxLength={500}/>
        </ProfessionalFormItem>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <ProfessionalFormItem label="Giá trị" name="amount" icon={<DollarOutlined className="text-green-500"/>}>
              <InputNumber style={{ width: "100%" }} placeholder="Nhập giá trị" formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value!.replace(/₫\s?|(,*)/g, '')}/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={8}>
            <ProfessionalFormItem label="Tỷ lệ thành công (%)" name="probability" icon={<PercentageOutlined className="text-orange-500"/>}>
              <InputNumber min={0} max={100} style={{ width: "100%" }} placeholder="Nhập tỷ lệ" formatter={value => `${value}%`} parser={value => {
            const num = Number(value!.replace('%', ''));
            return Math.min(Math.max(num, 0), 100) as 0 | 100;
        }}/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={8}>
            <ProfessionalFormItem label="Ngày đóng" name="closeDate" icon={<CalendarOutlined className="text-red-500"/>} getValueProps={(value) => ({
            value: value ? dayjs(value) : null,
        })}>
              <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày"/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>

          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Bước tiếp theo" name="nextStep" icon={<FlagOutlined className="text-indigo-500"/>}>
              <Input placeholder="Nhập bước tiếp theo"/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Khách hàng" name="leadId" icon={<UserOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}>
              <Select {...leadSelectProps} placeholder="Chọn khách hàng"/>
            </ProfessionalFormItem>
          </Col>
        </Row>

     

        {isAdmin && (
          <ProfessionalFormItem label="Người phụ trách" name="ownerId" icon={<UserOutlined className="text-gray-500"/>}>
            <Select {...ownerSelectProps} placeholder="Chọn người phụ trách" allowClear/>
          </ProfessionalFormItem>
        )}
      </Form>
    </ProfessionalModal>);
};
export const OpportunityPreview = () => {
    const { id } = useParams();
    const go = useGo();
    const { data: opportunityData, isLoading } = useOne<Opportunity>({
        resource: "opportunities",
        id: id,
    });
    const opportunity = opportunityData?.data;
    const { formProps, modalProps, show, } = useModalForm({
        action: "edit",
        resource: "opportunities",
        id: opportunity?._id,
        redirect: false,
        mutationMode: "pessimistic",
        onMutationSuccess: () => {
            message.success("Cập nhật cơ hội thành công!");
        },
    });
    const { data: leadData } = useOne({
        resource: "leads",
        id: typeof opportunity?.leadId === "object" ? opportunity?.leadId?._id : opportunity?.leadId,
        queryOptions: {
            enabled: !!opportunity?.leadId,
        },
    });
    const { data: campaignData } = useOne({
        resource: "campaigns",
        id: typeof opportunity?.campaignId === "object" ? opportunity?.campaignId?._id : opportunity?.campaignId,
        queryOptions: {
            enabled: !!opportunity?.campaignId,
        },
    });
    const { data: ownerData } = useOne({
        resource: "auth",
        id: typeof opportunity?.ownerId === "object" ? (opportunity?.ownerId as any)?._id : (opportunity as any)?.ownerId,
        queryOptions: {
            enabled: !!opportunity?.ownerId,
        },
    });
    if (isLoading) {
        return (<div className="page-container">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>);
    }
    if (!opportunity) {
        return (<div className="page-container">
        <Card>
          <div className="text-center py-8">
            <Text type="secondary">Không tìm thấy cơ hội bán hàng</Text>
          </div>
        </Card>
      </div>);
    }
    const stageList = [
        { value: "QUALIFICATION", label: "Đánh giá", icon: "🎯", color: "#1890ff" },
        { value: "NEEDS_ANALYSIS", label: "Phân tích nhu cầu", icon: "🔍", color: "#fa8c16" },
        { value: "PROPOSAL", label: "Đề xuất", icon: "📋", color: "#722ed1" },
        { value: "NEGOTIATION", label: "Thương lượng", icon: "🤝", color: "#eb2f96" },
        { value: "CLOSED_WON", label: "Thành công", icon: "✅", color: "#52c41a" },
        { value: "CLOSED_LOST", label: "Thất bại", icon: "❌", color: "#ff4d4f" },
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
            case 'QUALIFICATION': return '#1890ff';
            case 'NEEDS_ANALYSIS': return '#fa8c16';
            case 'PROPOSAL': return '#722ed1';
            case 'NEGOTIATION': return '#eb2f96';
            case 'CLOSED_WON': return '#52c41a';
            case 'CLOSED_LOST': return '#ff4d4f';
            default: return '#8c8c8c';
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
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    const currentStageIndex = getStageIndex(opportunity.opportunityStage);
    const stageColor = getStageColor(opportunity.opportunityStage);
    return (<div className="page-container">
        <div className="mb-4">
        <BackButton />
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={2} className="!mb-2 !text-gray-800">
              {opportunity.name}
            </Title>
            <Text type="secondary" className="text-base">
              Chi tiết cơ hội bán hàng
            </Text>
          </div>
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={() => show(opportunity?._id)} className="professional-button" size="large">
              Chỉnh sửa
            </Button>
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        
        <Col xs={24} lg={16}>
          
          <Card className="professional-card mb-6" title={<div className="flex items-center space-x-2">
              <FlagOutlined className="text-blue-500"/>
              <span>Tiến trình cơ hội</span>
            </div>}>
            <div className="mb-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-white font-semibold text-lg" style={{ backgroundColor: stageColor }}>
                  <span className="mr-2 text-xl">{getStageIcon(opportunity.opportunityStage)}</span>
                  {opportunityStageLabel[opportunity.opportunityStage]}
                </div>
              </div>
              
              <Steps direction="horizontal" current={currentStageIndex} size="small" className="mb-4">
                {stageList.map((stage, i) => (<Step key={stage.value} title={<div className="text-center">
                        <div className="text-lg mb-1">{getStageIcon(stage.value)}</div>
                        <div className="text-xs font-medium">{stage.label}</div>
                      </div>} status={getStepStatus(i, opportunity.opportunityStage)} icon={<div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{
                    backgroundColor: getStepStatus(i, opportunity.opportunityStage) === 'finish' ? stageColor :
                        getStepStatus(i, opportunity.opportunityStage) === 'process' ? stageColor :
                            getStepStatus(i, opportunity.opportunityStage) === 'error' ? '#ff4d4f' : '#d9d9d9'
                }}>
                        {i + 1}
                      </div>}/>))}
              </Steps>
            </div>
          </Card>

          
          <Card className="professional-card mb-6" title={<div className="flex items-center space-x-2">
              <FileTextOutlined className="text-green-500"/>
              <span>Thông tin chi tiết</span>
            </div>}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="mb-4">
                  <Text strong className="text-gray-600">Tên cơ hội:</Text>
                  <div className="mt-1">
                    <Text className="text-lg">{opportunity.name}</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="mb-4">
                  <Text strong className="text-gray-600">Giá trị dự kiến:</Text>
                  <div className="mt-1">
                    <Text className="text-lg text-green-600 font-semibold">
                      {formatCurrency(opportunity.amount || 0)}
                    </Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="mb-4">
                  <Text strong className="text-gray-600">Mô tả:</Text>
                  <div className="mt-1">
                    <Paragraph className="text-gray-700">
                      {opportunity.description || "Chưa có mô tả"}
                    </Paragraph>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="mb-4">
                  <Text strong className="text-gray-600">Bước tiếp theo:</Text>
                  <div className="mt-1">
                    <Text className="text-gray-700">
                      {opportunity.nextStep || "Chưa xác định"}
                    </Text>
                  </div>
                </div>
              </Col>
           
            </Row>
          </Card>

          
          <Card className="professional-card" title={<div className="flex items-center space-x-2">
              <ClockCircleOutlined className="text-purple-500"/>
              <span>Timeline</span>
            </div>}>
            <Timeline>
              {opportunity.closeDate && (<Timeline.Item dot={<TrophyOutlined style={{ color: stageColor }}/>} color={stageColor}>
                  <div>
                    <Text strong>Ngày kết thúc dự kiến</Text>
                    <div>
                      <Text type="secondary">
                        {dayjs(opportunity.closeDate).format("DD/MM/YYYY HH:mm")}
                      </Text>
                    </div>
                  </div>
                </Timeline.Item>)}
              {!opportunity.closeDate && (<Timeline.Item dot={<CalendarOutlined style={{ color: '#8c8c8c' }}/>} color="gray">
                  <div>
                    <Text strong>Chưa có ngày kết thúc</Text>
                    <div>
                      <Text type="secondary">Cần cập nhật ngày kết thúc dự kiến</Text>
                    </div>
                  </div>
                </Timeline.Item>)}
            </Timeline>
          </Card>
        </Col>

        
        <Col xs={24} lg={8}>
          
          <Card className="professional-card mb-6" title={<div className="flex items-center space-x-2">
              <RiseOutlined className="text-orange-500"/>
              <span>Thống kê</span>
            </div>}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic title="Xác suất thành công" value={opportunity.probability || 0} suffix="%" valueStyle={{ color: '#1890ff' }}/>
                <Progress percent={opportunity.probability || 0} strokeColor="#1890ff" showInfo={false} className="mt-2"/>
              </Col>
              <Col span={24}>
                <Statistic title="Giá trị cơ hội" value={opportunity.amount || 0} formatter={(value) => formatCurrency(Number(value))} valueStyle={{ color: '#52c41a' }}/>
              </Col>
              
            </Row>
          </Card>

          
          <Card className="professional-card mb-6" title={<div className="flex items-center space-x-2">
              <TeamOutlined className="text-cyan-500"/>
              <span>Thông tin liên quan</span>
            </div>}>
            <Space direction="vertical" size="middle" className="w-full">
              <div>
                <Text strong className="text-gray-600">Khách hàng:</Text>
                <div className="mt-1 flex items-center space-x-2">
                  <Avatar icon={<UserOutlined />} size="small"/>
                  <Text>
                    {leadData?.data?.name ||
            (typeof opportunity.leadId === "object" ? opportunity.leadId?.name : opportunity.leadId) ||
            "Chưa có"}
                  </Text>
                </div>
              </div>
              
              <Divider className="my-2"/>
              
              <div>
                <Text strong className="text-gray-600">Chiến dịch:</Text>
                <div className="mt-1 flex items-center space-x-2">
                  <Avatar icon={<AimOutlined />} size="small"/>
                  <Text>
                    {campaignData?.data?.name ||
            (typeof opportunity.campaignId === "object" ? opportunity.campaignId?.name : opportunity.campaignId) ||
            "Chưa có"}
                  </Text>
                </div>
              </div>
              
              <Divider className="my-2"/>
              
              <div>
                <Text strong className="text-gray-600">Người phụ trách:</Text>
                <div className="mt-1 flex items-center space-x-2">
                  <Avatar icon={<UserOutlined />} size="small"/>
                  <Text>
                    {ownerData?.data?.name ||
            (typeof opportunity.ownerId === "object" ? (opportunity.ownerId as any)?.name : undefined) ||
            "Chưa phân công"}
                  </Text>
                </div>
              </div>
            </Space>
          </Card>

        </Col>
      </Row>

      
      <EditOpportunityModal modalProps={modalProps} formProps={formProps} saveButtonProps={{}} formLoading={false}/>
    </div>);
};
