import React from 'react';
import { Form, Input, Select, Row, Col, DatePicker } from 'antd';
import { BellOutlined, ClockCircleOutlined, AlignLeftOutlined, UserOutlined, ExclamationCircleOutlined, TagOutlined, CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';
import dayjs from 'dayjs';
interface ReminderEditModalProps {
    modalProps: any;
    formProps: any;
    leadSelectProps?: any;
    hideLeadField?: boolean;
}
export const ReminderEditModal: React.FC<ReminderEditModalProps> = ({ modalProps, formProps, leadSelectProps, hideLeadField = false }) => {
    return (<ProfessionalModal {...modalProps} okText="Lưu" cancelText="Hủy" title="Chỉnh sửa nhắc nhở" icon={<BellOutlined className="text-blue-600"/>} width={600} destroyOnClose onOk={() => {
            formProps.form?.submit();
        }} onCancel={() => {
            modalProps.onCancel?.();
        }}>
      <Form {...formProps} layout="vertical" className="space-y-4" onFinish={(values) => {
            if (formProps.onFinish) {
                formProps.onFinish(values);
            }
        }} onFinishFailed={(errorInfo) => {
        }}>
        
        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="leadId" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="ownerId" hidden>
          <Input />
        </Form.Item>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Tiêu đề" name="title" icon={<BellOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng nhập tiêu đề nhắc nhở" }]}>
              <Input placeholder="Nhập tiêu đề nhắc nhở"/>
            </ProfessionalFormItem>
          </Col>
          {!hideLeadField && (
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Khách hàng" name="leadId" icon={<UserOutlined className="text-cyan-500"/>} rules={[{ message: "Vui lòng chọn khách hàng" }]}>
                <Select 
                  {...leadSelectProps} 
                  placeholder="Tìm kiếm và chọn khách hàng"
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
              
                />
              </ProfessionalFormItem>
            </Col>
          )}
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Thời gian nhắc nhở" name="timeReminder" icon={<CalendarOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng chọn thời gian nhắc nhở" }]} getValueProps={(value) => ({
            value: value ? dayjs(value) : null,
        })}>
              <DatePicker style={{ width: "100%" }} placeholder="Chọn thời gian nhắc nhở" showTime/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Độ ưu tiên" name="priority" icon={<ExclamationCircleOutlined className="text-red-500"/>}>
              <Select placeholder="Chọn độ ưu tiên" options={[
            { label: "Thấp", value: "LOW" },
            { label: "Trung bình", value: "MEDIUM" },
            { label: "Cao", value: "HIGH" },
            { label: "Khẩn cấp", value: "URGENT" },
        ]}/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Trạng thái" name="reminderStatus" icon={<TagOutlined className="text-orange-500"/>}>
              <Select placeholder="Chọn trạng thái" options={[
            { label: "Chưa thực hiện", value: "PENDING" },
            { label: "Đã hoàn thành", value: "DONE" },
            { label: "Đã huỷ", value: "CANCELLED" },
        ]}/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Lặp lại" name="repeat" icon={<ReloadOutlined className="text-purple-500"/>}>
              <Select placeholder="Chọn tần suất lặp lại" options={[
            { label: "Không lặp lại", value: "NEVER" },
            { label: "Hàng ngày", value: "DAILY" },
            { label: "Hàng tuần", value: "WEEKLY" },
            { label: "Hàng tháng", value: "MONTHLY" },
        ]}/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <ProfessionalFormItem label="Nội dung nhắc nhở" name="detail" icon={<AlignLeftOutlined className="text-indigo-500"/>}>
          <Input.TextArea rows={4} placeholder="Nhập nội dung nhắc nhở" showCount maxLength={500}/>
        </ProfessionalFormItem>
      </Form>
    </ProfessionalModal>);
};