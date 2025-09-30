import React, { useState } from 'react'
import { Layout as AntLayout } from 'antd'
import Header from './header'
import Sidebar from './sidebar'

const { Content } = AntLayout;

const Layout = ({children}: React.PropsWithChildren) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="refine-layout min-h-screen professional-bg relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/3 rounded-full blur-3xl"></div>

      <AntLayout style={{ background: 'transparent' }}>
        {/* Fixed Sidebar */}
        <Sidebar onCollapseChange={setSidebarCollapsed} />
        
        <AntLayout 
          className="main-layout"
          style={{ 
            marginLeft: sidebarCollapsed ? '80px' : '240px', 
            background: 'transparent',
            transition: 'margin-left 0.3s ease'
          }}
        >
          {/* Header */}
          <Header />
          
          {/* Main Content */}
          <Content 
            style={{ 
              margin: '0',
              padding: '24px',
              background: 'transparent',
              minHeight: 'calc(100vh - 64px)',
              overflow: 'auto'
            }}
          >
            <div className="relative z-10">
              {children}
            </div>
          </Content>
        </AntLayout>
      </AntLayout>
    </div>
  )
}

export default Layout