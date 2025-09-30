import { useSearchParams } from "react-router";

import { useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import { DatePicker, Form, Input, Select, Row, Col } from "antd";
import { CheckSquareOutlined, FieldTimeOutlined, AlignLeftOutlined, TagOutlined } from "@ant-design/icons";
import { ProfessionalModal, ProfessionalFormItem } from "@/components";

const TasksCreatePage = () => {
  const [searchParams] = useSearchParams();
  const { list } = useNavigation();
  const { formProps, modalProps, close } = useModalForm({
    action: "create",
    defaultVisible: true,
  });

  return (
    <ProfessionalModal
      {...modalProps}
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title="Thêm Task mới"
      icon={<CheckSquareOutlined className="text-blue-600" />}
      width={700}
    >
      <Form
        {...formProps}
        layout="vertical"
        className="space-y-4"
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Tiêu đề"
              name="title"
              icon={<CheckSquareOutlined className="text-blue-500" />}
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề task" }]}
            >
              <Input placeholder="Nhập tiêu đề task" />
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem
              label="Trạng thái"
              name="stage"
              icon={<TagOutlined className="text-green-500" />}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option value="todo">To Do</Select.Option>
                <Select.Option value="inprogress">In Progress</Select.Option>
                <Select.Option value="inreview">In Review</Select.Option>
                <Select.Option value="done">Done</Select.Option>
                <Select.Option value="reviewfailed">Review Failed</Select.Option>
              </Select>
            </ProfessionalFormItem>
          </Col>
        </Row>

        <ProfessionalFormItem
          label="Mô tả"
          name="description"
          icon={<AlignLeftOutlined className="text-purple-500" />}
        >
          <Input.TextArea 
            placeholder="Nhập mô tả chi tiết về task" 
            rows={4}
            showCount
            maxLength={500}
          />
        </ProfessionalFormItem>

        <ProfessionalFormItem
          label="Ngày hết hạn"
          name="dueDate"
          icon={<FieldTimeOutlined className="text-orange-500" />}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            showTime
            style={{ width: "100%" }}
            placeholder="Chọn ngày hết hạn"
          />
        </ProfessionalFormItem>
      </Form>
    </ProfessionalModal>
  );
};

export default TasksCreatePage;