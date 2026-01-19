import { Campaign } from "@/interfaces/campaign";
import { useOne, useGo, useList } from "@refinedev/core";
import { Card, Col, Row, Typography, Tag, Space, Button, Statistic, Divider, Timeline, Avatar, } from "antd";
import { RocketOutlined, EditOutlined, CalendarOutlined, DollarOutlined, FileTextOutlined, UserOutlined, RiseOutlined, CheckCircleOutlined, } from "@ant-design/icons";
import { BackButton } from "@/components/back-button";
import { useParams } from "react-router";
import dayjs from "dayjs";
const { Title, Text, Paragraph } = Typography;
export const CampaignShow = () => {
    const { id } = useParams();
    const go = useGo();
    const { data, isLoading } = useOne<Campaign>({
        resource: "campaigns",
        id,
    });
    const campaign = data?.data;
    const { data: usersData } = useList({
        resource: "auth",
        pagination: { mode: 'off' },
    });
    const users = usersData?.data || [];
    const responsibleUser = users.find((user: any) => user._id === campaign?.responsibleUserId);
    const getStatusColor = (status?: string) => {
        switch ((status || "").toLowerCase()) {
            case "planned":
                return "blue";
            case "in progress":
                return "green";
            case "completed":
                return "purple";
            default:
                return "default";
        }
    };
    const getStatusText = (status?: string) => {
        switch ((status || "").toLowerCase()) {
            case "planned":
                return "Lên kế hoạch";
            case "in progress":
                return "Đang thực hiện";
            case "completed":
                return "Hoàn thành";
            default:
                return status || "N/A";
        }
    };
    const formatCurrency = (amount?: number) => new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    }).format(amount || 0);
    if (isLoading) {
        return (<div className="page-container">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>);
    }
    if (!campaign) {
        return (<div className="page-container">
        <Card>
          <div className="text-center py-8">
            <Text type="secondary">Không tìm thấy chiến dịch</Text>
          </div>
        </Card>
      </div>);
    }
    return (<div className="page-container">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <RocketOutlined className="text-white text-xl"/>
            </div>
            <div>
              <Title level={2} className="!mb-1 !text-gray-800">
                {campaign.name}
              </Title>
              <div className="flex items-center gap-2">
                <Tag color={getStatusColor(campaign.campaignStatus)} className="px-3 py-1 rounded-full font-medium">
                  {getStatusText(campaign.campaignStatus)}
                </Tag>
                <Tag color={campaign.isActive ? "green" : "default"} className="px-3 py-1 rounded-full font-medium">
                  {campaign.isActive ? "Đang hoạt động" : "Tạm dừng"}
                </Tag>
              </div>
            </div>
          </div>
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={() => go({ to: `/campaigns/edit/${campaign._id}` })} className="professional-button" size="large">
              Chỉnh sửa
            </Button>
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        
        <Col xs={24} lg={16}>
          <Card className="professional-card mb-6" title={<div className="flex items-center space-x-2">
              <FileTextOutlined className="text-green-500"/>
              <span>Thông tin chiến dịch</span>
            </div>}>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Text strong className="text-gray-600">Mô tả</Text>
                <div className="mt-1">
                  <Paragraph className="text-gray-700">
                    {campaign.description || "Chưa có mô tả"}
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="mb-2">
                  <Text strong className="text-gray-600">Ngày bắt đầu</Text>
                  <div className="mt-1">
                    <Text>
                      {campaign.startDate ? dayjs(campaign.startDate).format("DD/MM/YYYY") : "-"}
                    </Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="mb-2">
                  <Text strong className="text-gray-600">Ngày kết thúc</Text>
                  <div className="mt-1">
                    <Text>
                      {campaign.endDate ? dayjs(campaign.endDate).format("DD/MM/YYYY") : "-"}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <Card className="professional-card" title={<div className="flex items-center space-x-2">
              <CalendarOutlined className="text-red-500"/>
              <span>Timeline</span>
            </div>}>
            <Timeline>
              <Timeline.Item dot={<CalendarOutlined style={{ color: "#1890ff" }}/>} color="#1890ff">
                <Text strong>Ngày bắt đầu</Text>
                <div>
                  <Text type="secondary">{campaign.startDate ? dayjs(campaign.startDate).format("DD/MM/YYYY") : "Chưa có"}</Text>
                </div>
              </Timeline.Item>
              <Timeline.Item dot={<CalendarOutlined style={{ color: "#faad14" }}/>} color="#faad14">
                <Text strong>Ngày kết thúc</Text>
                <div>
                  <Text type="secondary">{campaign.endDate ? dayjs(campaign.endDate).format("DD/MM/YYYY") : "Chưa có"}</Text>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="professional-card mb-6" title={<div className="flex items-center space-x-2">
              <RiseOutlined className="text-indigo-500"/>
              <span>Thống kê</span>
            </div>}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic title="Ngân sách" value={campaign.campaignBudgetCost || 0} formatter={(v) => formatCurrency(Number(v))} valueStyle={{ color: "#3b82f6" }}/>
              </Col>
              <Col span={24}>
                <Statistic title="Doanh thu dự kiến" value={campaign.campaignExpectedRevenue || 0} formatter={(v) => formatCurrency(Number(v))} valueStyle={{ color: "#10b981" }}/>
              </Col>
              <Col span={24}>
                <Statistic title="Khách hàng" value={campaign.leadCount || 0} valueStyle={{ color: "#8b5cf6" }} prefix={<UserOutlined />}/>
              </Col>
              <Col span={24}>
                <Statistic title="Cơ hội" value={campaign.opportunityCount || 0} valueStyle={{ color: "#f59e0b" }} prefix={<CheckCircleOutlined />}/>
              </Col>
            </Row>
          </Card>

          <Card className="professional-card" title={<div className="flex items-center space-x-2">
              <UserOutlined className="text-cyan-500"/>
              <span>Người phụ trách</span>
            </div>}>
            <Space>
              <Avatar icon={<UserOutlined />}/>
              <Text>{responsibleUser?.name || "Chưa phân công"}</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>);
};
export default CampaignShow;