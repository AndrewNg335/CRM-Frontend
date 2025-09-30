import React, { useState } from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';
import { useMenu, useNavigation, useLogout, useGetIdentity } from '@refinedev/core';
import {
  ApartmentOutlined,
  BellOutlined,
  CheckSquareOutlined,
  DashboardOutlined,
  FlagOutlined,
  FormOutlined,
  IdcardOutlined,
  LogoutOutlined,
  NotificationOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Image } from 'antd';
import type { User } from '@/interfaces/user';

const { Sider } = Layout;

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

const Sidebar = ({ onCollapseChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { mutate: logout } = useLogout();
  const { push } = useNavigation();
  const { data: currentUser } = useGetIdentity<User>();

  const handleCollapse = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
  };

  const sidebarStyles: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    overflow: 'hidden',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    width: collapsed ? 80 : 240,
    transition: 'width 0.3s ease',
  };

  // Base menu items
  const baseMenuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/leads',
      icon: <ShopOutlined />,
      label: 'Leads',
    },
    {
      key: '/tasks',
      icon: <CheckSquareOutlined />,
      label: 'Tasks',
    },
    {
      key: '/opportunities',
      icon: <FlagOutlined />,
      label: 'Opportunities',
    },
    {
      key: 'marketing',
      icon: <NotificationOutlined />,
      label: 'Marketing',
      children: [
        {
          key: '/campaigns',
          icon: <NotificationOutlined />,
          label: 'Campaigns',
        },
        {
          key: '/optin-forms',
          icon: <FormOutlined />,
          label: 'Opt-in Forms',
        },
      ],
    },
    {
      key: '/reminders',
      icon: <BellOutlined />,
      label: 'Reminders',
    },
  ];

  // Admin-only menu items
  const adminMenuItems = [
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      children: [
        {
          key: '/users',
          icon: <UserOutlined />,
          label: 'Users',
        },
        {
          key: '/roles',
          icon: <TeamOutlined />,
          label: 'Roles',
        },
      ],
    },
  ];

  // Combine menu items based on user role
  const menuItems = currentUser?.role?.name === 'Admin' 
    ? [...baseMenuItems, ...adminMenuItems]
    : baseMenuItems;

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
    } else if (key.startsWith('/')) {
      push(key);
    }
  };

  return (
    <Sider
      width={collapsed ? 80 : 240}
      style={sidebarStyles}
      className={`professional-sidebar ${collapsed ? 'collapsed' : ''}`}
    >
      {/* Logo Section */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : '12px', 
          padding: collapsed ? '16px 8px' : '16px', 
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.8)',
          position: 'relative',
        }}
      >
        <Image
          src="/favicon.ico"
          alt="Logo"
          width={collapsed ? 24 : 32}
          height={collapsed ? 24 : 32}
          preview={false}
          style={{ borderRadius: '6px' }}
        />
        {!collapsed && (
          <span style={{ color: '#1e293b', fontWeight: 700, fontSize: '16px' }}>
            CRM
          </span>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        defaultSelectedKeys={[window.location.pathname]}
        defaultOpenKeys={collapsed ? [] : currentUser?.role?.name === 'Admin' ? ['marketing', 'users'] : ['marketing']}
        items={menuItems}
        onClick={handleMenuClick}
        inlineCollapsed={collapsed}
        style={{
          background: 'transparent',
          border: 'none',
          marginTop: '8px',
        }}
        className="professional-sidebar-menu"
      />

      {/* Bottom Section - Logout and Collapse Button */}
      <div 
        className="bottom-section"
        style={{ 
          position: 'absolute', 
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: collapsed ? 'center' : 'stretch'
        }}
      >
        {/* Logout Button */}
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          items={[
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
            },
          ]}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            border: 'none',
            flex: 'none',
          }}
        />

        {/* Collapse Button */}
        <Tooltip title={collapsed ? "Mở rộng menu" : "Thu gọn menu"} placement="right">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => handleCollapse(!collapsed)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '16px',
              width: collapsed ? '40px' : '100%',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          />
        </Tooltip>
      </div>
    </Sider>
  );
};

export default Sidebar;
