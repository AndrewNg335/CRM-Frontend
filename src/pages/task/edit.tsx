import { DescriptionForm, DescriptionHeader, DueDateForm, DueDateHeader, TitleForm, UserAssignmentForm, UserAssignmentHeader, } from "@/components";
import { Accordion } from "@/components/accodion";
import { BackButton } from "@/components/back-button";
import { Task } from "@/interfaces/task";
import { AlignLeftOutlined, FieldTimeOutlined, UserOutlined, DeleteOutlined, CheckSquareOutlined } from "@ant-design/icons";
import { DeleteButton, useModalForm } from "@refinedev/antd";
import { useNavigation, useList, useGetIdentity, useGo, useInvalidate } from "@refinedev/core";
import type { User } from "@/interfaces/user";
import { Modal, Typography, Divider, Tag } from "antd";
import { useState } from "react";

const getStageConfig = (stage?: string) => {
    const configs = {
        todo: { color: '#1890ff', bg: '#e6f7ff', text: 'Cần làm' },
        inprogress: { color: '#faad14', bg: '#fff7e6', text: 'Đang thực hiện' },
        inreview: { color: '#722ed1', bg: '#f9f0ff', text: 'Đang đánh giá' },
        reviewfailed: { color: '#f5222d', bg: '#fff2f0', text: 'Đánh giá thất bại' },
        done: { color: '#52c41a', bg: '#f6ffed', text: 'Hoàn thành' },
    };
    return configs[stage as keyof typeof configs] || { color: '#d9d9d9', bg: '#f5f5f5', text: 'Không xác định' };
};

const TasksEditPage = () => {
    const [activeKey, setActiveKey] = useState<string | undefined>();
    const { list } = useNavigation();
    const go = useGo();
    const invalidate = useInvalidate();
    const { data: currentUser } = useGetIdentity<User>();
    const isAdmin = currentUser?.role?.name === 'Admin';
    
    const { modalProps, close, query: queryResult, formProps } = useModalForm<Task>({
        resource: "tasks",
        action: "edit",
        defaultVisible: true,
        redirect: false,
        warnWhenUnsavedChanges: false,
    });
    
    // Get users list for admin
    const { data: usersData } = useList<User>({
        resource: "auth",
        pagination: { mode: 'off' },
        queryOptions: { enabled: isAdmin },
    });
    
    const record = queryResult?.data?.data;
    const isLoading = queryResult?.isLoading ?? true;
    const handleCancel = () => {
        close();
        go({
            to: "/tasks",
            type: "replace",
        });
    };

    const stageConfig = getStageConfig(record?.stage);

    return (
        <Modal 
            {...modalProps} 
            centered 
            onCancel={handleCancel} 
            width={720}
            title={null}
            footer={null}
            styles={{ 
                body: { 
                    padding: 0,
                    maxHeight: "85vh", 
                    overflowY: "auto" 
                } 
            }}
            className="task-detail-modal"
        >
            <div style={{ background: '#f0f9ff', padding: '24px', borderRadius: '8px 8px 0 0', borderBottom: '1px solid #e0f2fe' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <CheckSquareOutlined style={{ color: '#475569', fontSize: '20px' }} />
                                <Typography.Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                                  Chi tiết Task
                                </Typography.Text>
                            </div>
                            <BackButton size="small" />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <TitleForm initialValues={{ title: record?.title || "" }} isLoading={isLoading}/>
                        </div>
                        <Tag 
                            style={{ 
                                background: stageConfig.bg, 
                                color: stageConfig.color, 
                                border: `1px solid ${stageConfig.color}`,
                                borderRadius: '16px',
                                padding: '4px 12px',
                                fontWeight: 500
                            }}
                        >
                            {stageConfig.text}
                        </Tag>
                    </div>
                </div>
            </div>

            <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <Accordion 
                        accordionKey="description" 
                        activeKey={activeKey} 
                        setActive={setActiveKey} 
                        fallback={<DescriptionHeader description={record?.description || ""}/>} 
                        isLoading={isLoading} 
                        icon={<AlignLeftOutlined style={{ color: '#1890ff' }} />} 
                        label="Mô tả"
                    >
                        <DescriptionForm initialValues={{ description: record?.description || "" }} cancelForm={() => setActiveKey(undefined)}/>
                    </Accordion>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <Accordion 
                        accordionKey="due-date" 
                        activeKey={activeKey} 
                        setActive={setActiveKey} 
                        fallback={<DueDateHeader dueData={record?.dueDate || ""}/>} 
                        isLoading={isLoading} 
                        icon={<FieldTimeOutlined style={{ color: '#faad14' }} />} 
                        label="Hạn chót"
                    >
                        <DueDateForm initialValues={{
                            dueDate: record?.dueDate,
                        }} cancelForm={() => setActiveKey(undefined)}/>
                    </Accordion>
                </div>

                {isAdmin && (
                    <div style={{ marginBottom: '24px' }}>
                        <Accordion 
                            accordionKey="user-assignment" 
                            activeKey={activeKey} 
                            setActive={setActiveKey} 
                            fallback={<UserAssignmentHeader userId={record?.userId} userList={usersData?.data || []}/>} 
                            isLoading={isLoading} 
                            icon={<UserOutlined style={{ color: '#722ed1' }} />} 
                            label="Người được giao"
                        >
                            <UserAssignmentForm initialValues={{
                                userId: record?.userId,
                            }} cancelForm={() => setActiveKey(undefined)}/>
                        </Accordion>
                    </div>
                )}

                <Divider style={{ margin: '24px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography.Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                    </Typography.Text>
                    <DeleteButton 
                        resource="tasks" 
                        recordItemId={record?._id} 
                        type="primary"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onSuccess={() => {
                            // Invalidate both admin and user-specific task lists
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
                            go({ to: "/tasks", type: "replace" });
                        }}
                    >
                        Xóa Task
                    </DeleteButton>
                </div>
            </div>
        </Modal>
    );
};
export default TasksEditPage;
