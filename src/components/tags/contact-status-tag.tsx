import React from "react";
import { CheckCircleOutlined, MinusCircleOutlined, PlayCircleFilled, PlayCircleOutlined, } from "@ant-design/icons";
import { Tag, TagProps } from "antd";
type ContactStatus = "NEW" | "CONTACTED" | "INTERESTED" | "UNQUALIFIED" | "QUALIFIED" | "NEGOTIATION" | "LOST" | "WON" | "CHURNED";
type Props = {
    status: ContactStatus;
};
export const ContactStatusTag = ({ status }: Props) => {
    let icon: React.ReactNode = null;
    let color: TagProps["color"] = undefined;
    let label: string = "";
    
    switch (status) {
        case "NEW":
            icon = <PlayCircleOutlined />;
            color = "blue";
            label = "Mới";
            break;
        case "CONTACTED":
            icon = <PlayCircleOutlined />;
            color = "blue";
            label = "Đã liên hệ";
            break;
        case "INTERESTED":
            icon = <PlayCircleOutlined />;
            color = "blue";
            label = "Quan tâm";
            break;
        case "UNQUALIFIED":
            icon = <PlayCircleOutlined />;
            color = "red";
            label = "Không đủ điều kiện";
            break;
        case "QUALIFIED":
            icon = <PlayCircleFilled />;
            color = "green";
            label = "Đủ điều kiện";
            break;
        case "NEGOTIATION":
            icon = <PlayCircleFilled />;
            color = "green";
            label = "Đang thương lượng";
            break;
        case "LOST":
            icon = <PlayCircleFilled />;
            color = "red";
            label = "Thất bại";
            break;
        case "WON":
            icon = <CheckCircleOutlined />;
            color = "green";
            label = "Thành công";
            break;
        case "CHURNED":
            icon = <MinusCircleOutlined />;
            color = "red";
            label = "Rời bỏ";
            break;
        default:
            label = status;
            break;
    }
    return (<Tag color={color}>
      {icon} {label}
    </Tag>);
};