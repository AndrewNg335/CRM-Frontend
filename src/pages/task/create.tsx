import { useSearchParams } from "react-router";
import { useModalForm, useSelect } from "@refinedev/antd";
import { useNavigation, useGetIdentity, useInvalidate, useGo } from "@refinedev/core";
import { DatePicker, Form, Input, Select, Row, Col } from "antd";
import { CheckSquareOutlined, FieldTimeOutlined, AlignLeftOutlined, TagOutlined, UserOutlined } from "@ant-design/icons";
import { ProfessionalModal, ProfessionalFormItem } from "@/components";
import { BackButton } from "@/components/back-button";
import type { User } from "@/interfaces/user";
import React from "react";
const TasksCreatePage = () => {
    const [searchParams] = useSearchParams();
    const { list } = useNavigation();
    const go = useGo();
    const { data: currentUser } = useGetIdentity<User>();
    const isAdmin = currentUser?.role?.name === 'Admin';
    const invalidate = useInvalidate();
    
    const { formProps, modalProps, close } = useModalForm({
        action: "create",
        defaultVisible: true,
        redirect: false,
        warnWhenUnsavedChanges: false,
        onMutationSuccess: () => {
            invalidate({
                resource: "tasks",
                invalidates: ["list"],
            });
            if (!isAdmin && currentUser?._id) {
                invalidate({
                    resource: `tasks/user/${currentUser._id}`,
                    invalidates: ["list"],
                });
            }
            close();
            go({
                to: "/tasks",
                type: "replace",
            });
        },
    });

    const { selectProps: rawUserSelectProps } = useSelect({
        resource: "auth",
        optionLabel: "name",
        optionValue: "_id",
        pagination: { mode: 'off' },
        queryOptions: { enabled: isAdmin },
    });
    
    const userSelectProps = React.useMemo(() => ({ ...rawUserSelectProps }), [rawUserSelectProps]);

    React.useEffect(() => {
        if (formProps?.form && currentUser?._id) {
            formProps.form.setFieldsValue({ userId: currentUser._id });
        }
    }, [formProps?.form, currentUser?._id]);

    React.useEffect(() => {
        if (modalProps?.open && formProps?.form && currentUser?._id) {
            formProps.form.setFieldsValue({ userId: currentUser._id });
        }
    }, [modalProps?.open, formProps?.form, currentUser?._id]);
    const handleCancel = () => {
        close();
        go({
            to: "/tasks",
            type: "replace",
        });
    };

    return (<ProfessionalModal  {...modalProps} onCancel={handleCancel} okText="Lưu" cancelText="Hủy" title="Thêm Task mới" icon={<CheckSquareOutlined className="text-blue-600"/>} width={700}>
      <div className="mb-4">
      </div>
      <Form {...formProps} layout="vertical" className="space-y-4">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Tiêu đề" name="title" icon={<CheckSquareOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng nhập tiêu đề task" }]}>
              <Input placeholder="Nhập tiêu đề task"/>
            </ProfessionalFormItem>
          </Col>
          <Col xs={24} md={12}>
            <ProfessionalFormItem label="Trạng thái" name="stage" icon={<TagOutlined className="text-green-500"/>}>
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

        {!isAdmin && (
          <Form.Item name="userId" style={{ display: 'none' }}>
            <Input type="hidden" />
          </Form.Item>
        )}

        {isAdmin && (
          <ProfessionalFormItem 
            label="Người được giao" 
            name="userId" 
            icon={<UserOutlined className="text-cyan-500"/>}
            rules={[{ required: true, message: "Vui lòng chọn người được giao task" }]}
          >
            <Select {...userSelectProps} placeholder="Chọn người được giao task" />
          </ProfessionalFormItem>
        )}

        <ProfessionalFormItem label="Mô tả" name="description" icon={<AlignLeftOutlined className="text-purple-500"/>}>
          <Input.TextArea placeholder="Nhập mô tả chi tiết về task" rows={4} showCount maxLength={500}/>
        </ProfessionalFormItem>

        <ProfessionalFormItem label="Ngày hết hạn" name="dueDate" icon={<FieldTimeOutlined className="text-orange-500"/>}>
          <DatePicker format="YYYY-MM-DD HH:mm" showTime style={{ width: "100%" }} placeholder="Chọn ngày hết hạn"/>
        </ProfessionalFormItem>
      </Form>
    </ProfessionalModal>);
};
export default TasksCreatePage;