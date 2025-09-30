import React from "react";

import { useForm } from "@refinedev/antd";
import { HttpError, useInvalidate } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { Form, Skeleton } from "antd";

import { Text } from "@/components";
import type { Task } from "@/interfaces/task";

const TitleInput = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const onTitleChange = (newTitle: string) => {
    onChange?.(newTitle);
  };

  return (
    <Text
      editable={{
        onChange: onTitleChange,
      }}
      style={{ width: "98%" }}
    >
      {value}
    </Text>
  );
};

type Props = {
  initialValues: {
    title?: Task["title"];
  };
  isLoading?: boolean;
};

export const TitleForm = ({ initialValues, isLoading }: Props) => {
  /**
   * useInvalidate is used to invalidate the state of a particular resource or dataProvider
   * Means, it will refetch the data from the server and update the state of the resource or dataProvider. We can also specify which part of the state we want to invalidate.
   * We typically use this hook when we want to refetch the data from the server after a mutation is successful.
   *
   * https://refine.dev/docs/data/hooks/use-invalidate/
   */
  const invalidate = useInvalidate();

  // use the useForm hook to manage the form for adding a title to a task
  const { formProps } = useForm<any, HttpError, Pick<{ title?: string }, "title">>({
    queryOptions: { enabled: false },
    redirect: false,
    warnWhenUnsavedChanges: false,
    autoSave: { enabled: true },
    onMutationSuccess: () => {
      invalidate({ invalidates: ["list"], resource: "tasks" });
    },
    meta: {},
  });

  // set the title of the form to the title of the task
  React.useEffect(() => {
    formProps.form?.setFieldsValue(initialValues);
  }, [initialValues.title]);

  if (isLoading) {
    return (
      <Skeleton.Input
        size="small"
        style={{ width: "95%", height: "22px" }}
        block
      />
    );
  }

  return (
    <Form {...formProps} initialValues={initialValues}>
      <Form.Item noStyle name="title">
        <TitleInput />
      </Form.Item>
    </Form>
  );
};
