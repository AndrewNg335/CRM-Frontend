import { useForm } from "@refinedev/antd";
import { HttpError, useInvalidate } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";
import { Button, DatePicker, Form, Space } from "antd";
import dayjs from "dayjs";
import type { Task } from "@/interfaces/task";
type Props = {
    initialValues: {
        dueDate?: Task["dueDate"];
    };
    cancelForm: () => void;
};
export const DueDateForm = ({ initialValues, cancelForm }: Props) => {
    const invalidate = useInvalidate();
    
    const { formProps, saveButtonProps } = useForm<any, HttpError, Pick<{
        dueDate?: string;
    }, "dueDate">>({
        queryOptions: {
            enabled: false,
        },
        redirect: false,
        onMutationSuccess: () => {
            invalidate({
                resource: "tasks",
                invalidates: ["list"],
            });
            cancelForm();
        },
        meta: {},
    });
    return (<div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
      <Form {...formProps} initialValues={initialValues}>
        <Form.Item noStyle name="dueDate" getValueProps={(value) => {
            if (!value)
                return { value: undefined };
            return { value: dayjs(value) };
        }}>
          <DatePicker format="YYYY-MM-DD HH:mm" showTime={{
            showSecond: false,
            format: "HH:mm",
        }} style={{ backgroundColor: "#fff" }}/>
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
    </div>);
};
