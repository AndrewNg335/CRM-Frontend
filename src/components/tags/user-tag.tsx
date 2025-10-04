import { Space, Tag } from "antd";
import type { User } from "@/interfaces/user";
import { UserOutlined } from "@ant-design/icons";
type Props = {
    user: User;
};
export const UserTag = ({ user }: Props) => {
    return (<Tag key={user.id} style={{
            padding: 2,
            paddingRight: 8,
            borderRadius: 24,
            lineHeight: "unset",
            marginRight: "unset",
        }}>
      <Space size={4}>
        <span style={{
            width: 24,
            height: 24,
            background: "#E6F4FF",
            borderRadius: 6,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
          <UserOutlined style={{ color: "#1677ff", fontSize: 14 }}/>
        </span>
        {user.name}
      </Space>
    </Tag>);
};
