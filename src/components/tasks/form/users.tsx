import { useForm, useSelect } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";

import { Button, Form, Select, Space } from "antd";

type UsersSelectQuery = any;

type Props = {
  initialValues: {
    userIds?: { label: string; value: string }[];
  };
  cancelForm: () => void;
};

export const UsersForm = ({ initialValues, cancelForm }: Props) => {
  // use the useForm hook to manage the form to add users to a task (assign task to users)
  const { formProps, saveButtonProps } = useForm<any, HttpError, Pick<{ userIds?: string[] }, "userIds">>({
    queryOptions: {
      // disable the query to prevent fetching data on component mount
      enabled: false,
    },
    redirect: false, // disable redirection
    onMutationSuccess: () => {
      // when the mutation is successful, call the cancelForm function to close the form
      cancelForm();
    },
    // perform the mutation when the form is submitted
    meta: {},
  });

  // use the useSelect hook to fetch the list of users from the server and display them in a select component
  const { selectProps } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    // specify the resource from which we want to fetch the data
    resource: "users",
    // specify the query that should be performed
    meta: {},
    // specify the label for the select component
    optionLabel: (item: any) => item?.name,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "end",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <Form
        {...formProps}
        style={{ width: "100%" }}
        initialValues={initialValues}
      >
        <Form.Item noStyle name="userIds">
          <Select
            {...selectProps}
            className="kanban-users-form-select"
            dropdownStyle={{ padding: "0px" }}
            style={{ width: "100%" }}
            mode="multiple"
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
