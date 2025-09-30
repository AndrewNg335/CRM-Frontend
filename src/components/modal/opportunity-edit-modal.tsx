import React from 'react';
import { Form, Input, Select, Row, Col, InputNumber, DatePicker } from 'antd';
import { FlagOutlined, UserOutlined, TagOutlined, DollarOutlined, AlignLeftOutlined, CalendarOutlined, LinkOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';
import { OpportunityStage } from '@/interfaces/opportunity';
import dayjs from 'dayjs';

interface OpportunityEditModalProps {
  modalProps: any;
  formProps: any;
  ownerSelectProps?: any;
  leadSelectProps?: any;
  campaignSelectProps?: any;
  isAdmin?: boolean;
}

export const OpportunityEditModal: React.FC<OpportunityEditModalProps> = ({
  modalProps,
  formProps,
  ownerSelectProps,
  leadSelectProps,
  campaignSelectProps,
  isAdmin = false,
}) => {
  return (
    <ProfessionalModal
      {...modalProps}
      title="Chỉnh sửa cơ hội"
      icon={<FlagOutlined className="text-green-600" />}
      width={800}
    >
      <Form {...formProps} layout="vertical" className="space-y-4">
        {/* Hidden field for ownerId */}
        <Form.Item name="ownerId" hidden>
          <Input />
        </Form.Item>
        
        <Row gutter={[24, 16]}>
          {isAdmin && (
            <Col xs={24} md={12}>
              <ProfessionalFormItem
                label="Người phụ trách"
                name="ownerId"
                icon={<UserOutlined className="text-teal-500" />}
              >
                <Select {...ownerSelectProps} placeholder="Chọn người phụ trách" allowClear />
              </ProfessionalFormItem>
            </Col>
          )}
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Tên cơ hội"
              name="name"
              icon={<FlagOutlined className="text-green-500" />}
              rules={[{ required: true, message: "Vui lòng nhập tên cơ hội" }]}
            >
              <Input placeholder="Nhập tên cơ hội" />
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Giai đoạn"
              name="opportunityStage"
              icon={<TagOutlined className="text-blue-500" />}
            >
              <Select
                placeholder="Chọn giai đoạn"
                options={Object.entries(OpportunityStage).map(([key, value]) => ({
                  label: value,
                  value: key,
                }))}
              />
            </ProfessionalFormItem>
          </Col>
        </Row>

        <ProfessionalFormItem
          label="Mô tả"
          name="description"
          icon={<AlignLeftOutlined className="text-purple-500" />}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Nhập mô tả chi tiết về cơ hội"
            showCount
            maxLength={500}
          />
        </ProfessionalFormItem>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Khách hàng"
              name="leadId"
              icon={<UserOutlined className="text-purple-500" />}
            >
              <Select {...leadSelectProps} placeholder="Chọn khách hàng" allowClear />
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Chiến dịch"
              name="campaignId"
              icon={<FlagOutlined className="text-orange-500" />}
            >
              <Select {...campaignSelectProps} placeholder="Chọn chiến dịch" allowClear />
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Xác suất (%)"
              name="probability"
              icon={<TagOutlined className="text-cyan-500" />}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                placeholder="Nhập xác suất"
              />
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Giá trị dự kiến"
              name="amount"
              icon={<DollarOutlined className="text-green-500" />}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập giá trị dự kiến"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
              />
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Nguồn khách hàng"
              name="leadSource"
              icon={<LinkOutlined className="text-indigo-500" />}
            >
              <Input placeholder="Nhập nguồn khách hàng" />
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Bước tiếp theo"
              name="nextStep"
              icon={<CalendarOutlined className="text-indigo-500" />}
            >
              <Input placeholder="Nhập bước tiếp theo" />
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Ngày đóng dự kiến"
              name="closeDate"
              icon={<CalendarOutlined className="text-purple-500" />}
              getValueProps={(value) => ({
                value: value ? dayjs(value) : null,
              })}
            >
              <DatePicker 
                style={{ width: "100%" }} 
                placeholder="Chọn ngày đóng dự kiến"
              />
            </ProfessionalFormItem>
          </Col>
        </Row>
      </Form>
    </ProfessionalModal>
  );
};
