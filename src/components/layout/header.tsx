import CurrentUser from "./current-user"

import React from "react";

import { Layout, Space, theme } from "antd";


const { useToken } = theme;

export const Header = () => {
  const { token } = useToken();

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

  return (
    <Layout.Header style={headerStyles} className="professional-header">
      <div className="professional-title-text">
        <span className="text-slate-800 text-lg font-bold">
        Vietnam Multimedia Services
        </span>
      </div>
      
      {/* User section */}
      <Space align="center" size="middle">
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};


export default Header