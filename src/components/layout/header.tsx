import CurrentUser from "./current-user";
import React, { useState, useEffect } from "react";
import { Layout, Space, theme, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { NotificationBell } from "../notifications";
const { useToken } = theme;
export const Header = () => {
    const { token } = useToken();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        const event = new CustomEvent('toggleSidebar');
        window.dispatchEvent(event);
    };
    const headerStyles: React.CSSProperties = {
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0px 24px",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 999,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    };
    return (<Layout.Header style={headerStyles} className="professional-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isMobile && (
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            onClick={toggleSidebar}
            style={{ 
              fontSize: '18px',
              color: '#64748b',
              border: 'none',
              background: 'transparent'
            }}
          />
        )}
        <div className="professional-title-text">
          <span className="text-slate-800 text-lg font-bold">
          CRM system
          </span>
        </div>
      </div>
      
      
      <Space align="center" size="middle">
        <NotificationBell />
        <CurrentUser />
      </Space>
    </Layout.Header>);
};
export default Header;
