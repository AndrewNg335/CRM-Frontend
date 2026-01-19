import React from "react";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { useDroppable, type UseDroppableArguments } from "@dnd-kit/core";
import { Badge, Button, Skeleton, Space } from "antd";
import { Text } from "@/components/text";
type Props = {
    id: string;
    title: string;
    description?: React.ReactNode;
    count: number;
    data?: UseDroppableArguments["data"];
    onAddClick?: (args: {
        id: string;
    }) => void;
};
export const KanbanColumn = ({ children, id, title, description, count, data, }: React.PropsWithChildren<Props>) => {
    const { isOver, setNodeRef, active } = useDroppable({
        id,
        data,
    });
    return (<div ref={setNodeRef} style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "215px",
            maxWidth: "215px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            margin: "0 4px",
        }}>
      <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
        }}>
        <Space style={{
            width: "100%",
            justifyContent: "space-between",
        }}>
          <Space>
            <Text ellipsis={{ tooltip: title }} size="xs" strong style={{
            textTransform: "uppercase",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
        }}>
              {title}
            </Text>
            {!!count && <Badge count={count} color="blue"/>}
          </Space>
        </Space>
        {description}
      </div>
      <div style={{
            flex: 1,
            overflowY: active ? "unset" : "auto",
            border: "2px dashed transparent",
            borderColor: isOver ? "#00000040" : "transparent",
            borderRadius: "4px",
        }}>
        <div style={{
            marginTop: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
        }}>
          {children}
        </div>
      </div>
    </div>);
};
export const KanbanColumnSkeleton = ({ children }: React.PropsWithChildren) => {
    return (<div style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 16px",
        }}>
      <div style={{
            padding: "12px",
        }}>
        <Space style={{
            width: "100%",
            justifyContent: "space-between",
        }}>
          <Skeleton.Button size="small" style={{ width: "125px" }}/>
          <Button disabled type="text" shape="circle" icon={<MoreOutlined style={{
                transform: "rotate(90deg)",
            }}/>}/>
          <Button disabled shape="circle" icon={<PlusOutlined />}/>
        </Space>
      </div>
      <div style={{
            flex: 1,
            border: "2px dashed transparent",
            borderRadius: "4px",
        }}>
        <div style={{
            marginTop: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
        }}>
          {children}
        </div>
      </div>
    </div>);
};