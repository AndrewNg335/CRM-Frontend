import { MarkdownField } from "@refinedev/antd";
import { Typography, Space, Tag } from "antd";
import dayjs from "dayjs";
import { Text, UserTag } from "@/components";
import { getDateColor } from "@/utilities";
import type { Task } from "@/interfaces/task";
type DescriptionProps = {
    description?: Task["description"];
};
type DueDateProps = {
    dueData?: Task["dueDate"];
};
export const DescriptionHeader = ({ description }: DescriptionProps) => {
    if (description) {
        return (<Typography.Paragraph ellipsis={{ rows: 8 }}>
        <MarkdownField value={description}/>
      </Typography.Paragraph>);
    }
    return <Typography.Link>Thêm mô tả task</Typography.Link>;
};
export const DueDateHeader = ({ dueData }: DueDateProps) => {
    if (dueData) {
        const color = getDateColor({
            date: dueData,
            defaultColor: "processing",
        });
        const getTagText = () => {
            switch (color) {
                case "error":
                    return "Quá hạn";
                case "warning":
                    return "Sắp hết hạn";
                default:
                    return "Đang xử lý";
            }
        };
        return (<Space size={[0, 8]}>
        <Tag color={color}>{getTagText()}</Tag>
        <Text>{dayjs(dueData).format("MMMM D, YYYY - h:ma")}</Text>
      </Space>);
    }
    return <Typography.Link>Thêm hạn chót</Typography.Link>;
};