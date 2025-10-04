import { InteractionCard, OpportunityCard, ReminderCard } from "@/components/cards";
import { InteractionModal, OpportunityCreateModal, ReminderCreateModal, ReminderEditModal } from "@/components/modal";
import { BackButton } from "@/components/back-button";
import type { User } from "@/interfaces/user";
import { BellOutlined, DollarOutlined, EnvironmentOutlined, FileTextOutlined, LinkOutlined, MailOutlined, MessageOutlined, PhoneOutlined, PlusOutlined, TagOutlined, UserOutlined } from "@ant-design/icons";
import { DeleteButton, EditButton, useModalForm, useSelect, } from "@refinedev/antd";
import { useApiUrl, useDelete, useGetIdentity, useNavigation, useShow } from "@refinedev/core";
import { Button, Card, Col, Collapse, Divider, Empty, Form, Input, Modal, Row, Select, Space, Spin, Tabs, Tag } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
const { Panel } = Collapse;
const { TabPane } = Tabs;
export const LeadDetailPage = () => {
    const { queryResult } = useShow({ resource: "leads" });
    const { data, isLoading, refetch } = queryResult as any;
    const lead = data?.data;
    const apiUrl = useApiUrl();
    const { data: currentUser } = useGetIdentity<User>();
    const isAdmin = currentUser?.role?.name === 'Admin';
    const [reminders, setReminders] = useState<any[]>([]);
    const [remindersLoading, setRemindersLoading] = useState(false);
    const [interactions, setInteractions] = useState<any[]>([]);
    const [interactionsLoading, setInteractionsLoading] = useState(false);
    const { mutate: deleteOne } = useDelete();
    const { push } = useNavigation();
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [opportunitiesLoading, setOpportunitiesLoading] = useState(false);
    const { selectProps: rawOwnerSelectProps } = useSelect({
        resource: "auth",
        optionLabel: "name",
        optionValue: "_id",
        pagination: { mode: 'off' },
        queryOptions: { enabled: isAdmin },
    });
    const ownerSelectProps = React.useMemo(() => ({ ...rawOwnerSelectProps }), [rawOwnerSelectProps]);
  const { selectProps: campaignSelectProps } = useSelect({
      resource: "campaigns",
      optionLabel: "name",
      optionValue: "_id",
  });
    const getAuthHeaders = (): Record<string, string> => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    };
    useEffect(() => {
        if (!lead?._id)
            return;
        setOpportunitiesLoading(true);
        fetch(`${apiUrl}/opportunities/lead/${lead._id}`, {
            headers: getAuthHeaders(),
        })
            .then((res) => res.json())
            .then((res) => {
            setOpportunities(res.data ?? []);
        })
            .finally(() => setOpportunitiesLoading(false));
    }, [lead?._id]);
    const { formProps, modalProps, show, } = useModalForm({
        action: "edit",
        resource: "leads",
        id: lead?._id,
        redirect: false,
        mutationMode: "pessimistic",
    });
    const { formProps: opportunityFormProps, modalProps: opportunityModalProps, show: showOpportunityModal, } = useModalForm({
        action: "create",
        resource: "opportunities",
        redirect: false,
        mutationMode: "pessimistic",
        onMutationSuccess: () => {
            fetch(`${apiUrl}/opportunities/lead/${lead?._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
            })
                .then((res) => res.json())
                .then((res) => setOpportunities(res.data ?? []));
        },
    });
    const { formProps: interactionFormProps, modalProps: interactionModalProps, show: showInteractionModal, } = useModalForm({
        action: "create",
        resource: "interactions",
        redirect: false,
        mutationMode: "pessimistic",
        onMutationSuccess: () => {
            fetch(`${apiUrl}/interactions/lead/${lead?._id}`, {
                headers: getAuthHeaders(),
            })
                .then((res) => res.json())
                .then((res) => setInteractions(res.data ?? []))
                .finally(() => {
                try {
                    refetch?.();
                }
                catch { }
            });
        },
    });
    const { formProps: reminderFormProps, modalProps: reminderModalProps, show: showReminderModal, } = useModalForm({
        action: "create",
        resource: "reminders",
        redirect: false,
        mutationMode: "pessimistic",
        onMutationSuccess: () => {
            fetch(`${apiUrl}/leads/${lead?._id}/reminders`, {
                headers: getAuthHeaders(),
            })
                .then((res) => res.json())
                .then((res) => setReminders(res.data ?? []));
        },
    });
    const { formProps: editReminderFormProps, modalProps: editReminderModalProps, show: showEditReminderModal, } = useModalForm({
        action: "edit",
        resource: "reminders",
        redirect: false,
        mutationMode: "pessimistic",
        onMutationSuccess: () => {
            fetch(`${apiUrl}/leads/${lead?._id}/reminders`, {
                headers: getAuthHeaders(),
            })
                .then((res) => res.json())
                .then((res) => setReminders(res.data ?? []));
        },
    });
    useEffect(() => {
        if (!lead?._id)
            return;
        setInteractionsLoading(true);
        fetch(`${apiUrl}/interactions/lead/${lead._id}`, {
            headers: getAuthHeaders(),
        })
            .then((res) => res.json())
            .then((res) => {
            setInteractions(res.data ?? []);
        })
            .finally(() => setInteractionsLoading(false));
    }, [lead?._id]);
    useEffect(() => {
        if (!lead?._id)
            return;
        setRemindersLoading(true);
        fetch(`${apiUrl}/leads/${lead._id}/reminders`, {
            headers: getAuthHeaders(),
        })
            .then((res) => res.json())
            .then((res) => {
            setReminders(res.data ?? []);
        })
            .finally(() => setRemindersLoading(false));
    }, [lead?._id]);
    useEffect(() => {
        if (opportunityFormProps?.form && currentUser?._id && lead?._id) {
            opportunityFormProps.form.setFieldsValue({
                ownerId: currentUser._id,
                leadId: lead._id
            });
        }
    }, [opportunityFormProps?.form, currentUser?._id, lead?._id]);
    useEffect(() => {
        if (opportunityModalProps?.open && opportunityFormProps?.form && currentUser?._id && lead?._id) {
            opportunityFormProps.form.resetFields();
            opportunityFormProps.form.setFieldsValue({
                ownerId: currentUser._id,
                leadId: lead._id,
            });
        }
    }, [opportunityModalProps?.open, opportunityFormProps?.form, currentUser?._id, lead?._id]);
    useEffect(() => {
        if (interactionFormProps?.form && currentUser?._id) {
            interactionFormProps.form.setFieldsValue({ userId: currentUser._id });
        }
    }, [interactionFormProps?.form, currentUser?._id]);
    useEffect(() => {
        if (interactionModalProps?.open && interactionFormProps?.form && currentUser?._id && lead?._id) {
            interactionFormProps.form.resetFields();
            interactionFormProps.form.setFieldsValue({
                userId: currentUser._id,
                leadId: lead._id,
            });
        }
    }, [interactionModalProps?.open, interactionFormProps?.form, currentUser?._id, lead?._id]);
    useEffect(() => {
        if (reminderFormProps?.form && currentUser?._id && lead?._id) {
            reminderFormProps.form.setFieldsValue({
                userId: currentUser._id,
                leadId: lead._id
            });
        }
    }, [reminderFormProps?.form, currentUser?._id, lead?._id]);
    useEffect(() => {
        if (reminderModalProps?.open && reminderFormProps?.form && currentUser?._id && lead?._id) {
            reminderFormProps.form.resetFields();
            reminderFormProps.form.setFieldsValue({
                userId: currentUser._id,
                leadId: lead._id,
            });
        }
    }, [reminderModalProps?.open, reminderFormProps?.form, currentUser?._id, lead?._id]);
    
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Mới';
            case 'contacting': return 'Đang liên hệ';
            case 'converted': return 'Đã chuyển đổi';
            case 'not_interested': return 'Không quan tâm';
            default: return status;
        }
    };
    if (isLoading)
        return <div>Loading...</div>;
    if (!lead)
        return <div>No data</div>;
    return (<div className="page-container">
      <div className="mb-4">
        <BackButton />
      </div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card bordered={false} className="professional-card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: '#1f2937' }}>{lead.name}</h2>
              <Space>
                <EditButton size="small" recordItemId={lead._id} onClick={() => show(lead._id)} className="professional-button">
                  Chỉnh sửa
                </EditButton>
                <DeleteButton size="small" recordItemId={lead._id} onSuccess={() => push("/leads")} className="professional-button">
                  Xoá
                </DeleteButton>
              </Space>
            </div>
            
            <Divider style={{ margin: '16px 0' }}/>
            
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <DetailRow label="Tên khách hàng" value={lead.name}/>
                <DetailRow label="Trạng thái" value={getStatusLabel(lead.status || '')}/>
                <DetailRow label="Số điện thoại" value={lead.phone}/>
                <DetailRow label="Email" value={<a href={`mailto:${lead.email}`} style={{ color: '#1890ff' }}>{lead.email}</a>}/>
                <DetailRow label="Nguồn" value={lead.source}/>
              </Col>
              <Col span={12}>
                <DetailRow label="Ngày tạo" value={dayjs(lead.createdAt).format("DD/MM/YYYY HH:mm")}/>
                <DetailRow label="Ngày tương tác gần nhất" value={dayjs(lead.lastInteractionDate).format("DD/MM/YYYY HH:mm")}/>
                <DetailRow label="Ghi chú" value={lead.note}/>
                <DetailRow label="Số lần tương tác" value={lead.interactionCount}/>
                <DetailRow label="Địa chỉ" value={lead.address}/>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col md={24}>
          <Card className="professional-card" bordered={false}>
            <Tabs defaultActiveKey="interactions" size="small" tabBarStyle={{ marginBottom: 16 }} items={[
            {
                key: 'interactions',
                label: (<div style={{ display: 'flex', alignItems: 'center' }}>
                      <MessageOutlined style={{ marginRight: 6 }}/>
                      <span>Lịch sử tương tác</span>
                      <Tag color="blue" style={{ marginLeft: 6 }}>{lead.interactionCount ?? 0}</Tag>
                    </div>),
                children: (<div>
                      <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
                        <Button type="primary" ghost onClick={() => showInteractionModal()} className="professional-button" icon={<PlusOutlined />} size="small">
                          Thêm tương tác
                        </Button>
                      </div>
                      {interactionsLoading ? (<div style={{ textAlign: 'center', padding: '40px 0' }}>
                          <Spin size="large"/>
                        </div>) : interactions.length === 0 ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có tương tác nào" style={{ margin: '20px 0' }}/>) : (<div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {interactions.map((interaction: any) => (<InteractionCard key={interaction._id} interaction={interaction} onDelete={(id) => {
                                setInteractions((prev) => prev.filter((i) => i._id !== id));
                                fetch(`${apiUrl}/interactions/lead/${lead?._id}`, {
                                    headers: getAuthHeaders(),
                                })
                                    .then((res) => res.json())
                                    .then((res) => setInteractions(res.data ?? []))
                                    .finally(() => {
                                    try {
                                        refetch?.();
                                    }
                                    catch { }
                                });
                            }}/>))}
                        </div>)}
                    </div>)
            },
            {
                key: 'reminders',
                label: (<div style={{ display: 'flex', alignItems: 'center' }}>
                      <BellOutlined style={{ marginRight: 6 }}/>
                      <span>Nhắc nhở</span>
                      <Tag color="blue" style={{ marginLeft: 6 }}>{reminders.length}</Tag>
                    </div>),
                children: (<div>
                      <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
                        <Button type="primary" ghost onClick={() => showReminderModal()} className="professional-button" icon={<PlusOutlined />} size="small">
                          Thêm nhắc nhở
                        </Button>
                      </div>
                      {remindersLoading ? (<div style={{ textAlign: 'center', padding: '40px 0' }}>
                          <Spin size="large"/>
                        </div>) : reminders.length === 0 ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có nhắc nhở nào" style={{ margin: '20px 0' }}/>) : (<div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {reminders.map((rem: any) => (<ReminderCard key={rem._id} reminder={rem} onDelete={(id) => {
                                setReminders((prev) => prev.filter((r) => r._id !== id));
                            }} onEdit={(id) => showEditReminderModal(id)}/>))}
                        </div>)}
                    </div>)
            },
            {
                key: 'opportunities',
                label: (<div style={{ display: 'flex', alignItems: 'center' }}>
                      <DollarOutlined style={{ marginRight: 6 }}/>
                      <span>Cơ hội</span>
                      <Tag color="green" style={{ marginLeft: 6 }}>{opportunities.length}</Tag>
                    </div>),
                children: (<div>
                      <div style={{ display: "flex", justifyContent: "end", marginBottom: 16 }}>
                        <Button type="primary" ghost onClick={() => showOpportunityModal()} className="professional-button" icon={<PlusOutlined />} size="small">
                          Thêm cơ hội
                        </Button>
                      </div>
                      {opportunitiesLoading ? (<div style={{ textAlign: 'center', padding: '40px 0' }}>
                          <Spin size="large"/>
                        </div>) : opportunities.length === 0 ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có cơ hội nào" style={{ margin: '20px 0' }}/>) : (<div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {opportunities.map((opp: any) => (<OpportunityCard key={opp._id} opportunity={opp} onDelete={(id) => {
                                setOpportunities((prev) => prev.filter((o) => o._id !== id));
                            }}/>))}
                        </div>)}
                    </div>)
            }
        ]}/>
          </Card>
        </Col>
      </Row>

      
      <Modal {...modalProps} centered okText="Lưu" cancelText="Hủy" title={<div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserOutlined className="text-blue-600"/>
            </div>
            <span className="text-lg font-semibold text-gray-800">Chỉnh sửa khách hàng</span>
          </div>} destroyOnClose className="professional-modal enhanced-modal" width={800} styles={{
            body: { padding: "24px", maxHeight: "calc(80vh - 200px)", overflowY: "auto" }
        }}>
        <Form {...formProps} layout="vertical" className="space-y-4">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UserOutlined className="text-blue-500"/>
                    Tên khách hàng
                  </span>} name="name" rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}>
                <Input className="professional-input enhanced-input" placeholder="Nhập tên khách hàng" size="large"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <TagOutlined className="text-green-500"/>
                    Trạng thái
                  </span>} name="status">
                <Select className="professional-input enhanced-input" placeholder="Chọn trạng thái" size="large" options={[
            { label: "Mới", value: "new" },
            { label: "Đang liên hệ", value: "contacting" },
            { label: "Đã chuyển đổi", value: "converted" },
            { label: "Không quan tâm", value: "not_interested" }
        ]}/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <PhoneOutlined className="text-purple-500"/>
                    Số điện thoại
                  </span>} name="phone" rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9+\-\s()]+$/, message: "Số điện thoại không hợp lệ" }
        ]}>
                <Input className="professional-input enhanced-input" placeholder="Nhập số điện thoại" size="large"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MailOutlined className="text-orange-500"/>
                    Email
                  </span>} name="email" rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
        ]}>
                <Input className="professional-input enhanced-input" placeholder="Nhập email" size="large"/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <LinkOutlined className="text-cyan-500"/>
                    Nguồn
                  </span>} name="source">
                <Select className="professional-input enhanced-input" placeholder="Chọn nguồn" size="large" options={[
            { label: "Website", value: "website" },
            { label: "Facebook", value: "facebook" },
            { label: "Google Ads", value: "google_ads" },
            { label: "Giới thiệu", value: "referral" },
            { label: "Khác", value: "other" }
        ]}/>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <EnvironmentOutlined className="text-red-500"/>
                    Địa chỉ
                  </span>} name="address">
                <Input className="professional-input enhanced-input" placeholder="Nhập địa chỉ" size="large"/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileTextOutlined className="text-indigo-500"/>
                Ghi chú
              </span>} name="note">
            <Input.TextArea rows={4} className="professional-input enhanced-input" placeholder="Nhập ghi chú về khách hàng" showCount maxLength={500}/>
          </Form.Item>
        </Form>
      </Modal>

      
      <InteractionModal modalProps={interactionModalProps} formProps={interactionFormProps} initialValues={{ leadId: lead._id }}/>

      
      <ReminderCreateModal modalProps={reminderModalProps} formProps={reminderFormProps} leadSelectProps={{ options: [] }} initialValues={{ leadId: lead._id }} hideLeadSelect={true}/>

      
      <ReminderEditModal modalProps={editReminderModalProps} formProps={editReminderFormProps} hideLeadField={true}/>

      
      <OpportunityCreateModal modalProps={opportunityModalProps} formProps={opportunityFormProps} ownerSelectProps={ownerSelectProps} leadSelectProps={{ options: [] }} campaignSelectProps={campaignSelectProps} isAdmin={isAdmin} initialValues={{ leadId: lead._id }} hideLeadSelect={true}/>

    </div>);
};
const DetailRow = ({ label, value }: {
    label: string;
    value: any;
}) => (<div style={{
        display: "flex",
        borderBottom: "1px solid #f0f0f0",
        padding: "12px 0",
        gap: "12px",
        alignItems: "flex-start",
    }}>
    <strong style={{
        flex: "0 0 40%",
        fontSize: 13,
        color: '#6b7280',
        fontWeight: 500
    }}>{label}:</strong>
    <span style={{
        flex: 1,
        fontSize: 13,
        color: '#1f2937',
        fontWeight: 400
    }}>{value ?? "-"}</span>
  </div>);
