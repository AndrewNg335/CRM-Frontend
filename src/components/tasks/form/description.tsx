import { useForm } from "@refinedev/antd";
import { HttpError, useInvalidate } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";
import MDEditor from "@uiw/react-md-editor";
import { Button, Form, Space } from "antd";
import type { Task } from "@/interfaces/task";
type Props = {
    initialValues: {
        description?: Task["description"];
    };
    cancelForm: () => void;
};
export const DescriptionForm = ({ initialValues, cancelForm }: Props) => {
    const invalidate = useInvalidate();
    
    const { formProps, saveButtonProps } = useForm<any, HttpError, Pick<{
        description?: string;
    }, "description">>({
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
    return (<>
      <Form {...formProps} initialValues={initialValues}>
        <Form.Item noStyle name="description">
          <MDEditor preview="edit" data-color-mode="light" height={250}/>
        </Form.Item>
      </Form>
      <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            marginTop: "12px",
        }}>
        <Space>
          <Button type="default" onClick={cancelForm}>
            Hủy
          </Button>
          <Button {...saveButtonProps} type="primary">
            Lưu
          </Button>
        </Space>
      </div>
    </>);
};
