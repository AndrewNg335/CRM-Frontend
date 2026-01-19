import { BellOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { DeleteButton, EditButton } from "@refinedev/antd";
import { Card, Space, Tag, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
const { Text, Paragraph } = Typography;
interface ReminderCardProps {
    reminder: {
        _id: string;
        title: string;
        detail: string;
        timeReminder: string;
    };
    onDelete: (id: string) => void;
    onEdit?: (id: string) => void;
}
const getReminderStatus = (timeReminder: string) => {
    const now = dayjs();
    const reminderTime = dayjs(timeReminder);
    const diffHours = reminderTime.diff(now, 'hour');
    if (diffHours < 0) {
        return { status: 'overdue', color: '#ff4d4f', text: 'Quá hạn' };
    }
    else if (diffHours < 24) {
        return { status: 'urgent', color: '#fa8c16', text: 'Sắp đến hạn' };
    }
    else {
        return { status: 'upcoming', color: '#52c41a', text: 'Sắp tới' };
    }
};
export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onDelete, onEdit }) => {
    const reminderStatus = getReminderStatus(reminder.timeReminder);
    return (<Card size="small" className="reminder-card" style={{
            marginBottom: 12,
            borderRadius: 12,
            border: 'none',
            background: '#fafafa',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease',
            borderLeft: `4px solid ${reminderStatus.color}`,
        }} hoverable bodyStyle={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Space align="start" style={{ width: '100%' }}>
            <div style={{ marginTop: 2 }}>
              <BellOutlined style={{ color: reminderStatus.color }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong style={{ fontSize: 14, color: '#1f2937' }}>
                  {reminder.title}
                </Text>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Tag color={reminderStatus.color} style={{
            fontSize: 11,
            borderRadius: 6,
            margin: 0
        }}>
                  {reminderStatus.text}
                </Tag>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <ClockCircleOutlined style={{ fontSize: 12, color: '#6b7280', marginRight: 4 }}/>
                <Text style={{
            fontSize: 12,
            color: '#6b7280'
        }}>
                  {dayjs(reminder.timeReminder).format("DD/MM/YYYY HH:mm")}
                </Text>
              </div>

              {reminder.detail && (<Paragraph style={{
                margin: 0,
                fontSize: 13,
                color: '#374151',
                lineHeight: '1.5'
            }} ellipsis={{ rows: 2, expandable: true }}>
                  {reminder.detail}
                </Paragraph>)}
            </div>
          </Space>
        </div>

        <div style={{ marginLeft: 12, display: 'flex', gap: 8 }}>
          {onEdit && (<Tooltip title="Sửa nhắc nhở">
              <EditButton resource="reminders" recordItemId={reminder._id} size="small" hideText onClick={() => onEdit(reminder._id)} style={{
                opacity: 0.8,
                transition: 'opacity 0.2s ease'
            }}/>
            </Tooltip>)}
          <Tooltip title="Xóa nhắc nhở">
            <DeleteButton resource="reminders" recordItemId={reminder._id} size="small" hideText danger onSuccess={() => onDelete(reminder._id)} style={{
            opacity: 0.7,
            transition: 'opacity 0.2s ease'
        }}/>
          </Tooltip>
        </div>
      </div>
    </Card>);
};