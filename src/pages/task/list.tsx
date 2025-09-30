import React from "react";
import { KanbanColumnSkeleton, ProjectCardSkeleton } from "@/components";
import { KanbanAddCardButton } from "@/components/tasks/kanban/add-card-button";
import { KanbanBoard, KanbanBoardContainer } from "@/components/tasks/kanban/board";
import { ProjectCardMemo } from "@/components/tasks/kanban/card";
import { KanbanColumn } from "@/components/tasks/kanban/column";
import { KanbanItem } from "@/components/tasks/kanban/item";
import { DragEndEvent } from "@dnd-kit/core";
import { HttpError, useGo, useList, useUpdate } from "@refinedev/core";
import { Space } from "antd";
import { Task } from "@/interfaces/task";
import { useModalForm } from "@refinedev/antd";

export const STAGES = [
  { id: "todo", title: "Cần làm" },
  { id: "inprogress", title: "Đang thực hiện" },
  { id: "reviewfailed", title: "Đánh giá thất bại" },
  { id: "inreview", title: "Đang đánh giá" },
  { id: "done", title: "Hoàn thành" },
];

const List = ({ children }: React.PropsWithChildren) => {
  const go = useGo();

  // Lấy danh sách task
  const { data: tasks, isLoading: isLoadingTasks, refetch } = useList<Task>({
    resource: "tasks",
    sorters: [{ field: "dueDate", order: "asc" }],
    pagination: { mode: "off" },
  });

  // Update stage khi kéo thả
  const { mutate: updateTask } = useUpdate<Task, HttpError>({
    resource: "tasks",
    mutationMode: "optimistic",
    successNotification: false,
  });

  const {
    formProps,
    modalProps,
    show,
  } = useModalForm({
    action: "create",
    resource: "tasks",
    redirect: false,
    mutationMode: "pessimistic",
  });

  const taskStages = React.useMemo(() => {
    if (!tasks?.data) {
      return [] as (typeof STAGES[number] & { tasks: Task[] })[];
    }

    const grouped = STAGES.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stage === stage.id),
    }));

    return grouped;
  }, [tasks]);


  const isLoading = isLoadingTasks;

  if (isLoading) return <PageSkeleton />;

  const handleOnDragEnd = (event: DragEndEvent) => {
    const stage = event.over?.id as string | null;
    const taskId = event.active.id as string;
    const currentStage = event.active.data.current?.stage;

    if (currentStage === stage) return;

    updateTask(
      { id: taskId, values: { stage } },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };


  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button
          onClick={() => go({ to: "/tasks/new", type: "replace" })}
          className="professional-button"
          style={{
            padding: "8px 16px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 500,
            transition: "all 0.2s ease",
          }}
        >
          Thêm mới nhiệm vụ
        </button>
      </div>
      <div 
      >
        <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          {taskStages.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={column.tasks.length}
            >
              {isLoading && <ProjectCardSkeleton />}
              {!isLoading &&
                column.tasks.map((task) => (
                  <KanbanItem key={task._id} id={task._id} data={{ ...task }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <ProjectCardMemo id={task._id} title={task.title} dueDate={task.dueDate || undefined} />

                    </Space>
                  </KanbanItem>
                ))}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
      </div>
      
      {children}
    </>
  );
};

export default List;

const PageSkeleton = () => {
  const columnCount = STAGES.length; 
  const itemCount = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, index) => (
        <KanbanColumnSkeleton key={index}>
          {Array.from({ length: itemCount }).map((_, idx) => (
            <ProjectCardSkeleton key={idx} />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};
