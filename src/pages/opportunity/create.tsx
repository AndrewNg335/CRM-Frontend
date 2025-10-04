import { useModalForm, useSelect } from "@refinedev/antd";
import { useGo, useGetIdentity } from "@refinedev/core";
import { Form, Input, InputNumber, Select, DatePicker, Row, Col } from "antd";
import { FlagOutlined, DollarOutlined, UserOutlined, CalendarOutlined, AlignLeftOutlined, TagOutlined, LinkOutlined, PercentageOutlined } from "@ant-design/icons";
import { OpportunityList } from "./list";
import { OpportunityStage } from "@/interfaces/opportunity";
import { ProfessionalModal, ProfessionalFormItem } from "@/components";
import React from "react";
import type { User } from "@/interfaces/user";
export const CreateOpportunity = () => {
    const go = useGo();
    const { data: currentUser } = useGetIdentity<User>();
    const isAdmin = currentUser?.role?.name === 'Admin';
    const goToListPage = () => {
        go({
            to: { resource: "opportunities", action: "list" },
            options: { keepQuery: true },
            type: "replace",
        });
    };
    const { formProps, modalProps } = useModalForm({
        action: "create",
        defaultVisible: true,
        resource: "opportunities",
        redirect: false,
        mutationMode: "pessimistic",
        onMutationSuccess: goToListPage,
    });
    React.useEffect(() => {
        if (formProps?.form && currentUser?._id) {
            formProps.form.setFieldsValue({ ownerId: currentUser._id });
        }
    }, [formProps?.form, currentUser?._id]);
    const { selectProps: leadSelectProps } = useSelect({
        resource: "leads",
        optionLabel: "name",
        optionValue: "_id",
    });
    const { selectProps: campaignSelectProps } = useSelect({
        resource: "campaigns",
        optionLabel: "name",
        optionValue: "_id",
    });
    const { selectProps: rawOwnerSelectProps } = useSelect({
        resource: "auth",
        optionLabel: "name",
        optionValue: "_id",
        pagination: { mode: 'off' },
        queryOptions: { enabled: isAdmin },
    });
    const ownerSelectProps = React.useMemo(() => {
        const options = (rawOwnerSelectProps?.options as any[] | undefined) || [];
        const filtered = options.filter((opt: any) => {
            return true;
        });
        return { ...rawOwnerSelectProps, options: filtered } as typeof rawOwnerSelectProps;
    }, [rawOwnerSelectProps]);
    return (<OpportunityList>
      <ProfessionalModal {...modalProps} onCancel={goToListPage} okText="Lưu" cancelText="Hủy"  title="Thêm cơ hội mới" icon={<FlagOutlined className="text-green-600"/>} width={800}>
        <Form {...formProps} layout="vertical" className="space-y-4">
          
          <Form.Item name="ownerId" hidden>
            <Input />
          </Form.Item>

          
          {isAdmin && (<Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <ProfessionalFormItem label="Người phụ trách" name="ownerId" icon={<UserOutlined className="text-teal-500"/>}>
                  <Select {...ownerSelectProps} placeholder="Chọn người phụ trách" allowClear/>
                </ProfessionalFormItem>
              </Col>
            </Row>)}
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Tên cơ hội" name="name" icon={<FlagOutlined className="text-green-500"/>} rules={[{ required: true, message: "Vui lòng nhập tên cơ hội" }]}>
                <Input placeholder="Nhập tên cơ hội"/>
              </ProfessionalFormItem>
            </Col>
            <Col xs={24} md={12}>
            <ProfessionalFormItem label="Giai đoạn" name="opportunityStage" icon={<TagOutlined className="text-blue-500"/>}>
                <Select
                  placeholder="Chọn giai đoạn"
                  options={[
                    { label: "Đánh giá", value: OpportunityStage.QUALIFICATION },
                    { label: "Phân tích nhu cầu", value: OpportunityStage.NEEDS_ANALYSIS },
                    { label: "Đề xuất", value: OpportunityStage.PROPOSAL },
                    { label: "Đàm phán", value: OpportunityStage.NEGOTIATION },
                    { label: "Thắng", value: OpportunityStage.CLOSED_WON },
                    { label: "Thua", value: OpportunityStage.CLOSED_LOST },
                  ]}
                  defaultValue={OpportunityStage.QUALIFICATION}
                />
              </ProfessionalFormItem>
            </Col>
          </Row>

          <ProfessionalFormItem label="Mô tả" name="description" icon={<AlignLeftOutlined className="text-purple-500"/>}>
            <Input.TextArea placeholder="Nhập mô tả chi tiết về cơ hội" rows={3} showCount maxLength={500}/>
          </ProfessionalFormItem>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <ProfessionalFormItem label="Giá trị" name="amount" icon={<DollarOutlined className="text-green-500"/>}>
                <InputNumber style={{ width: "100%" }} placeholder="Nhập giá trị" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}/>
              </ProfessionalFormItem>
            </Col>
            <Col xs={24} md={8}>
              <ProfessionalFormItem label="Xác suất (%)" name="probability" icon={<PercentageOutlined className="text-orange-500"/>}>
                <InputNumber min={0} max={100} style={{ width: "100%" }} placeholder="Nhập xác suất"/>
              </ProfessionalFormItem>
            </Col>
            <Col xs={24} md={8}>
              <ProfessionalFormItem label="Ngày đóng" name="closeDate" icon={<CalendarOutlined className="text-red-500"/>}>
                <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày đóng"/>
              </ProfessionalFormItem>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Khách hàng" name="leadId" icon={<UserOutlined className="text-blue-500"/>} rules={[{ required: true, message: "Vui lòng chọn khách hàng" }]}>
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
            <Col xs={24} md={12}>
              <ProfessionalFormItem label="Bước tiếp theo" name="nextStep" icon={<CalendarOutlined className="text-indigo-500"/>}>
                <Input placeholder="Nhập bước tiếp theo"/>
              </ProfessionalFormItem>
            </Col>
          </Row>

        </Form>
      </ProfessionalModal>
    </OpportunityList>);
};
