import { Button, Popover } from 'antd';
import { useGetIdentity } from '@refinedev/core';
import type { User } from '@/interfaces/user';
import { Text } from '../text';
import { useState, useEffect } from 'react';
import { SettingOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { AccountSettings } from './account-settings';
const CurrentUser = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: user, refetch } = useGetIdentity<User>();
    useEffect(() => {
        const handleUserProfileUpdate = () => {
            refetch();
        };
        window.addEventListener('userProfileUpdated', handleUserProfileUpdate);
        return () => {
            window.removeEventListener('userProfileUpdated', handleUserProfileUpdate);
        };
    }, [refetch]);
    const content = (<div className="professional-card p-0 relative overflow-hidden">
      <div className="relative z-10">
        <div className="px-4 py-3 border-b border-slate-200">
          <Text strong style={{
            padding: '8px 0',
            color: '#1e293b',
            fontSize: '14px',
            fontWeight: '600'
        }}>
            {user?.name}  
          </Text>
        </div>
        <div className="p-2">
          <Button className="professional-menu-button w-full mb-2" icon={<SettingOutlined />} type="text" block onClick={() => {
            setIsOpen(true);
        }}>
            <span className="text-slate-700 text-sm">Cài đặt tài khoản</span>
          </Button>
          <Button className="professional-menu-button w-full" icon={<LogoutOutlined />} type="text" block>
            <span className="text-slate-700 text-sm">Đăng xuất</span>
          </Button>
        </div>
      </div>
    </div>);
    return (<>
        <Popover placement='bottomRight' trigger="click" styles={{
            body: { padding: 0, background: 'transparent' },
            root: { zIndex: 999 }
        }} content={content} overlayClassName="professional-popover">
          <div className="professional-avatar-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <span style={{
            width: 24,
            height: 24,
            background: "#E6F4FF",
            borderRadius: 6,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
              <UserOutlined style={{ color: "#1677ff", fontSize: 14 }}/>
            </span>
            <Text style={{
            color: '#1e293b',
            fontSize: '14px',
            fontWeight: '500',
            margin: 0
        }}>
              {user?.name || 'User'}
            </Text>
          </div>
        </Popover>
        <AccountSettings opened={isOpen} setOpened={setIsOpen} userId={user?._id || user?.id || ''}/>
    </>);
};
export default CurrentUser;