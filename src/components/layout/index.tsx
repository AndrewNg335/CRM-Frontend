import React, { useState, useEffect } from 'react';
import { Layout as AntLayout } from 'antd';
import Header from './header';
import Sidebar from './sidebar';
const { Content } = AntLayout;
const Layout = ({ children }: React.PropsWithChildren) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        const handleToggleSidebar = () => {
            setSidebarCollapsed(!sidebarCollapsed);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        window.addEventListener('toggleSidebar', handleToggleSidebar);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('toggleSidebar', handleToggleSidebar);
        };
    }, [sidebarCollapsed]);
    return (<div className="refine-layout min-h-screen professional-bg relative">
      {isMobile && !sidebarCollapsed && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999,
          }}
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/3 rounded-full blur-3xl"></div>

      <AntLayout style={{ background: 'transparent' }}>
        
        <Sidebar onCollapseChange={setSidebarCollapsed} collapsed={sidebarCollapsed}/>
        
        
        <AntLayout className="main-layout" style={{
            marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '240px'),
            background: 'transparent',
            transition: 'margin-left 0.3s ease'
        }}>
          
          <Header />
          
          
          <Content style={{
            margin: '0',
            padding: '24px',
            background: 'transparent',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto'
        }}>
            <div className="relative z-10">
              {children}
            </div>
          </Content>
        </AntLayout>
      </AntLayout>
    </div>);
};
export default Layout;
