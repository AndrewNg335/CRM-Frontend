import { useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
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
  // use the useForm hook to manage the form
  // formProps contains all the props that we need to pass to the form (initialValues, onSubmit, etc.)
  // saveButtonProps contains all the props that we need to pass to the save button
  const { formProps, saveButtonProps } = useForm<any, HttpError, Pick<{ description?: string }, "description">>({
    queryOptions: {
      // we are disabling the query because we don't want to fetch the data on component mount.
      enabled: false, // disable the query
    },
    redirect: false, // disable redirection
    // when the mutation is successful, call the cancelForm function to close the form
    onMutationSuccess: () => {
      cancelForm();
    },
    // specify the mutation that should be performed
    meta: {},
  });

  return (
    <>
      <Form {...formProps} initialValues={initialValues}>
        <Form.Item noStyle name="description">
          <MDEditor preview="edit" data-color-mode="light" height={250} />
        </Form.Item>
      </Form>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          marginTop: "12px",
        }}
      >
        <Space>
          <Button type="default" onClick={cancelForm}>
            Cancel
          </Button>
          <Button {...saveButtonProps} type="primary">
            Save
          </Button>
        </Space>
      </div>
    </>
  );
};
