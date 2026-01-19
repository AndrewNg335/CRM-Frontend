import React from 'react';
import { Button, Dropdown, Empty, List, Spin, Typography, Divider, Space, Tooltip } from 'antd';
import { EllipsisOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNotification } from '../../providers/notification';
import { Notification } from '../../interfaces/notification';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

interface NotificationListProps {
  onClose: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const {
    notifications,
    loading,
    filter,
    setFilter,
    markAsRead,
    deleteNotification,
    refreshNotifications,
  } = useNotification();
  
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const getActionMenuItems = (notification: Notification) => [
    {
      key: 'mark-read',
      label: (
        <Space>
          <EyeOutlined />
          Đánh dấu đã đọc
        </Space>
      ),
      onClick: (e: any) => handleMarkAsRead(e.domEvent, notification._id),
      disabled: notification.isRead,
    },
    {
      key: 'delete',
      label: (
        <Space>
          <DeleteOutlined />
          Xóa thông báo
        </Space>
      ),
      onClick: (e: any) => handleDelete(e.domEvent, notification._id),
      danger: true,
    },
  ];

  const renderNotificationItem = (notification: Notification) => (
    <List.Item
      key={notification._id}
      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
      style={{
        padding: '12px 16px',
        cursor: notification.link ? 'pointer' : 'default',
        backgroundColor: !notification.isRead ? '#f6ffed' : 'transparent',
        borderLeft: !notification.isRead ? '3px solid #52c41a' : 'none',
      }}
      onClick={() => handleNotificationClick(notification)}
      actions={[
        <Dropdown
          menu={{ items: getActionMenuItems(notification) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<EllipsisOutlined />}
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ]}
    >
      <List.Item.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text strong={!notification.isRead} style={{ fontSize: '14px' }}>
              {notification.title}
            </Text>
            {!notification.isRead && (
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#52c41a',
                  marginLeft: '8px',
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        }
        description={
          <div>
            <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>
              {notification.message}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {dayjs(notification.createdAt).fromNow()}
            </Text>
          </div>
        }
      />
    </List.Item>
  );

  return (
    <div className="notification-list-container" style={{ width: '100%', maxHeight: '500px' }}>
      <div style={{ padding: '16px 16px 8px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Title level={5} style={{ margin: 0 }}>
            Thông báo
          </Title>
          <Button
            type="link"
            size="small"
            onClick={refreshNotifications}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>
        
        <Space>
          <Button
            type={filter === 'all' ? 'primary' : 'default'}
            size="small"
            onClick={() => setFilter('all')}
          >
            Tất cả
          </Button>
          <Button
            type={filter === 'unread' ? 'primary' : 'default'}
            size="small"
            onClick={() => setFilter('unread')}
          >
            Chưa đọc
          </Button>
        </Space>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '40px' }}>
            <Empty
              description={
                filter === 'unread' 
                  ? 'Không có thông báo chưa đọc' 
                  : 'Không có thông báo nào'
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <List
            dataSource={notifications}
            renderItem={renderNotificationItem}
            split={false}
            style={{ padding: 0 }}
          />
        )}
      </div>
    </div>
  );
};