import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Spin, message } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { useInvalidate, useGetIdentity } from "@refinedev/core";
import { clearProfileCache } from "../../providers/auth";
import { Text } from "../text";
import type { User } from "@/interfaces/user";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
type Props = {
    opened: boolean;
    setOpened: (opened: boolean) => void;
    userId: string;
};
export const AccountSettings = ({ opened, setOpened, userId }: Props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);
    const invalidate = useInvalidate();
    const { data: cachedUser } = useGetIdentity<User>();
    const isAdmin = userData?.role?.name === 'Admin';
    const closeModal = () => {
        setOpened(false);
    };
    useEffect(() => {
        if (opened) {
            if (cachedUser) {
                setUserData(cachedUser);
                form.setFieldsValue({
                    name: cachedUser.name || '',
                    email: cachedUser.email || '',
                    phone: cachedUser.phone || '',
                    address: cachedUser.address || '',
                    role: cachedUser.role?.name || '',
                });
            } else {
                fetchUserProfile();
            }
        }
    }, [opened, cachedUser]);
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userData = response.data.user;
            setUserData(userData);
            form.setFieldsValue({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                role: userData.role?.name || '',
            });
        }
        catch (error) {
            
            message.error("Không thể tải thông tin người dùng");
        }
        finally {
            setLoading(false);
        }
    };
    const handleUpdateProfile = async (values: any) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const updateData = isAdmin ? {
                name: values.name,
                phone: values.phone,
                address: values.address
            } : {
                phone: values.phone,
                address: values.address
            };
            if (isAdmin) {
                await axios.put(`${API_URL}/auth/adminUpdate/${userId}`, updateData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            else {
                await axios.put(`${API_URL}/auth/userUpdate/${userId}`, updateData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            clearProfileCache();
            
            await invalidate({
                resource: "auth",
                invalidates: ["list", "detail"],
            });
            window.dispatchEvent(new CustomEvent('userProfileUpdated'));
            message.success("Cập nhật thông tin thành công");
            closeModal();
        }
        catch (error) {
            
            message.error("Cập nhật thông tin thất bại");
        }
        finally {
            setLoading(false);
        }
    };
    if (loading && !userData) {
        return (<Drawer open={opened} width={756} styles={{
                body: {
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            }}>
        <Spin />
      </Drawer>);
    }
    return (<Drawer onClose={closeModal} open={opened} width={756} styles={{
            body: { background: "#f5f5f5", padding: 0 },
            header: { display: "none" },
        }}>
      <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            backgroundColor: "#fff",
        }}>
        <Text strong>Cài đặt tài khoản</Text>
        <Button type="text" icon={<CloseOutlined />} onClick={() => closeModal()}/>
      </div>
      <div style={{
            padding: "16px",
        }}>
        <Card>
          {!isAdmin && (<div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae6fd' }}>
              <Text style={{ fontSize: '13px', color: '#0369a1' }}>
                💡 Bạn có thể cập nhật Số điện thoại và Địa chỉ. Các thông tin khác cần liên hệ quản trị viên.
              </Text>
            </div>)}
          <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
            <div style={{ marginBottom: 16 }}>
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
            </div>
            <Form.Item label="Tên" name="name">
              <Input placeholder="Tên" disabled style={{ backgroundColor: '#f5f5f5' }}/>
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" disabled={true} style={{ backgroundColor: '#f5f5f5' }}/>
            </Form.Item>
            <Form.Item label="Vai trò" name="role">
              <Input placeholder="Chức vụ" disabled style={{ backgroundColor: '#f5f5f5' }}/>
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone" rules={[
            { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ!' }
        ]}>
              <Input placeholder="Số điện thoại"/>
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
              <Input placeholder="Địa chỉ"/>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{
            display: "block",
            marginLeft: "auto",
        }}>
              Cập nhật
            </Button>
          </Form>
        </Card>
      </div>
    </Drawer>);
};