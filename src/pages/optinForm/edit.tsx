import { OptinForm } from "@/interfaces/optinForm";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Button, Card, Col, Form, Input, message, Row, Select, Switch, Typography, Space, Divider, Badge, Tooltip, Tag } from "antd";
import { EditOutlined, CodeOutlined, CopyOutlined, CheckCircleOutlined, UserOutlined, ApiOutlined, FileTextOutlined, LinkOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
export const EditOptinForm = () => {
    const { saveButtonProps, formProps, formLoading, queryResult } = useForm<OptinForm>({
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
    const [embedCode, setEmbedCode] = useState<string>("");
    const [isActiveValue, setIsActiveValue] = useState<boolean>(false);
    useEffect(() => {
        if (queryResult?.data?.data) {
            const item = queryResult.data.data;
            const createdAtNumber = new Date(item.createdAt).getTime();
            const code = `<div id="optin-form-iframe-${createdAtNumber}"></div>
<script type="text/javascript">
  (function () {
    var f = document.createElement("iframe");
    f.src = "${window.location.origin}/optin-forms/preview/${item._id}";
    f.style.width = "100%";
    f.style.height = "500px";
    f.frameBorder = "0";
    f.marginHeight = "0";
    f.marginWidth = "0";
    var container = document.getElementById("optin-form-iframe-${createdAtNumber}");
    container.appendChild(f);
  })();
</script>`;
            setEmbedCode(code);
            const formValues: any = {
                title: item.title,
                description: item.description,
                isActive: item.isActive
            };
            if (item.campaignId?._id) {
                formValues.campaignId = item.campaignId._id;
            }
            if (item.assignedTo?._id) {
                formValues.assignedTo = item.assignedTo._id;
            }
            formProps.form?.setFieldsValue(formValues);
            setIsActiveValue(item.isActive);
        }
    }, [queryResult?.data?.data, formProps.form]);
    const currentData = queryResult?.data?.data;
    const isActive = currentData?.isActive;
    return (<div className="page-container">
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <EditOutlined className="text-white text-xl"/>
            </div>
            <div>
              <Typography.Title level={2} className="!mb-2 !text-gray-800">
                Chỉnh sửa Form Đăng Ký
              </Typography.Title>
              <Typography.Text type="secondary" className="text-base">
                Cập nhật thông tin và cài đặt cho form đăng ký
              </Typography.Text>
            </div>
          </div>
          
          
          {currentData && (<Badge status={isActive ? "success" : "default"} text={<Tag color={isActive ? "success" : "default"} className="px-3 py-1 text-sm font-medium">
                  <CheckCircleOutlined className="mr-1"/>
                  {isActive ? "Đang hoạt động" : "Tạm dừng"}
                </Tag>}/>)}
        </div>

        
        {currentData && (<Card className="mb-6" bodyStyle={{ padding: '16px 24px' }}>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={8}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileTextOutlined className="text-blue-600 text-lg"/>
                  </div>
                  <div>
                    <Typography.Text type="secondary" className="text-sm">Tiêu đề</Typography.Text>
                    <br />
                    <Typography.Text strong className="text-gray-800">
                      {currentData.title}
                    </Typography.Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserOutlined className="text-green-600 text-lg"/>
                  </div>
                  <div>
                    <Typography.Text type="secondary" className="text-sm">Lượt đăng ký</Typography.Text>
                    <br />
                    <Typography.Text strong className="text-gray-800">
                      {currentData.submissionCount || 0}
                    </Typography.Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <LinkOutlined className="text-purple-600 text-lg"/>
                  </div>
                  <div>
                    <Typography.Text type="secondary" className="text-sm">Link xem trước</Typography.Text>
                    <br />
                    <Typography.Text strong className="text-blue-600 cursor-pointer hover:text-blue-800" onClick={() => window.open(`/optin-forms/preview/${currentData._id}`, '_blank')}>
                      Xem trước
                    </Typography.Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>)}
      </div>

      <Row gutter={[32, 32]}>
        
        <Col xs={24} xl={14}>
          <Edit isLoading={formLoading} saveButtonProps={saveButtonProps} breadcrumb={false}>
            <Card title={<div className="flex items-center space-x-2">
                  <EditOutlined className="text-blue-600"/>
                  <span className="text-lg font-semibold">Thông tin Form</span>
                </div>} className="shadow-lg border-0 rounded-xl" bodyStyle={{ padding: '32px' }}>
              <Form {...formProps} layout="vertical" size="large" key={currentData?._id || 'form'} initialValues={{
            title: currentData?.title,
            description: currentData?.description,
            isActive: currentData?.isActive,
            campaignId: currentData?.campaignId?._id,
            assignedTo: currentData?.assignedTo?._id
        }}>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Form.Item label={<div className="flex items-center space-x-2">
                          <FileTextOutlined className="text-blue-500"/>
                          <span className="font-medium">Tiêu đề Form</span>
                          <span className="text-red-500">*</span>
                        </div>} name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
                      <Input placeholder="Nhập tiêu đề form đăng ký" className="professional-input"/>
                    </Form.Item>
                  </Col>
                  
                  <Col span={24}>
                    <Form.Item label={<div className="flex items-center space-x-2">
                          <FileTextOutlined className="text-green-500"/>
                          <span className="font-medium">Mô tả</span>
                        </div>} name="description">
                      <Input.TextArea placeholder="Nhập mô tả chi tiết cho form đăng ký" rows={4} className="professional-input"/>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label={<div className="flex items-center space-x-2">
                          <CheckCircleOutlined className="text-orange-500"/>
                          <span className="font-medium">Trạng thái hoạt động</span>
                        </div>} name="isActive" valuePropName="checked" getValueFromEvent={(checked) => checked}>
                      <div className="flex items-center space-x-3">
                        <Switch size="default" checked={isActiveValue} onChange={(checked) => {
            setIsActiveValue(checked);
            formProps.form?.setFieldsValue({ isActive: checked });
        }}/>
                        <div className="flex flex-col ml-2">
                          <Typography.Text type="secondary">
                            Bật để cho phép form nhận đăng ký mới
                          </Typography.Text>
                       
                        </div>
                      </div>
                    </Form.Item>
                  </Col>

                  <Divider />

                  <Col span={24}>
                    <Form.Item label={<div className="flex items-center space-x-2">
                          <ApiOutlined className="text-purple-500"/>
                          <span className="font-medium">Chiến dịch</span>
                          <span className="text-red-500">*</span>
                        </div>} name="campaignId" rules={[{ required: true, message: "Vui lòng chọn chiến dịch" }]}>
                      <Select 
                        {...campaignSelectProps} 
                        placeholder="Tìm kiếm và chọn chiến dịch mà lead sẽ thuộc về" 
                        className="professional-select" 
                        size="large"
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                   
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label={<div className="flex items-center space-x-2">
                          <UserOutlined className="text-cyan-500"/>
                          <span className="font-medium">Người phụ trách</span>
                          <span className="text-red-500">*</span>
                        </div>} name="assignedTo" rules={[{ required: true, message: "Vui lòng chọn người phụ trách" }]}>
                      <Select 
                        {...userSelectProps} 
                        placeholder="Tìm kiếm và chọn người sẽ phụ trách lead sau khi đăng ký" 
                        className="professional-select" 
                        size="large"
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Edit>
        </Col>

        
        <Col xs={24} xl={10}>
          <Card title={<div className="flex items-center space-x-2">
                <CodeOutlined className="text-green-600"/>
                <span className="text-lg font-semibold">Mã Nhúng</span>
              </div>} className="shadow-lg border-0 rounded-xl sticky top-6" bodyStyle={{ padding: '32px' }}>
            <div className="space-y-6">
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <InfoCircleOutlined className="text-blue-600 text-lg mt-1"/>
                  <div>
                    <Typography.Text strong className="text-blue-800 block mb-2">
                      Hướng dẫn sử dụng:
                    </Typography.Text>
                    <Typography.Text className="text-blue-700 text-sm leading-relaxed">
                      1. Copy mã nhúng bên dưới<br />
                      2. Paste vào vị trí bạn muốn form hiển thị trên website<br />
                      3. Form sẽ tự động hiển thị với giao diện responsive
                    </Typography.Text>
                  </div>
                </div>
              </div>

              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Typography.Text strong className="text-gray-700">
                    Mã HTML:
                  </Typography.Text>
                  <Tooltip title="Copy toàn bộ mã nhúng">
                    <Button type="primary" icon={<CopyOutlined />} size="small" disabled={!embedCode} onClick={() => {
            navigator.clipboard.writeText(embedCode).then(() => {
                message.success("Đã sao chép mã nhúng!");
            });
        }} className="!bg-green-600 !border-green-600 hover:!bg-green-700">
                      Sao chép
                    </Button>
                  </Tooltip>
                </div>
                
                <div className="relative">
                  <Input.TextArea rows={8} readOnly value={embedCode} className="!font-mono !text-sm !bg-gray-50 !border-gray-200 !rounded-lg" style={{
            resize: 'none',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
        }}/>
                  {!embedCode && (<div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                      <Typography.Text type="secondary" className="text-center">
                        <CodeOutlined className="text-2xl block mb-2"/>
                        Đang tạo mã nhúng...
                      </Typography.Text>
                    </div>)}
                </div>
              </div>

              
              {currentData && (<div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <LinkOutlined className="text-purple-600"/>
                      </div>
                      <div>
                        <Typography.Text strong className="text-purple-800 block">
                          Xem trước form
                        </Typography.Text>
                        <Typography.Text className="text-purple-600 text-sm">
                          Kiểm tra giao diện trước khi nhúng
                        </Typography.Text>
                      </div>
                    </div>
                    <Button type="primary" ghost onClick={() => window.open(`/optin-forms/preview/${currentData._id}`, '_blank')} className="!border-purple-300 !text-purple-700 hover:!bg-purple-100">
                      Mở xem trước
                    </Button>
                  </div>
                </div>)}
            </div>
          </Card>
        </Col>
      </Row>
    </div>);
};
