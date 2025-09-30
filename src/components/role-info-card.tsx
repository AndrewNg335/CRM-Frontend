import React from 'react';
import { Card, Typography, Tag, Space, Tooltip, Badge } from 'antd';
import { CrownOutlined, SettingOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { Role } from '@/interfaces/role';
import { PermissionDisplay } from '@/components/permissions';

const { Text } = Typography;

interface RoleInfoCardProps {
  role: Role;
  compact?: boolean;
}

export const RoleInfoCard: React.FC<RoleInfoCardProps> = ({ role, compact = false }) => {
  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Admin': return 'red';
      case 'Manager': return 'blue';
      case 'Employee': return 'green';
      default: return 'default';
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'Admin':
        return <CrownOutlined className="mr-1" />;
      case 'Manager':
        return <SettingOutlined className="mr-1" />;
      case 'Employee':
        return <TeamOutlined className="mr-1" />;
      default:
        return <UserOutlined className="mr-1" />;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Tag 
          color={getRoleColor(role.name)} 
          className="px-2 py-1 rounded-full font-medium text-xs"
        >
          {getRoleIcon(role.name)} {role.name}
        </Tag>
        <Badge 
          count={role.permissions?.length || 0} 
          style={{ backgroundColor: '#3b82f6' }}
          showZero
        />
      </div>
    );
  }

  return (
    <Card size="small" className="border border-gray-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getRoleIcon(role.name)}
            <Text strong className="text-gray-800">
              {role.name}
            </Text>
          </div>
          <Badge 
            count={role.permissions?.length || 0} 
            style={{ backgroundColor: '#3b82f6' }}
            showZero
          />
        </div>
        
        
        {role.permissions && role.permissions.length > 0 && (
          <div>
            <Text type="secondary" className="text-xs mb-2 block">
              Quyền hạn:
            </Text>
            <PermissionDisplay 
              permissions={role.permissions} 
              maxDisplay={5}
              showCategories={false}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
