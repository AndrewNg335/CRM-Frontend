import { useCreate } from "@refinedev/core";
import { Button, Card, Form, Input, message } from "antd";
import { useParams } from "react-router";
export const OptinFormPreview = () => {
    const { id: optinFormId } = useParams();
    const [form] = Form.useForm();
    const { mutate: createLead, isLoading } = useCreate();
    const onFinish = (values: any) => {
        const leadData = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            note: values.note,
            optinFormId: values.optinFormId,
        };
        createLead({
            resource: `leads/optinForm/${optinFormId}`,
            values: leadData,
            successNotification: false,
        }, {
            onSuccess: () => {
                message.success("Đăng kí thành công!");
                form.resetFields();
            },
            onError: () => {
                message.error("Có lỗi xảy ra, vui lòng thử lại.");
            },
        });
    };
    return (<div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minHeight: "100vh",
        }}>
      <Card title="Đăng ký nhận thông tin" style={{ width: 400 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input placeholder="Nhập tên của bạn"/>
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
            <Input placeholder="Nhập số điện thoại"/>
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
        ]}>
            <Input placeholder="Nhập email"/>
          </Form.Item>

          <Form.Item label="Lời nhắn" name="note">
            <Input.TextArea rows={3} placeholder="Lời nhắn..."/>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
              Đăng kí
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>);
};