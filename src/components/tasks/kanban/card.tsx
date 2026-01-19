import { memo, useMemo } from "react";
import { useDelete, useNavigation, useInvalidate, useGetIdentity } from "@refinedev/core";
import { ClockCircleOutlined, DeleteOutlined, EyeOutlined, MoreOutlined, } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Card, ConfigProvider, Dropdown, Skeleton, Space, Tag, theme, Tooltip, } from "antd";
import dayjs from "dayjs";
import { TextIcon } from "@/components/text-icon";
import { getDateColor } from "@/utilities";
import { UserOutlined } from "@ant-design/icons";
import type { User } from "@/interfaces/user";
type ProjectCardProps = {
    id: string;
    title: string;
    updatedAt?: string;
    dueDate?: string;
};
export const ProjectCard = ({ id, title, dueDate, }: ProjectCardProps) => {
    const { token } = theme.useToken();
    const { edit } = useNavigation();
    const { mutate } = useDelete();
    const invalidate = useInvalidate();
    const { data: currentUser } = useGetIdentity<User>();
    const isAdmin = currentUser?.role?.name === 'Admin';
    const dropdownItems = useMemo(() => {
        const dropdownItems: MenuProps["items"] = [
            {
                label: "Xem thẻ",
                key: "1",
                icon: <EyeOutlined />,
                onClick: () => {
                    edit("tasks", id, "replace");
                },
            },
            {
                danger: true,
                label: "Xóa thẻ",
                key: "2",
                icon: <DeleteOutlined />,
                onClick: () => {
                    mutate({
                        resource: "tasks",
                        id,
                        meta: {
                            operation: "task",
                        },
                    }, {
                        onSuccess: () => {
                            invalidate({
                                resource: "tasks",
                                invalidates: ["list"],
                            });
                            if (!isAdmin && currentUser?._id) {
                                invalidate({
                                    resource: `tasks/user/${currentUser._id}`,
                                    invalidates: ["list"],
                                });
                            }
                        }
                    });
                },
            },
        ];
        return dropdownItems;
    }, [mutate, invalidate, isAdmin, currentUser?._id, edit, id]);
    const dueDateOptions = useMemo(() => {
        if (!dueDate)
            return null;
        const date = dayjs(dueDate);
        return {
            color: getDateColor({ date: dueDate }) as string,
            text: date.format("MMM D"),
        };
    }, [dueDate]);
    return (<ConfigProvider theme={{
            components: {
                Tag: {
                    colorText: token.colorTextSecondary,
                },
                Card: {
                    headerBg: "transparent",
                },
            },
        }}>
      <Card size="small" title={<div style={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
            }}>
            {title}
          </div>} onClick={() => {
            edit("tasks", id, "replace");
        }} extra={<Dropdown trigger={["click"]} menu={{
                items: dropdownItems,
                onPointerDown: (e) => {
                    e.stopPropagation();
                },
                onClick: (e) => {
                    e.domEvent.stopPropagation();
                },
            }} placement="bottom" arrow={{ pointAtCenter: true }}>
            <Button type="text" shape="circle" icon={<MoreOutlined style={{
                    transform: "rotate(90deg)",
                }}/>} onPointerDown={(e) => {
                e.stopPropagation();
            }} onClick={(e) => {
                e.stopPropagation();
            }}/>
          </Dropdown>}>
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px",
        }}>
          <TextIcon style={{
            marginRight: "4px",
        }}/>
          {dueDateOptions && (<Tag icon={<ClockCircleOutlined style={{
                    fontSize: "12px",
                }}/>} style={{
                padding: "0 4px",
                marginInlineEnd: "0",
                backgroundColor: dueDateOptions.color === "default" ? "transparent" : "unset",
            }} color={dueDateOptions.color} bordered={dueDateOptions.color !== "default"}>
              {dueDateOptions.text}
            </Tag>)}
        </div>
      </Card>
    </ConfigProvider>);
};
export const ProjectCardSkeleton = () => {
    return (<Card size="small" bodyStyle={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
        }} title={<Skeleton.Button active size="small" style={{
                width: "200px",
                height: "22px",
            }}/>}>
      <Skeleton.Button active size="small" style={{
            width: "200px",
        }}/>
      <Skeleton.Avatar active size="small"/>
    </Card>);
};
export const ProjectCardMemo = memo(ProjectCard, (prev, next) => {
    return (prev.id === next.id &&
        prev.title === next.title &&
        prev.dueDate === next.dueDate &&
        prev.updatedAt === next.updatedAt);
});