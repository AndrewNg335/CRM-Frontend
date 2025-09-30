// src/pages/campaign/edit.tsx
import { Campaign } from "@/interfaces/campaign";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Col, Form, Input, InputNumber, Row, Select, DatePicker, Switch } from "antd";
import { RocketOutlined, UserOutlined, CalendarOutlined, TagOutlined, FileTextOutlined, DollarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export const EditCampaign = () => {
  const { saveButtonProps, formProps, formLoading } = useForm<Campaign>({
    redirect: "list"
  });

  const { selectProps: userSelectProps } = useSelect({
    resource: "auth",
    optionLabel: "name",
    optionValue: "_id",
    pagination: { mode: 'off' },
  });

  return (
    <div className="page-container">
      <Row gutter={[32, 32]}>
        <Col xs={24} xl={16}>
          <div className="professional-card enhanced-card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RocketOutlined className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Chỉnh sửa chiến dịch</h2>
                  <p className="text-sm text-gray-500">Cập nhật thông tin chi tiết về chiến dịch marketing</p>
                </div>
              </div>

              <Edit
                isLoading={formLoading}
                saveButtonProps={{
                  ...saveButtonProps,
                  className: "professional-button enhanced-button",
                  size: "large"
                }}
                breadcrumb={false}
              >
                <Form
                  {...formProps}
                  layout="vertical"
                  className="space-y-6"
                >
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <RocketOutlined className="text-blue-500" />
                            Tên chiến dịch
                          </span>
                        }
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên chiến dịch" }]}
                      >
                        <Input 
                          className="professional-input enhanced-input"
                          placeholder="Nhập tên chiến dịch" 
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item 
                        label={
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <CheckCircleOutlined className="text-green-500" />
                            Trạng thái
                          </span>
                        } 
                        name="campaignStatus"
                      >
                        <Select
                          className="professional-input enhanced-input"
                          placeholder="Chọn trạng thái"
                          size="large"
                          options={[
                            { label: "Lên kế hoạch", value: "Planned" },
                            { label: "Đang thực hiện", value: "In Progress" },
                            { label: "Hoàn thành", value: "Completed" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item 
                    label={
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileTextOutlined className="text-gray-500" />
                        Mô tả
                      </span>
                    } 
                    name="description"
                  >
                    <Input.TextArea 
                      className="professional-input enhanced-input"
                      placeholder="Nhập mô tả chi tiết" 
                      rows={4}
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>

                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={8}>
                      <Form.Item 
                        label={
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <CheckCircleOutlined className="text-purple-500" />
                            Trạng thái hoạt động
                          </span>
                        } 
                        name="isActive" 
                        valuePropName="checked"
                      >
                        <Switch 
                          className="professional-switch"
                          checkedChildren="Hoạt động" 
                          unCheckedChildren="Tạm dừng"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item 
                        label={
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <UserOutlined className="text-orange-500" />
                            Người phụ trách
                          </span>
                        } 
                        name="responsibleUserId"
                      >
                        <Select
                          {...userSelectProps}
                          className="professional-input enhanced-input"
                          placeholder="Chọn người phụ trách" 
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item 
                        label={
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <DollarOutlined className="text-green-500" />
                            Ngân sách
                          </span>
                        } 
                        name="campaignBudgetCost"
                      >
                        <InputNumber 
                          className="professional-input enhanced-input"
                          style={{ width: "100%" }} 
                          placeholder="Nhập ngân sách"
                          size="large"
                          formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value!.replace(/₫\s?|(,*)/g, '')}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item 
                        label={
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <DollarOutlined className="text-green-500" />
                            Doanh thu dự kiến
                          </span>
                        } 
                        name="campaignExpectedRevenue"
                      >
                        <InputNumber 
                          className="professional-input enhanced-input"
                          style={{ width: "100%" }} 
                          placeholder="Nhập doanh thu dự kiến"
                          size="large"
                          formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value!.replace(/₫\s?|(,*)/g, '')}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item 
                        label={
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <CalendarOutlined className="text-red-500" />
                            Ngày bắt đầu
                          </span>
                        } 
                        name="startDate"
                        getValueProps={(value) => ({
                          value: value ? dayjs(value) : null,
                        })}
                      >
                        <DatePicker 
                          className="professional-input enhanced-input"
                          style={{ width: "100%" }} 
                          placeholder="Chọn ngày bắt đầu"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item 
                    label={
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <CalendarOutlined className="text-red-500" />
                        Ngày kết thúc
                      </span>
                    } 
                    name="endDate"
                    getValueProps={(value) => ({
                      value: value ? dayjs(value) : null,
                    })}
                  >
                    <DatePicker 
                      className="professional-input enhanced-input"
                      style={{ width: "100%" }} 
                      placeholder="Chọn ngày kết thúc"
                      size="large"
                    />
                  </Form.Item>
                </Form>
              </Edit>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
