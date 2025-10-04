import { useForm, useSelect } from "@refinedev/antd";
import { HttpError, useGetIdentity, useInvalidate } from "@refinedev/core";
import { Button, Form, Select, Space } from "antd";
import type { User } from "@/interfaces/user";
import React from "react";

type Props = {
    initialValues: {
        userId?: string;
    };
    cancelForm: () => void;
};

export const UserAssignmentForm = ({ initialValues, cancelForm }: Props) => {
    const { data: currentUser } = useGetIdentity<User>();
    const isAdmin = currentUser?.role?.name === 'Admin';
    const invalidate = useInvalidate();

    const { formProps, saveButtonProps } = useForm<any, HttpError, Pick<{
        userId?: string;
    }, "userId">>({
        queryOptions: {
            enabled: false,
        },
        redirect: false,
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
            cancelForm();
        },
        meta: {},
    });

    const { selectProps: userSelectProps } = useSelect({
        resource: "auth",
        optionLabel: "name",
        optionValue: "_id",
        pagination: { mode: 'off' },
        queryOptions: { enabled: isAdmin },
    });

    return (
        <div style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: "12px",
        }}>
            <Form {...formProps} style={{ width: "100%" }} initialValues={initialValues}>
                <Form.Item noStyle name="userId">
                    <Select 
                        {...userSelectProps} 
                        className="kanban-users-form-select" 
                        dropdownStyle={{ padding: "0px" }} 
                        style={{ width: "100%" }}
                        placeholder="Chọn người được giao"
                        disabled={!isAdmin}
                    />
                </Form.Item>
            </Form>
            <Space>
                <Button type="default" onClick={cancelForm}>
                    Hủy
                </Button>
                <Button {...saveButtonProps} type="primary">
                    Lưu
                </Button>
            </Space>
        </div>
    );
};

type UserAssignmentHeaderProps = {
    userId?: string;
    userList?: Array<{ _id: string; name: string; }>;
};

export const UserAssignmentHeader = ({ userId, userList }: UserAssignmentHeaderProps) => {
    if (userId && userList) {
        const assignedUser = userList.find(user => user._id === userId);
        if (assignedUser) {
            return (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                        width: 24,
                        height: 24,
                        background: "#E6F4FF",
                        borderRadius: 6,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#1677ff"
                    }}>
                        {assignedUser.name.charAt(0).toUpperCase()}
                    </span>
                    <span>{assignedUser.name}</span>
                </div>
            );
        }
    }
    return <span style={{ color: "#999" }}>Chưa giao cho ai</span>;
};
