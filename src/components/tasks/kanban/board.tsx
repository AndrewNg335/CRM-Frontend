import React from "react";

import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

type Props = {
  onDragEnd: (event: DragEndEvent) => void;
};

export const KanbanBoard = ({
  onDragEnd,
  children,
}: React.PropsWithChildren<Props>) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over === null) {
      return;
    }

    onDragEnd(event);
  };

  return (
    <KanbanBoardContainer>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        {children}
      </DndContext>
    </KanbanBoardContainer>
  );
};

export const KanbanBoardContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div
    style={{
      display: "flex",
      justifyContent: "center",  
      alignItems: "flex-start", 
      width: "100%",
      minHeight: "100vh",            
      background: "#f5f5f5",     
    }}
    >
      <div
        style={{
          // maxWidth: "1200px", 
          maxWidth: "100%",
          height: "100%",
          display: "flex",
   
        }}
      >
        {children}
      </div>
    </div>
  );
};
