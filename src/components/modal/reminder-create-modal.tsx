import React from 'react';
import { Form, Input, Select, Row, Col, DatePicker } from 'antd';
import { BellOutlined, ClockCircleOutlined, AlignLeftOutlined, UserOutlined, ExclamationCircleOutlined, TagOutlined, CalendarOutlined } from '@ant-design/icons';
import { ProfessionalModal, ProfessionalFormItem } from './index';
interface ReminderCreateModalProps {
    modalProps: any;
    formProps: any;
    leadSelectProps?: any;
    initialValues?: any;
    hideLeadSelect?: boolean;
}
export const ReminderCreateModal: React.FC<ReminderCreateModalProps> = ({ modalProps, formProps, leadSelectProps, initialValues, hideLeadSelect = false }) => {
    React.useEffect(() => {
        if (modalProps?.open && formProps?.form) {
            const currentUserId = formProps.form.getFieldValue('userId');
            const currentOwnerId = formProps.form.getFieldValue('ownerId');
            if (!currentUserId) {
                
            }
            if (!currentOwnerId) {
                
            }
        }
    }, [modalProps?.open, formProps?.form]);
    React.useEffect(() => {
        if (modalProps?.open && formProps?.form && initialValues) {
            formProps.form.setFieldsValue(initialValues);
        }
    }, [modalProps?.open, formProps?.form, initialValues]);
    return (<ProfessionalModal {...modalProps} okText="Lưu" cancelText="Hủy" title="Thêm nhắc nhở" icon={<BellOutlined className="text-blue-600"/>} width={600} destroyOnClose>
      <Form {...formProps} layout="vertical" className="space-y-4" initialValues={initialValues}>
        
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
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Độ ưu tiên" name="priority" icon={<ExclamationCircleOutlined className="text-yellow-500"/>}>
              <Select placeholder="Chọn độ ưu tiên" options={[
            { label: "Thấp", value: "LOW" },
            { label: "Trung bình", value: "MEDIUM" },
            { label: "Cao", value: "HIGH" },
        ]}/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Thời gian nhắc" name="timeReminder" icon={<ClockCircleOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng chọn thời gian nhắc" }]}>
              <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: "100%" }} placeholder="Chọn thời gian nhắc"/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Trạng thái" name="reminderStatus" icon={<TagOutlined className="text-green-500"/>}>
              <Select placeholder="Chọn trạng thái" options={[
            { label: "Chờ xử lý", value: "PENDING" },
            { label: "Hoàn thành", value: "DONE" },
            { label: "Đã hủy", value: "CANCELLED" },
        ]}/>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Lặp lại" name="repeat" icon={<CalendarOutlined className="text-purple-500"/>}>
              <Select placeholder="Chọn tần suất lặp lại" options={[
            { label: "Không lặp lại", value: "NEVER" },
            { label: "Hàng ngày", value: "DAILY" },
            { label: "Hàng tuần", value: "WEEKLY" },
            { label: "Hàng tháng", value: "MONTHLY" },
        ]}/>
            </ProfessionalFormItem>
          </Col>
          {!hideLeadSelect && (<Col xs={24} md={12}>
              <ProfessionalFormItem label="Khách hàng" name="leadId" icon={<UserOutlined className="text-cyan-500"/>}>
                <Select 
                  {...leadSelectProps} 
                  placeholder="Tìm kiếm và chọn khách hàng"
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </ProfessionalFormItem>
            </Col>)}
        </Row>
        
        <ProfessionalFormItem label="Chi tiết" name="detail" icon={<AlignLeftOutlined className="text-indigo-500"/>}>
          <Input.TextArea rows={4} placeholder="Nhập chi tiết nhắc nhở" showCount maxLength={500}/>
        </ProfessionalFormItem>
      </Form>
    </ProfessionalModal>);
};