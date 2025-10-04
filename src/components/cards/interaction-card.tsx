import { CalendarOutlined, MailOutlined, MessageOutlined, PhoneOutlined } from "@ant-design/icons";
import { DeleteButton } from "@refinedev/antd";
import { Card, Space, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
const { Text, Paragraph } = Typography;
interface InteractionCardProps {
    interaction: {
        _id: string;
        interactionType: string;
        detail: string;
        createdAt: string;
    };
    onDelete: (id: string) => void;
}
const getInteractionIcon = (type: string) => {
    const lowered = (type || '').trim().toLowerCase();
    if (lowered.includes('gọi') || lowered.includes('goi') || lowered === 'call' || lowered === 'phone') {
        return <PhoneOutlined style={{ color: '#52c41a' }}/>;
    }
    if (lowered.includes('email') || lowered.includes('mail')) {
        return <MailOutlined style={{ color: '#1890ff' }}/>;
    }
    if (lowered.includes('gặp') || lowered.includes('gap') || lowered.includes('meeting') || lowered.includes('appointment')) {
        return <CalendarOutlined style={{ color: '#722ed1' }}/>;
    }
    if (lowered.includes('nhắn') || lowered.includes('nhan') || lowered.includes('tin')) {
        return <MessageOutlined style={{ color: '#fa8c16' }}/>;
    }
    return <MessageOutlined style={{ color: '#fa8c16' }}/>;
};
const getInteractionColor = (type: string) => {
    const lowered = (type || '').trim().toLowerCase();
    if (lowered.includes('gọi') || lowered.includes('goi') || lowered === 'call' || lowered === 'phone') {
        return '#f6ffed';
    }
    if (lowered.includes('email') || lowered.includes('mail')) {
        return '#f0f9ff';
    }
    if (lowered.includes('gặp') || lowered.includes('gap') || lowered.includes('meeting') || lowered.includes('appointment')) {
        return '#f9f0ff';
    }
    if (lowered.includes('nhắn') || lowered.includes('nhan') || lowered.includes('tin')) {
        return '#fff7e6';
    }
    return '#fff7e6';
};
export const InteractionCard: React.FC<InteractionCardProps> = ({ interaction, onDelete }) => {
    return (<Card size="small" className="interaction-card" style={{
            marginBottom: 12,
            borderRadius: 12,
            border: 'none',
            background: getInteractionColor(interaction.interactionType),
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease',
        }} hoverable bodyStyle={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Space align="start" style={{ width: '100%' }}>
            <div style={{ marginTop: 2 }}>
              {getInteractionIcon(interaction.interactionType)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Text strong style={{ fontSize: 14, color: '#1f2937' }}>
                  {interaction.interactionType}
                </Text>
                <Text type="secondary" style={{
            fontSize: 12,
            marginLeft: 8,
            color: '#6b7280'
        }}>
                  {dayjs(interaction.createdAt).format("DD/MM/YYYY HH:mm")}
                </Text>
              </div>

              <Paragraph style={{
            margin: 0,
            fontSize: 13,
            color: '#374151',
            lineHeight: '1.5'
        }} ellipsis={{ rows: 3, expandable: true }}>
                {interaction.detail}
              </Paragraph>
            </div>
          </Space>
        </div>

        <div style={{ marginLeft: 12 }}>
          <Tooltip title="Xóa tương tác">
            <DeleteButton resource="interactions" recordItemId={interaction._id} size="small" hideText danger onSuccess={() => onDelete(interaction._id)} style={{
            opacity: 0.7,
            transition: 'opacity 0.2s ease'
        }}/>
          </Tooltip>
        </div>
      </div>
    </Card>);
};
