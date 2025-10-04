import React, { useState } from 'react';
import { Badge, Button, Dropdown } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNotification } from '../../providers/notification';
import { NotificationList } from './notification-list.js';

export const NotificationBell: React.FC = () => {
  const { unreadCount, loadNotificationsOnDemand } = useNotification();
  const [open, setOpen] = useState(false);

  const handleOpenChange = async (flag: boolean) => {
    setOpen(flag);
    if (flag) {
      await loadNotificationsOnDemand();
    }
  };

  const dropdownRender = () => (
    <div className="notification-dropdown">
      <NotificationList onClose={() => setOpen(false)} />
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={handleOpenChange}
      dropdownRender={dropdownRender}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="notification-dropdown-overlay"
      overlayStyle={{
        width: 400,
        maxHeight: 600,
      }}
    >
      <Button
        type="text"
        icon={
          <Badge count={unreadCount} size="small" offset={[0, 0]}>
            <BellOutlined style={{ fontSize: '18px' }} />
          </Badge>
        }
        className="notification-bell-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40px',
          width: '40px',
        }}
      />
    </Dropdown>
  );
};
