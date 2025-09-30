import {
  CalendarOutlined,
  DollarOutlined,
  RiseOutlined,
  TrophyOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { DeleteButton } from "@refinedev/antd";
import { Card, Progress, Space, Tag, Tooltip, Typography, Button } from "antd";
import dayjs from "dayjs";
import React from "react";
import { useGo } from "@refinedev/core";

const { Text, Paragraph } = Typography;

interface OpportunityCardProps {
  opportunity: {
    _id: string;
    name: string;
    amount: number;
    opportunityStage: string;
    createdAt: string;
    probability?: number;
    closeDate?: string;
  };
  onDelete: (id: string) => void;
}

const getStageColor = (stage: string) => {
  switch (stage.toLowerCase()) {
    case 'qualification':
      return { color: '#1890ff', bg: '#e6f7ff' };
    case 'proposal':
      return { color: '#722ed1', bg: '#f9f0ff' };
    case 'negotiation':
      return { color: '#fa8c16', bg: '#fff7e6' };
    case 'closed_won':
      return { color: '#52c41a', bg: '#f6ffed' };
    case 'closed_lost':
      return { color: '#ff4d4f', bg: '#fff2f0' };
    default:
      return { color: '#8c8c8c', bg: '#f5f5f5' };
  }
};

const getStageIcon = (stage: string) => {
  switch (stage.toLowerCase()) {
    case 'qualification':
      return <RiseOutlined />;
    case 'proposal':
      return <CalendarOutlined />;
    case 'negotiation':
      return <RiseOutlined />;
    case 'closed_won':
      return <TrophyOutlined />;
    case 'closed_lost':
      return <CalendarOutlined />;
    default:
      return <RiseOutlined />;
  }
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onDelete
}) => {
  const go = useGo();
  const stageStyle = getStageColor(opportunity.opportunityStage);

  return (
    <Card
      size="small"
      className="opportunity-card"
      style={{
        marginBottom: 12,
        borderRadius: 12,
        border: 'none',
        background: stageStyle.bg,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        borderLeft: `4px solid ${stageStyle.color}`,
      }}
      hoverable
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Space align="start" style={{ width: '100%' }}>
            <div style={{ marginTop: 2 }}>
              <DollarOutlined style={{ color: stageStyle.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong style={{ fontSize: 14, color: '#1f2937', display: 'block', marginBottom: 4 }}>
                  {opportunity.name}
                </Text>
                <Tag
                  color={stageStyle.color}
                  style={{
                    fontSize: 11,
                    borderRadius: 6,
                    margin: 0
                  }}
                  icon={getStageIcon(opportunity.opportunityStage)}
                >
                  {opportunity.opportunityStage.replace('_', ' ')}
                </Tag>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <DollarOutlined style={{ fontSize: 12, color: '#6b7280', marginRight: 4 }} />
                <Text
                  strong
                  style={{
                    fontSize: 13,
                    color: '#1f2937'
                  }}
                >
                  {opportunity.amount?.toLocaleString('vi-VN')} VNĐ
                </Text>
              </div>

              {opportunity.probability && (
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>Xác suất thành công:</Text>
                  <Progress
                    percent={opportunity.probability}
                    size="small"
                    strokeColor={stageStyle.color}
                    style={{ marginTop: 4 }}
                    showInfo={false}
                  />
                  <Text style={{ fontSize: 11, color: '#6b7280' }}>{opportunity.probability}%</Text>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CalendarOutlined style={{ fontSize: 12, color: '#6b7280', marginRight: 4 }} />
                <Text
                  style={{
                    fontSize: 12,
                    color: '#6b7280'
                  }}
                >
                  Tạo: {dayjs(opportunity.createdAt).format("DD/MM/YYYY")}
                </Text>
                {opportunity.closeDate && (
                  <>
                    <Text style={{ margin: '0 8px', color: '#d1d5db' }}>•</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#6b7280'
                      }}
                    >
                      Đóng: {dayjs(opportunity.closeDate).format("DD/MM/YYYY")}
                    </Text>
                  </>
                )}
              </div>
            </div>
          </Space>
        </div>

        <div style={{ marginLeft: 12 }}>
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  go({
                    to: `/opportunities/preview/${opportunity._id}`,
                    options: { keepQuery: true },
                    type: "replace",
                  });
                }}
                style={{
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                  borderColor: '#1890ff',
                  color: '#1890ff'
                }}
              />
            </Tooltip>
            <Tooltip title="Xóa cơ hội">
              <DeleteButton
                resource="opportunities"
                recordItemId={opportunity._id}
                size="small"
                hideText
                danger
                onSuccess={() => onDelete(opportunity._id)}
                style={{
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease'
                }}
              />
            </Tooltip>
          </Space>
        </div>
      </div>
    </Card>
  );
};
