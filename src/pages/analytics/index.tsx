import { Card, Col, Row, Spin, Statistic } from "antd";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  UserOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  RocketOutlined,
} from "@ant-design/icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  leadsByStatus: Array<{ status: string; count: number }>;
  leadsBySource: Array<{ source: string; count: number }>;
  opportunitiesByStage: Array<{
    stage: string;
    count: number;
    totalValue: number;
  }>;
  tasksByStatus: Array<{ status: string; count: number }>;
  revenueByMonth: Array<{ month: string; revenue: number; count: number }>;
  campaignPerformance: Array<{
    name: string;
    leadCount: number;
    status: string;
  }>;
  conversionRate: {
    totalLeads: number;
    totalOpportunities: number;
    wonOpportunities: number;
    leadToOpportunityRate: number;
    opportunityToWonRate: number;
  };
  totalCounts: {
    totalLeads: number;
    totalOpportunities: number;
    totalTasks: number;
    totalCampaigns: number;
  };
}

const API_URL = "http://localhost:3000";

export const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const opportunityStageLabels: Record<string, string> = {
    QUALIFICATION: "Đánh giá",
    NEEDS_ANALYSIS: "Phân tích nhu cầu",
    PROPOSAL: "Đề xuất",
    NEGOTIATION: "Thương lượng",
    CLOSED_WON: "Thành công",
    CLOSED_LOST: "Thất bại",
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/analytics/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <div>Không có dữ liệu</div>;
  }

  const colorPalette = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  const leadsByStatusData = {
    labels: data.leadsByStatus.map((item) => item.status),
    datasets: [
      {
        label: "Số lượng leads",
        data: data.leadsByStatus.map((item) => item.count),
        backgroundColor: colorPalette.slice(0, data.leadsByStatus.length),
      },
    ],
  };

  const leadsBySourceData = {
    labels: data.leadsBySource.map((item) => item.source),
    datasets: [
      {
        label: "Số lượng leads",
        data: data.leadsBySource.map((item) => item.count),
        backgroundColor: colorPalette.slice(0, data.leadsBySource.length),
      },
    ],
  };

  const opportunitiesByStageData = {
    labels: data.opportunitiesByStage.map((item) => 
      opportunityStageLabels[item.stage] || item.stage
    ),
    datasets: [
      {
        label: "Số lượng cơ hội",
        data: data.opportunitiesByStage.map((item) => item.count),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Tổng giá trị (VND)",
        data: data.opportunitiesByStage.map((item) => item.totalValue),
        backgroundColor: "#10b981",
        yAxisID: "y1",
      },
    ],
  };

  const tasksByStatusData = {
    labels: data.tasksByStatus.map((item) => item.status),
    datasets: [
      {
        data: data.tasksByStatus.map((item) => item.count),
        backgroundColor: colorPalette.slice(0, data.tasksByStatus.length),
      },
    ],
  };

  const revenueByMonthData = {
    labels: data.revenueByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: data.revenueByMonth.map((item) => item.revenue),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Số giao dịch",
        data: data.revenueByMonth.map((item) => item.count),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        fill: true,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const campaignPerformanceData = {
    labels: data.campaignPerformance.map((item) => item.name),
    datasets: [
      {
        label: "Số lượng leads",
        data: data.campaignPerformance.map((item) => item.leadCount),
        backgroundColor: "#8b5cf6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const multiAxisOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "bold" }}>
        Báo Cáo Thống Kê
      </h1>

      {}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng Leads"
              value={data.totalCounts.totalLeads}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng Cơ Hội"
              value={data.totalCounts.totalOpportunities}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng Tasks"
              value={data.totalCounts.totalTasks}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng Campaigns"
              value={data.totalCounts.totalCampaigns}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} md={12}>
          <Card>
            <Statistic
              title="Tỷ lệ chuyển đổi Lead → Cơ hội"
              value={data.conversionRate.leadToOpportunityRate}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Statistic
              title="Tỷ lệ chuyển đổi Cơ hội → Thành công"
              value={data.conversionRate.opportunityToWonRate}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Leads theo Trạng thái" style={{ height: "400px" }}>
            <div style={{ height: "320px" }}>
              <Doughnut data={leadsByStatusData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Leads theo Nguồn" style={{ height: "400px" }}>
            <div style={{ height: "320px" }}>
              <Pie data={leadsBySourceData} options={chartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Cơ hội theo Giai đoạn" style={{ height: "400px" }}>
            <div style={{ height: "320px" }}>
              <Bar data={opportunitiesByStageData} options={multiAxisOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Tasks theo Trạng thái" style={{ height: "400px" }}>
            <div style={{ height: "320px" }}>
              <Doughnut data={tasksByStatusData} options={chartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Doanh thu theo Tháng" style={{ height: "400px" }}>
            <div style={{ height: "320px" }}>
              <Line data={revenueByMonthData} options={multiAxisOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Hiệu suất Chiến dịch (Top 10)" style={{ height: "400px" }}>
            <div style={{ height: "320px" }}>
              <Bar data={campaignPerformanceData} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};