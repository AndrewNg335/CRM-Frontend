

import { useState } from "react";
import { DeleteButton, useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { AlignLeftOutlined, FieldTimeOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Modal, Button, Space } from "antd";
import dayjs from "dayjs";

import {
  DescriptionForm,
  DescriptionHeader,
  DueDateForm,
  DueDateHeader,
  TitleForm,
  UsersForm,
  UsersHeader,
} from "@/components";
import { Accordion } from "@/components/accodion";
import { Task } from "@/interfaces/task";


const TasksEditPage = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>();
  const { list } = useNavigation();

  const { modalProps, close, query: queryResult } = useModalForm<Task>({
    resource: "tasks",
    action: "edit",
    defaultVisible: true,
    redirect: false,
  });

  const record = queryResult?.data?.data;
  const isLoading = queryResult?.isLoading ?? true;

  console.log("data:", record)

  return (
    <Modal
      {...modalProps}
      className="kanban-update-modal"
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title={<TitleForm initialValues={{ title: record?.title || "" }} isLoading={isLoading} />}
      width={586}
      footer={
        <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <DeleteButton
            resource="tasks"
            recordItemId={record?._id}
            type="link"
            onSuccess={() => list("tasks", "replace")}
          >
            Delete card
          </DeleteButton>
        </Space>
      }
    >
      <Accordion
        accordionKey="description"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DescriptionHeader description={record?.description || ""} />}
        isLoading={isLoading}
        icon={<AlignLeftOutlined />}
        label="Description"
      >
        <DescriptionForm
          initialValues={{ description: record?.description || "" }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>

      <Accordion
        accordionKey="due-date"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DueDateHeader dueData={record?.dueDate || ""} />}
        isLoading={isLoading}
        icon={<FieldTimeOutlined />}
        label="Due date"
      >
        <DueDateForm
          initialValues={{
            dueDate: record?.dueDate,
          }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>

      <Accordion
        accordionKey="users"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<UsersHeader users={record?.users || []} />}
        isLoading={isLoading}
        icon={<UsergroupAddOutlined />}
        label="Users"
      >
        <UsersForm
          initialValues={{
            userIds:
              record?.users?.map((user) => ({
                label: user.name,
                value: user.id,
              })) || [],
          }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>
    </Modal>
  );
};

export default TasksEditPage;
