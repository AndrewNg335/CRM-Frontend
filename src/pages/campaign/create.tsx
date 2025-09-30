// src/pages/campaign/create.tsx
import { useModalForm, useSelect } from "@refinedev/antd";
import { useGo, useGetIdentity } from "@refinedev/core";
import type { User } from "@/interfaces/user";
import { Form, Input, InputNumber, Select, DatePicker, Row, Col } from "antd";
import { 
  FlagOutlined, 
  DollarOutlined, 
  UserOutlined, 
  CalendarOutlined,
  AlignLeftOutlined,
  TagOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { CampaignList } from "./list";
import { ProfessionalModal, ProfessionalFormItem } from "@/components";
import React from "react";

export const CreateCampaign = () => {
  const go = useGo();
  const { data: currentUser } = useGetIdentity<User>();

  const goToListPage = () => {
    go({
      to: { resource: "campaigns", action: "list" },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const { formProps, modalProps } = useModalForm({
    action: "create",
    defaultVisible: true,
    resource: "campaigns",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
  });

  // Get users for responsible user selection
  const { selectProps: userSelectProps } = useSelect({
    resource: "auth",
    optionLabel: "name",
    optionValue: "_id",
    pagination: { mode: 'off' },
  });

  // Auto-set responsibleUserId when form initializes
  React.useEffect(() => {
    if (formProps?.form && currentUser?._id) {
      formProps.form.setFieldsValue({ responsibleUserId: currentUser._id });
    }
  }, [formProps?.form, currentUser?._id]);

  return (
    <CampaignList>
      <ProfessionalModal
        {...modalProps}
        onCancel={goToListPage}
        title="Thêm chiến dịch mới"
        icon={<FlagOutlined className="text-purple-600" />}
        width={700}
      >
        <Form {...formProps} layout="vertical" className="space-y-4">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem
                label="Tên chiến dịch"
                name="name"
                icon={<FlagOutlined className="text-purple-500" />}
                rules={[{ required: true, message: "Vui lòng nhập tên chiến dịch" }]}
              >
                <Input placeholder="Nhập tên chiến dịch" />
              </ProfessionalFormItem>
            </Col>
            <Col xs={24} md={12}>
              <ProfessionalFormItem
                label="Trạng thái"
                name="campaignStatus"
                icon={<TagOutlined className="text-green-500" />}
              >
                <Select
                  placeholder="Chọn trạng thái"
                  options={[
                    { label: "Lên kế hoạch", value: "Planned" },
                    { label: "Đang thực hiện", value: "In Progress" },
                    { label: "Hoàn thành", value: "Completed" },
                  ]}
                />
              </ProfessionalFormItem>
            </Col>
          </Row>

          <ProfessionalFormItem
            label="Mô tả"
            name="description"
            icon={<AlignLeftOutlined className="text-blue-500" />}
          >
            <Input.TextArea 
              placeholder="Nhập mô tả chi tiết về chiến dịch"
              rows={3}
              showCount
              maxLength={500}
            />
          </ProfessionalFormItem>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <ProfessionalFormItem
                label="Ngân sách"
                name="campaignBudgetCost"
                icon={<DollarOutlined className="text-green-500" />}
              >
                <InputNumber 
                  style={{ width: "100%" }} 
                  placeholder="Nhập ngân sách"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </ProfessionalFormItem>
            </Col>
            <Col xs={24} md={8}>
              <ProfessionalFormItem
                label="Doanh thu dự kiến"
                name="campaignExpectedRevenue"
                icon={<DollarOutlined className="text-blue-500" />}
              >
                <InputNumber 
                  style={{ width: "100%" }} 
                  placeholder="Nhập doanh thu dự kiến"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </ProfessionalFormItem>
            </Col>
            <Col xs={24} md={8}>
              <ProfessionalFormItem
                label="Người phụ trách"
                name="responsibleUserId"
                icon={<UserOutlined className="text-orange-500" />}
              >
                <Select {...userSelectProps} placeholder="Chọn người phụ trách" />
              </ProfessionalFormItem>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem
                label="Ngày bắt đầu"
                name="startDate"
                icon={<CalendarOutlined className="text-green-500" />}
              >
                <DatePicker 
                  style={{ width: "100%" }} 
                  placeholder="Chọn ngày bắt đầu"
                />
              </ProfessionalFormItem>
            </Col>
            <Col xs={24} md={12}>
              <ProfessionalFormItem
                label="Ngày kết thúc"
                name="endDate"
                icon={<CalendarOutlined className="text-red-500" />}
              >
                <DatePicker 
                  style={{ width: "100%" }} 
                  placeholder="Chọn ngày kết thúc"
                />
              </ProfessionalFormItem>
            </Col>
          </Row>
        </Form>
      </ProfessionalModal>
    </CampaignList>
  );
};
