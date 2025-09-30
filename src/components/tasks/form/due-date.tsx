import { useForm } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
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
  // use the useForm hook to manage the form
  // formProps contains all the props that we need to pass to the form (initialValues, onSubmit, etc.)
  // saveButtonProps contains all the props that we need to pass to the save button
  const { formProps, saveButtonProps } = useForm<any, HttpError, Pick<{ dueDate?: string }, "dueDate">>({
    queryOptions: {
      // disable the query to prevent fetching data on component mount
      enabled: false,
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Form {...formProps} initialValues={initialValues}>
        <Form.Item
          noStyle
          name="dueDate"
          getValueProps={(value) => {
            if (!value) return { value: undefined };
            return { value: dayjs(value) };
          }}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{
              showSecond: false,
              format: "HH:mm",
            }}
            style={{ backgroundColor: "#fff" }}
          />
        </Form.Item>
      </Form>
      <Space>
        <Button type="default" onClick={cancelForm}>
          Cancel
        </Button>
        <Button {...saveButtonProps} type="primary">
          Save
        </Button>
      </Space>
    </div>
  );
};
