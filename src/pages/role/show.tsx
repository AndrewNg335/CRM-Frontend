import { PERMISSION_CATEGORIES, PERMISSION_DESCRIPTIONS } from '@/interfaces/role';
import { CrownOutlined, SettingOutlined } from '@ant-design/icons';
import { useShow } from '@refinedev/core';
import { Badge, Card, Divider, Tag, Typography } from 'antd';
const { Title, Text } = Typography;
export const RoleShow = () => {
    const { queryResult } = useShow<any>();
    const { data, isLoading } = queryResult;
    const record = (data as any)?.data?.role;
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (!record) {
        return <div>Role not found</div>;
    }
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
                return <CrownOutlined className="mr-1"/>;
            case 'Manager':
                return <SettingOutlined className="mr-1"/>;
            case 'Employee':
                return <SettingOutlined className="mr-1"/>;
            default:
                return <SettingOutlined className="mr-1"/>;
        }
    };
    const groupedPermissions = Object.entries(PERMISSION_CATEGORIES).map(([key, category]) => {
        const rolePermissions = record.permissions || [];
        const categoryPermissions = category.permissions.filter(permission => rolePermissions.includes(permission));
        return {
            category: category.name,
            permissions: categoryPermissions
        };
    }).filter(group => group.permissions.length > 0);
    return (<div className="page-container">
      <Card className="shadow-lg border-0 rounded-lg">
        
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              {getRoleIcon(record.name)}
            </div>
            <div>
              <Title level={2} className="!mb-2 !text-gray-800">
                {record.name}
              </Title>
              <Text type="secondary" className="text-base">
                Chi tiết vai trò và quyền hạn
              </Text>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Tag color={getRoleColor(record.name)} className="px-4 py-2 rounded-full text-base font-medium">
              {getRoleIcon(record.name)} {record.name}
            </Tag>
            <Badge count={record.permissions?.length || 0} style={{ backgroundColor: '#3b82f6' }} showZero>
              <Text className="text-gray-600">Quyền hạn</Text>
            </Badge>
          </div>
        </div>

        <Divider />
      
        <div>
          <Title level={4} className="!mb-4 !text-gray-800">
            Quyền hạn ({record.permissions?.length || 0})
          </Title>
          
          {groupedPermissions.length > 0 ? (<div className="space-y-4">
              {groupedPermissions.map((group, index) => (<Card key={index} size="small" className="border border-gray-200">
                  <div className="mb-3">
                    <Text strong className="text-gray-800 text-base">
                      {group.category}
                    </Text>
                    <Badge count={group.permissions.length} style={{ backgroundColor: '#10b981', marginLeft: 8 }} showZero/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.permissions.map((permission) => (<div key={permission} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <Text strong className="text-green-800 text-sm">
                            {permission}
                          </Text>
                        </div>
                        <Text className="text-green-600 text-xs mt-1 block">
                          {PERMISSION_DESCRIPTIONS[permission]}
                        </Text>
                      </div>))}
                  </div>
                </Card>))}
            </div>) : (<div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SettingOutlined className="text-gray-400 text-2xl"/>
              </div>
              <Text type="secondary" className="text-base">
                Vai trò này chưa có quyền hạn nào được cấp
              </Text>
            </div>)}
        </div>
      </Card>
    </div>);
};