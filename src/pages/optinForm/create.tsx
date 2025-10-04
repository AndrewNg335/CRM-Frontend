import { OptinForm } from "@/interfaces/optinForm";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Col, Form, Input, Row, Select, Switch, Card, Button, } from "antd";
import { Typography } from "antd";
import { RocketOutlined, FileTextOutlined, UserOutlined, CheckCircleOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
export const CreateOptinForm = () => {
    const { saveButtonProps, formProps, formLoading } = useForm<OptinForm>({
        redirect: "list",
        resource: "optin-forms",
    });
    const { selectProps: campaignSelectProps } = useSelect({
        resource: "campaigns",
        optionLabel: "name",
        optionValue: "_id",
    });
    const { selectProps: userSelectProps } = useSelect({
        resource: "auth",
        optionLabel: "name",
        optionValue: "_id",
    });
    return (<div className="page-container">
      <Row gutter={[32, 32]}>

        <Col xs={24} xl={12}>
          <Create isLoading={formLoading} saveButtonProps={{
            ...saveButtonProps,
            className: "professional-button enhanced-button",
            size: "large",
        }} breadcrumb={false}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <RocketOutlined className="text-blue-600 text-lg"/>
              </div>
              <div>
                <Title level={4} className="!mb-0 !text-gray-800">Tạo Opt-in Form</Title>
                <Text type="secondary">Cấu hình biểu mẫu để thu thập lead hiệu quả</Text>
              </div>
            </div>

            <Card className="professional-card">
              <Form {...formProps} layout="vertical" initialValues={{ isActive: true }}>
                <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <RocketOutlined className="text-blue-500"/>
                      Tiêu đề
                    </span>} name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
                  <Input className="professional-input enhanced-input" placeholder="Nhập tiêu đề Opt-in" size="large"/>
                </Form.Item>

                <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FileTextOutlined className="text-gray-500"/>
                      Mô tả
                    </span>} name="description">
                  <Input.TextArea className="professional-input enhanced-input" placeholder="Mô tả ngắn gọn về biểu mẫu" rows={4} showCount maxLength={300}/>
                </Form.Item>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <CheckCircleOutlined className="text-green-500"/>
                          Trạng thái hoạt động
                        </span>} name="isActive" valuePropName="checked">
                      <Switch className="professional-switch" checkedChildren="Bật" unCheckedChildren="Tắt"/>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <UserOutlined className="text-purple-500"/>
                          Chiến dịch
                        </span>} name="campaignId" rules={[{ required: true, message: "Vui lòng chọn chiến dịch" }]}>
                      <Select 
                        {...campaignSelectProps} 
                        placeholder="Tìm kiếm và chọn chiến dịch" 
                        className="professional-input enhanced-input" 
                        size="large" 
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <UserOutlined className="text-cyan-500"/>
                          Người phụ trách
                        </span>} name="assignedTo">
                      <Select 
                        {...userSelectProps} 
                        placeholder="Tìm kiếm và chọn người phụ trách" 
                        className="professional-input enhanced-input" 
                        size="large" 
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onSearch={(value) => {
                          // Trigger search when user types
                          console.log('Searching for user:', value);
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Create>
        </Col>

        <Col xs={24} xl={12}>
          <Card className="professional-card" title={<div className="flex items-center space-x-2">
              <FileTextOutlined className="text-blue-500"/>
              <span>Mã nhúng</span>
            </div>}>
            <div className="space-y-3">
              <Text>
                <strong>Cách sử dụng:</strong> Sau khi tạo thành công, vào trang chi tiết Opt-in Form để copy đoạn mã nhúng và dán vào website của bạn.
              </Text>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Mã nhúng sẽ xuất hiện sau khi tạo mới Opt-in Form</li>
                <li>Tự động nhận nguồn truy cập và thông tin giới thiệu</li>
                <li>Form hiển thị sẽ có dạng preview phía dưới</li>
                <li>Thay đổi form sẽ cập nhật tự động trên website</li>
              </ul>
              <Input.TextArea rows={4} readOnly placeholder="Mã nhúng..." value="Copy code ở đây khi đã tạo mới một Opt-in Form"/>
              <Button type="dashed" disabled className="professional-button">
                Bạn phải tạo Opt-in Form trước để sinh mã nhúng
              </Button>
            </div>
          </Card>

  
        </Col>
      </Row>
    </div>);
};
