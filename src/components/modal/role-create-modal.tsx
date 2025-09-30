import React from 'react';
import { Form, Input, Checkbox, Row, Col, Divider, Typography } from 'antd';
import { CrownOutlined, SettingOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';
import { PERMISSION_CATEGORIES, PERMISSION_DESCRIPTIONS } from '@/interfaces/role';

const { Title } = Typography;

interface RoleCreateModalProps {
  modalProps: any;
  formProps: any;
}

export const RoleCreateModal: React.FC<RoleCreateModalProps> = ({
  modalProps,
  formProps,
}) => {
  return (
    <ProfessionalModal
      {...modalProps}
      title="Thêm vai trò mới"
      icon={<CrownOutlined className="text-blue-600" />}
      width={800}
    >
      <Form {...formProps} layout="vertical" className="space-y-4">
        <ProfessionalFormItem
          label="Tên vai trò"
          name="name"
          icon={<CrownOutlined className="text-blue-500" />}
          rules={[{ required: true, message: "Vui lòng nhập tên vai trò" }]}
        >
          <Input placeholder="Nhập tên vai trò" />
        </ProfessionalFormItem>

        <ProfessionalFormItem
          label="Mô tả"
          name="description"
          icon={<SettingOutlined className="text-green-500" />}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Nhập mô tả vai trò"
            showCount
            maxLength={200}
          />
        </ProfessionalFormItem>

        <Divider />

        <Title level={4} className="text-gray-700 mb-4">
          <SettingOutlined className="mr-2" />
          Phân quyền
        </Title>

        {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, categoryData]) => (
          <div key={categoryKey} className="mb-6">
            <Title level={5} className="text-gray-600 mb-3">
              {categoryData.name}
            </Title>
            <Row gutter={[16, 8]}>
              {categoryData.permissions.map((permission: string) => (
                <Col xs={24} sm={12} md={8} key={permission}>
                  <Form.Item
                    name={['permissions', permission]}
                    valuePropName="checked"
                    className="mb-2"
                  >
                    <Checkbox className="text-sm">
                      <span className="font-medium">{permission}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {PERMISSION_DESCRIPTIONS[permission]}
                      </div>
                    </Checkbox>
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Form>
    </ProfessionalModal>
  );
};
