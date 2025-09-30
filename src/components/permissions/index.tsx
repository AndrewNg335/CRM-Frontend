import React from 'react';
import { Card, Checkbox, Typography, Space, Tag, Tooltip } from 'antd';
import { SettingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PERMISSION_CATEGORIES, PERMISSION_DESCRIPTIONS } from '@/interfaces/role';

const { Text } = Typography;

interface PermissionSelectorProps {
  value?: string[];
  onChange?: (permissions: string[]) => void;
  disabled?: boolean;
  showDescriptions?: boolean;
  compact?: boolean;
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  value = [],
  onChange,
  disabled = false,
  showDescriptions = true,
  compact = false
}) => {
  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (!onChange) return;
    
    if (checked) {
      onChange([...value, permission]);
    } else {
      onChange(value.filter(p => p !== permission));
    }
  };

  const handleCategoryChange = (categoryPermissions: readonly string[], checked: boolean) => {
    if (!onChange) return;
    
    if (checked) {
      // Add all permissions from category that are not already selected
      const newPermissions = categoryPermissions.filter(p => !value.includes(p));
      onChange([...value, ...newPermissions]);
    } else {
      // Remove all permissions from category
      onChange(value.filter(p => !categoryPermissions.includes(p)));
    }
  };

  const isCategorySelected = (categoryPermissions: readonly string[]) => {
    return categoryPermissions.every(p => value.includes(p));
  };

  const isCategoryIndeterminate = (categoryPermissions: readonly string[]) => {
    const selectedCount = categoryPermissions.filter(p => value.includes(p)).length;
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {Object.entries(PERMISSION_CATEGORIES).map(([key, category]) => (
          <Card key={key} size="small" className="border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <SettingOutlined className="text-blue-500" />
                <Text strong className="text-gray-800 text-sm">
                  {category.name}
                </Text>
                <Tag color="blue" className="text-xs">
                  {category.permissions.length}
                </Tag>
              </div>
              <Checkbox
                checked={isCategorySelected(category.permissions)}
                indeterminate={isCategoryIndeterminate(category.permissions)}
                onChange={(e) => handleCategoryChange(category.permissions, e.target.checked)}
                disabled={disabled}
              >
                Tất cả
              </Checkbox>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {category.permissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    checked={value.includes(permission)}
                    onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                    disabled={disabled}
                    className="text-xs"
                  >
                    <Text className="text-xs">{permission}</Text>
                  </Checkbox>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(PERMISSION_CATEGORIES).map(([key, category]) => (
        <Card key={key} size="small" className="border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <SettingOutlined className="text-blue-500" />
              <Text strong className="text-gray-800">
                {category.name}
              </Text>
              <Tag color="blue">
                {category.permissions.length} quyền
              </Tag>
            </div>
            <Checkbox
              checked={isCategorySelected(category.permissions)}
              indeterminate={isCategoryIndeterminate(category.permissions)}
              onChange={(e) => handleCategoryChange(category.permissions, e.target.checked)}
              disabled={disabled}
            >
              Chọn tất cả
            </Checkbox>
          </div>
          <div className="space-y-2">
            {category.permissions.map((permission) => (
              <div key={permission}>
                <Checkbox
                  checked={value.includes(permission)}
                  onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                  disabled={disabled}
                  className="w-full"
                >
                  <div className="flex flex-col">
                    <Text className="text-sm font-medium">
                      {permission}
                    </Text>
                    {showDescriptions && (
                      <Text className="text-xs text-gray-500">
                        {PERMISSION_DESCRIPTIONS[permission]}
                      </Text>
                    )}
                  </div>
                </Checkbox>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

interface PermissionDisplayProps {
  permissions: string[];
  showCategories?: boolean;
  maxDisplay?: number;
}

export const PermissionDisplay: React.FC<PermissionDisplayProps> = ({
  permissions = [],
  showCategories = true,
  maxDisplay = 5
}) => {
  if (permissions.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <CloseCircleOutlined />
        <Text type="secondary">Không có quyền</Text>
      </div>
    );
  }

  const groupedPermissions = Object.entries(PERMISSION_CATEGORIES).map(([key, category]) => {
    const categoryPermissions = category.permissions.filter(permission => 
      permissions.includes(permission)
    );
    
    return {
      category: category.name,
      permissions: categoryPermissions
    };
  }).filter(group => group.permissions.length > 0);

  if (showCategories) {
    return (
      <div className="space-y-2">
        {groupedPermissions.map((group, index) => (
          <div key={index} className="p-2 bg-blue-50 rounded border border-blue-200">
            <div className="flex items-center space-x-2 mb-1">
              <SettingOutlined className="text-blue-500 text-xs" />
              <Text strong className="text-blue-800 text-xs">
                {group.category}
              </Text>
              <Tag color="blue" className="text-xs">
                {group.permissions.length}
              </Tag>
            </div>
            <div className="flex flex-wrap gap-1">
              {group.permissions.slice(0, maxDisplay).map((permission) => (
                <Tooltip key={permission} title={PERMISSION_DESCRIPTIONS[permission]}>
                  <Tag color="green" className="text-xs">
                    {permission}
                  </Tag>
                </Tooltip>
              ))}
              {group.permissions.length > maxDisplay && (
                <Tag color="default" className="text-xs">
                  +{group.permissions.length - maxDisplay} khác
                </Tag>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {permissions.slice(0, maxDisplay).map((permission) => (
        <Tooltip key={permission} title={PERMISSION_DESCRIPTIONS[permission]}>
          <Tag color="green" className="text-xs">
            {permission}
          </Tag>
        </Tooltip>
      ))}
      {permissions.length > maxDisplay && (
        <Tag color="default" className="text-xs">
          +{permissions.length - maxDisplay} khác
        </Tag>
      )}
    </div>
  );
};

interface PermissionSummaryProps {
  permissions: string[];
}

export const PermissionSummary: React.FC<PermissionSummaryProps> = ({
  permissions = []
}) => {
  const groupedPermissions = Object.entries(PERMISSION_CATEGORIES).map(([key, category]) => {
    const categoryPermissions = category.permissions.filter(permission => 
      permissions.includes(permission)
    );
    
    return {
      category: category.name,
      permissions: categoryPermissions,
      total: category.permissions.length
    };
  });

  const totalPermissions = permissions.length;
  const totalAvailable = Object.values(PERMISSION_CATEGORIES).reduce(
    (sum, category) => sum + category.permissions.length, 
    0
  );

  return (
    <Card size="small" className="border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <CheckCircleOutlined className="text-green-500" />
          <Text strong className="text-gray-800">
            Tổng quan quyền hạn
          </Text>
        </div>
        <Tag color="blue">
          {totalPermissions}/{totalAvailable}
        </Tag>
      </div>
      
      <div className="space-y-2">
        {groupedPermissions.map((group, index) => (
          <div key={index} className="flex items-center justify-between">
            <Text className="text-sm text-gray-700">
              {group.category}
            </Text>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(group.permissions.length / group.total) * 100}%` }}
                />
              </div>
              <Text className="text-xs text-gray-500">
                {group.permissions.length}/{group.total}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
