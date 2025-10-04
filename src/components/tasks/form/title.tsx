import React from "react";
import { useForm } from "@refinedev/antd";
import { HttpError, useInvalidate } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";
import { Form, Skeleton } from "antd";
import { Text } from "@/components";
import type { Task } from "@/interfaces/task";
const TitleInput = ({ value, onChange, }: {
    value?: string;
    onChange?: (value: string) => void;
}) => {
    const onTitleChange = (newTitle: string) => {
        onChange?.(newTitle);
    };
    return (<Text editable={{
            onChange: onTitleChange,
        }} style={{ 
            width: "98%", 
            color: '#1e293b', 
            fontSize: '24px', 
            fontWeight: 600,
            lineHeight: '32px'
        }}>
      {value}
    </Text>);
};
type Props = {
    initialValues: {
        title?: Task["title"];
    };
    isLoading?: boolean;
};
export const TitleForm = ({ initialValues, isLoading }: Props) => {
    const invalidate = useInvalidate();
    const { formProps } = useForm<any, HttpError, Pick<{
        title?: string;
    }, "title">>({
        queryOptions: { enabled: false },
        redirect: false,
        warnWhenUnsavedChanges: false,
        autoSave: { enabled: true },
        onMutationSuccess: () => {
            invalidate({ invalidates: ["list"], resource: "tasks" });
        },
        meta: {},
    });
    React.useEffect(() => {
        formProps.form?.setFieldsValue(initialValues);
    }, [initialValues.title]);
    if (isLoading) {
        return (<Skeleton.Input size="small" style={{ width: "95%", height: "22px" }} block/>);
    }
    return (<Form {...formProps} initialValues={initialValues}>
      <Form.Item noStyle name="title">
        <TitleInput />
      </Form.Item>
    </Form>);
};
