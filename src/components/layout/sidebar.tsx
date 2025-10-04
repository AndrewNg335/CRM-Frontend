import type { User } from '@/interfaces/user';
import { hasAdminAccess } from '@/utilities';
import { BellOutlined, CheckSquareOutlined, DashboardOutlined, FlagOutlined, FormOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, ShopOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useGetIdentity, useLogout, useNavigation } from '@refinedev/core';
import { Button, Image, Layout, Menu, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
const { Sider } = Layout;
interface SidebarProps {
    onCollapseChange?: (collapsed: boolean) => void;
    collapsed?: boolean;
}
const Sidebar = ({ onCollapseChange, collapsed: externalCollapsed }: SidebarProps) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
    const [isMobile, setIsMobile] = useState(false);
    const { mutate: logout } = useLogout();
    const { push } = useNavigation();
    const { data: currentUser } = useGetIdentity<User>();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const handleCollapse = (newCollapsed: boolean) => {
        if (externalCollapsed === undefined) {
            setInternalCollapsed(newCollapsed);
        }
        onCollapseChange?.(newCollapsed);
    };
    const sidebarStyles: React.CSSProperties = {
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        position: 'fixed',
        left: '0',
        top: 0,
        bottom: 0,
        zIndex: 1001,
        width: isMobile ? '240px' : (collapsed ? '80px' : '240px'),
        transform: isMobile ? (collapsed ? 'translateX(-100%) !important' : 'translateX(0) !important') : 'translateX(0) !important',
        transition: 'transform 0.3s ease, width 0.3s ease',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
    };


    const baseMenuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Tổng quan',
        },
        {
            key: '/leads',
            icon: <ShopOutlined />,
            label: 'Khách hàng tiềm năng',
        },
        {
            key: '/tasks',
            icon: <CheckSquareOutlined />,
            label: 'Công việc',
        },
        {
            key: '/opportunities',
            icon: <FlagOutlined />,
            label: 'Cơ hội',
        },
        {
            key: 'marketing',
            icon: <NotificationOutlined />,
            label: 'Marketing',
            children: [
                {
                    key: '/campaigns',
                    icon: <NotificationOutlined />,
                    label: 'Chiến dịch',
                },
                {
                    key: '/optin-forms',
                    icon: <FormOutlined />,
                    label: 'Biểu mẫu Opt-in',
                },
            ],
        },
        {
            key: '/reminders',
            icon: <BellOutlined />,
            label: 'Nhắc nhở',
        },
    ];
    const adminMenuItems = [
        {
            key: 'users',
            icon: <UserOutlined />,
            label: 'Người dùng',
            children: [
                {
                    key: '/users',
                    icon: <UserOutlined />,
                    label: 'Người dùng',
                },
                {
                    key: '/roles',
                    icon: <TeamOutlined />,
                    label: 'Vai trò',
                },
            ],
        },
    ];
    const menuItems = hasAdminAccess(currentUser)
        ? [...baseMenuItems, ...adminMenuItems]
        : baseMenuItems;
    const handleMenuClick = ({ key }: {
        key: string;
    }) => {
        if (key === 'logout') {
            logout();
        }
        else if (key.startsWith('/')) {
            push(key);
            if (isMobile) {
                onCollapseChange?.(true);
            }
        }
    };
    return (<Sider 
      width={isMobile ? 240 : (collapsed ? 80 : 240)} 
      style={sidebarStyles} 
      className={`professional-sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      
      <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : '12px',
            padding: collapsed ? '16px 8px' : '16px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.8)',
            position: 'relative',
        }}>
        <Image src="/favicon.ico" alt="Logo" width={collapsed ? 24 : 32} height={collapsed ? 24 : 32} preview={false} style={{ borderRadius: '6px' }}/>
        {!collapsed && (<span style={{ color: '#1e293b', fontWeight: 700, fontSize: '16px' }}>
            CRM
          </span>)}
      </div>

      
      <Menu mode="inline" defaultSelectedKeys={[window.location.pathname]} defaultOpenKeys={collapsed ? [] : hasAdminAccess(currentUser) ? ['marketing', 'users'] : ['marketing']} items={menuItems} onClick={handleMenuClick} inlineCollapsed={collapsed} style={{
            background: 'transparent',
            border: 'none',
            marginTop: '8px',
        }} className="professional-sidebar-menu"/>

      
      <div className="bottom-section" style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: collapsed ? 'center' : 'stretch'
        }}>
        
        <Menu mode="inline" inlineCollapsed={collapsed} items={[
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Đăng xuất',
            },
        ]} onClick={handleMenuClick} style={{
            background: 'transparent',
            border: 'none',
            flex: 'none',
        }}/>

        
        <Tooltip title={collapsed ? "Mở rộng menu" : "Thu gọn menu"} placement="right">
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => handleCollapse(!collapsed)} style={{
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
        }}/>
        </Tooltip>
      </div>
    </Sider>);
};
export default Sidebar;
