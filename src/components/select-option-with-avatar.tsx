import { UserOutlined } from "@ant-design/icons";
import { Text } from "./text";
type Props = {
    name: string;
    avatarUrl?: string;
    shape?: "circle" | "square";
};
export const SelectOptionWithAvatar = ({ avatarUrl, name, shape }: Props) => {
    return (<div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
        }}>
      <span style={{
            width: 24,
            height: 24,
            background: "#E6F4FF",
            borderRadius: shape === "circle" ? "50%" : 6,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
        <UserOutlined style={{ color: "#1677ff", fontSize: 14 }}/>
      </span>
      <Text>{name}</Text>
    </div>);
};