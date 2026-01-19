import { CalendarOutlined, MailOutlined, MessageOutlined, PhoneOutlined, AudioOutlined, RobotOutlined, FileTextOutlined } from "@ant-design/icons";
import { DeleteButton, EditButton } from "@refinedev/antd";
import { Card, Space, Tooltip, Typography, Badge, Collapse } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface InteractionCardProps {
    interaction: {
        _id: string;
        interactionType: string;
        detail: string;
        transcript?: string; 
        createdAt: string;
    };
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
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
export const InteractionCard: React.FC<InteractionCardProps> = ({ interaction, onDelete, onEdit }) => {
    const hasTranscript = !!interaction.transcript;
    const [showTranscript, setShowTranscript] = useState(false);

    return (
        <Card 
            size="small" 
            className="interaction-card" 
            style={{
                marginBottom: 12,
                borderRadius: 12,
                border: hasTranscript ? '2px solid #52c41a' : 'none',
                background: getInteractionColor(interaction.interactionType),
                boxShadow: hasTranscript 
                    ? '0 4px 12px rgba(82, 196, 26, 0.15)' 
                    : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
            }} 
            hoverable 
            bodyStyle={{ padding: '16px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <Space align="start" style={{ width: '100%' }}>
                        <div style={{ marginTop: 2 }}>
                            {getInteractionIcon(interaction.interactionType)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                                <Text strong style={{ fontSize: 14, color: '#1f2937' }}>
                                    {interaction.interactionType}
                                </Text>

                                <Text type="secondary" style={{
                                    fontSize: 12,
                                    color: '#6b7280'
                                }}>
                                    {dayjs(interaction.createdAt).format("DD/MM/YYYY HH:mm")}
                                </Text>
                            </div>

                            <Paragraph 
                                style={{
                                    margin: 0,
                                    fontSize: 13,
                                    color: '#374151',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-line'
                                }} 
                                ellipsis={{ rows: 4, expandable: true, symbol: 'Xem thêm' }}
                            >
                                {interaction.detail}
                            </Paragraph>

                            {hasTranscript && (
                                <div style={{ marginTop: 12 }}>
                                    <Collapse 
                                        ghost
                                        onChange={(keys) => setShowTranscript(keys.length > 0)}
                                        style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 8 }}
                                    >
                                        <Panel 
                                            header={
                                                <Space style={{ fontSize: 12}}>
                                               
                                                    <span>Xem nội dung phiên âm đầy đủ</span>
                                                </Space>
                                            } 
                                            key="1"
                                        >
                                            <div style={{ 
                                                background: 'white',
                                                padding: 12,
                                                borderRadius: 8,
                                                maxHeight: 300,
                                                overflowY: 'auto',
                                                fontSize: 13,
                                                color: '#374151',
                                                lineHeight: '1.6',
                                                whiteSpace: 'pre-line',
                                                border: '1px solid #e5e7eb'
                                            }}>
                                                {interaction.transcript}
                                            </div>
                                        </Panel>
                                    </Collapse>
                                </div>
                            )}
                        </div>
                    </Space>
                </div>

                <div style={{ marginLeft: 12 }}>
                    <Space size="small">
                        {onEdit && (
                            <Tooltip title="Chỉnh sửa tương tác">
                                <EditButton 
                                    resource="interactions" 
                                    recordItemId={interaction._id} 
                                    size="small" 
                                    hideText 
                                    onClick={() => onEdit(interaction._id)} 
                                    style={{
                                        opacity: 0.7,
                                        transition: 'opacity 0.2s ease'
                                    }}
                                />
                            </Tooltip>
                        )}
                        <Tooltip title="Xóa tương tác">
                            <DeleteButton 
                                resource="interactions" 
                                recordItemId={interaction._id} 
                                size="small" 
                                hideText 
                                danger 
                                onSuccess={() => onDelete(interaction._id)} 
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