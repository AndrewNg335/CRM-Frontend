import React from 'react';
import { Form, Input, Select, Row, Col, DatePicker } from 'antd';
import { BellOutlined, ClockCircleOutlined, AlignLeftOutlined, UserOutlined, ExclamationCircleOutlined, TagOutlined, CalendarOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';

interface ReminderCreateModalProps {
  modalProps: any;
  formProps: any;
  leadSelectProps?: any;
  ownerSelectProps?: any;
  initialValues?: any;
  hideLeadSelect?: boolean;
  isAdmin?: boolean;
}

export const ReminderCreateModal: React.FC<ReminderCreateModalProps> = ({
  modalProps,
  formProps,
  leadSelectProps,
  ownerSelectProps,
  initialValues,
  hideLeadSelect = false,
  isAdmin = false,
}) => {
  // Ensure required fields are always set when modal opens
  React.useEffect(() => {
    if (modalProps?.open && formProps?.form) {
      // Get current values from form
      const currentUserId = formProps.form.getFieldValue('userId');
      const currentOwnerId = formProps.form.getFieldValue('ownerId');
      
      if (!currentUserId && !isAdmin) {
        console.warn('userId not set in reminder create form');
      }
      if (!currentOwnerId && !isAdmin) {
        console.warn('ownerId not set in reminder create form');
      }
    }
  }, [modalProps?.open, formProps?.form, isAdmin]);

  // Set initial values when modal opens
  React.useEffect(() => {
    if (modalProps?.open && formProps?.form && initialValues) {
      // Set initial values if they exist
      formProps.form.setFieldsValue(initialValues);
    }
  }, [modalProps?.open, formProps?.form, initialValues]);

  return (
    <ProfessionalModal
      {...modalProps}
      title="Thêm nhắc nhở"
      icon={<BellOutlined className="text-blue-600" />}
      width={600}
      destroyOnClose
    >
      <Form {...formProps} layout="vertical" className="space-y-4" initialValues={initialValues}>
        {/* Hidden field for userId */}
        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>

        {/* Hidden field for leadId */}
        <Form.Item name="leadId" hidden>
          <Input />
        </Form.Item>

        {/* Hidden field for ownerId */}
        <Form.Item name="ownerId" hidden>
          <Input />
        </Form.Item>

        {/* Owner selector - only visible for Admin */}
        {isAdmin && (
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem
                label="Người phụ trách"
                name="ownerId"
                icon={<UserOutlined className="text-teal-500" />}
              >
                <Select {...ownerSelectProps} placeholder="Chọn người phụ trách" allowClear />
              </ProfessionalFormItem>
            </Col>
          </Row>
        )}

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Tiêu đề"
              name="title"
              icon={<BellOutlined className="text-blue-500" />}
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề nhắc nhở" }]}
            >
              <Input placeholder="Nhập tiêu đề nhắc nhở" />
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Độ ưu tiên"
              name="priority"
              icon={<ExclamationCircleOutlined className="text-yellow-500" />}
            >
              <Select
                placeholder="Chọn độ ưu tiên"
                options={[
                  { label: "Thấp", value: "LOW" },
                  { label: "Trung bình", value: "MEDIUM" },
                  { label: "Cao", value: "HIGH" },
                ]}
              />
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Thời gian nhắc"
              name="timeReminder"
              icon={<ClockCircleOutlined className="text-blue-500" />}
              rules={[{ required: true, message: "Vui lòng chọn thời gian nhắc" }]}
            >
              <DatePicker 
                showTime 
                format="DD/MM/YYYY HH:mm" 
                style={{ width: "100%" }} 
                placeholder="Chọn thời gian nhắc"
              />
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Trạng thái"
              name="reminderStatus"
              icon={<TagOutlined className="text-green-500" />}
            >
              <Select
                placeholder="Chọn trạng thái"
                options={[
                  { label: "Chờ xử lý", value: "PENDING" },
                  { label: "Hoàn thành", value: "DONE" },
                  { label: "Đã hủy", value: "CANCELLED" },
                ]}
              />
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Lặp lại"
              name="repeat"
              icon={<CalendarOutlined className="text-purple-500" />}
            >
              <Select
                placeholder="Chọn tần suất lặp lại"
                options={[
                  { label: "Không lặp lại", value: "NEVER" },
                  { label: "Hàng ngày", value: "DAILY" },
                  { label: "Hàng tuần", value: "WEEKLY" },
                  { label: "Hàng tháng", value: "MONTHLY" },
                ]}
              />
            </ProfessionalFormItem>
          </Col>
          {!hideLeadSelect && (
            <Col xs={24} md={12}>
              <ProfessionalFormItem
                label="Khách hàng"
                name="leadId"
                icon={<UserOutlined className="text-cyan-500" />}
              >
                <Select {...leadSelectProps} placeholder="Chọn khách hàng" />
              </ProfessionalFormItem>
            </Col>
          )}
        </Row>
        
        <ProfessionalFormItem
          label="Chi tiết"
          name="detail"
          icon={<AlignLeftOutlined className="text-indigo-500" />}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Nhập chi tiết nhắc nhở"
            showCount
            maxLength={500}
          />
        </ProfessionalFormItem>
      </Form>
    </ProfessionalModal>
  );
};
