import { Reminder } from "@/interfaces/reminder";
import { useOne, useGo, useGetIdentity } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { useModalForm } from "@refinedev/antd";
import { ReminderEditModal } from "@/components/modal";
import type { User } from "@/interfaces/user";
import { Card, Col, Row, Typography, Tag, Space, Button, Statistic, Timeline, Avatar, Divider } from "antd";
import { BellOutlined, EditOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, ExclamationCircleOutlined, TagOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useParams } from "react-router";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

export const ReminderShow = () => {
  const { id } = useParams();
  const go = useGo();
  const { data: currentUser } = useGetIdentity<User>();
  const isAdmin = currentUser?.role?.name === 'Admin';

  const { data, isLoading } = useOne<Reminder>({
    resource: "reminders",
    id,
  });

  const reminder = data?.data;
  // Edit reminder modal
  const {
    formProps: editFormProps,
    modalProps: editModalProps,
    show: showEditModal,
  } = useModalForm({
    action: "edit",
    resource: "reminders",
    id: reminder?._id,
    redirect: false,
    mutationMode: "pessimistic",
  });

  // Fetch related names
  const { data: leadData } = useOne({
    resource: "leads",
    id: reminder?.leadId,
    queryOptions: { enabled: Boolean(reminder?.leadId) },
  });

  const { data: userData } = useOne({
    resource: "auth",
    id: reminder?.userId,
    meta: { customUrl: reminder?.userId ? `http://localhost:3000/auth/${reminder.userId}` : undefined },
    queryOptions: { enabled: Boolean(reminder?.userId) },
  });

  // Select props for modal (match list page)
  const { selectProps: leadSelectProps } = useSelect({
    resource: "leads",
    optionLabel: "name",
    optionValue: "_id",
  });

  const { selectProps: ownerSelectProps } = useSelect({
    resource: "auth",
    optionLabel: "name",
    optionValue: "_id",
    pagination: { mode: 'off' },
    queryOptions: { enabled: isAdmin },
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'orange';
      case 'LOW': return 'blue';
      default: return 'default';
    }
  };

  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'HIGH': return 'Cao';
      case 'MEDIUM': return 'Trung bình';
      case 'LOW': return 'Thấp';
      default: return priority || '-';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'HIGH':
        return <ExclamationCircleOutlined className="mr-1" />;
      case 'MEDIUM':
        return <ExclamationCircleOutlined className="mr-1" />;
      case 'LOW':
        return <ExclamationCircleOutlined className="mr-1" />;
      default:
        return <ExclamationCircleOutlined className="mr-1" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'DONE': return 'green';
      case 'PENDING': return 'gold';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'DONE': return 'Hoàn thành';
      case 'PENDING': return 'Chờ xử lý';
      case 'CANCELLED': return 'Đã hủy';
      default: return status || '-';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'DONE':
        return <CheckCircleOutlined className="mr-1" />;
      case 'PENDING':
        return <ClockCircleOutlined className="mr-1" />;
      case 'CANCELLED':
        return <CloseCircleOutlined className="mr-1" />;
      default:
        return <ClockCircleOutlined className="mr-1" />;
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!reminder) {
    return (
      <div className="page-container">
        <Card>
          <div className="text-center py-8">
            <Text type="secondary">Không tìm thấy nhắc nhở</Text>
          </div>
        </Card>
      </div>
    );
  }

  const isOverdue = reminder.reminderStatus === 'PENDING' && reminder.timeReminder && dayjs(reminder.timeReminder).isBefore(dayjs());

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BellOutlined className="text-white text-xl" />
            </div>
            <div>
              <Title level={2} className="!mb-1 !text-gray-800">
                {reminder.title}
              </Title>
              <div className="flex items-center gap-2">
                <Tag color={getPriorityColor(reminder.priority)} className="px-3 py-1 rounded-full font-medium">
                  {getPriorityIcon(reminder.priority)}{getPriorityLabel(reminder.priority)}
                </Tag>
                <Tag color={getStatusColor(reminder.reminderStatus)} className="px-3 py-1 rounded-full font-medium">
                  {getStatusIcon(reminder.reminderStatus)}{getStatusLabel(reminder.reminderStatus)}
                </Tag>
                {isOverdue && (
                  <Tag color="red" className="px-3 py-1 rounded-full font-medium"><ClockCircleOutlined className="mr-1" />Quá hạn</Tag>
                )}
              </div>
            </div>
          </div>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => showEditModal(reminder._id)}
              className="professional-button"
              size="large"
            >
              Chỉnh sửa
            </Button>
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left */}
        <Col xs={24} lg={16}>
          <Card className="professional-card mb-6" title={
            <div className="flex items-center space-x-2">
              <TagOutlined className="text-green-500" />
              <span>Thông tin nhắc nhở</span>
            </div>
          }>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Text strong className="text-gray-600">Chi tiết</Text>
                <div className="mt-1">
                  <Paragraph className="text-gray-700">
                    {reminder.detail || "Chưa có chi tiết"}
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="mb-2">
                  <Text strong className="text-gray-600">Thời gian nhắc</Text>
                  <div className="mt-1">
                  <Text>
                    <ClockCircleOutlined className="mr-1" />
                    {reminder.timeReminder ? dayjs(reminder.timeReminder).format("DD/MM/YYYY HH:mm") : "-"}
                  </Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="mb-2">
                  <Text strong className="text-gray-600">Lặp lại</Text>
                  <div className="mt-1">
                    <Text>
                      {reminder.repeat === 'NEVER' ? 'Không lặp lại' : reminder.repeat === 'DAILY' ? 'Hàng ngày' : reminder.repeat === 'WEEKLY' ? 'Hàng tuần' : 'Hàng tháng'}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <Card className="professional-card" title={
            <div className="flex items-center space-x-2">
              <ClockCircleOutlined className="text-purple-500" />
              <span>Timeline</span>
            </div>
          }>
            <Timeline>
              <Timeline.Item dot={<CalendarOutlined style={{ color: "#1890ff" }} />} color="#1890ff">
                <Text strong>Ngày tạo</Text>
                <div>
                  <Text type="secondary">{reminder.createdAt ? dayjs(reminder.createdAt).format("DD/MM/YYYY HH:mm") : "-"}</Text>
                </div>
              </Timeline.Item>
              {reminder.updatedAt && (
                <Timeline.Item dot={<CalendarOutlined style={{ color: "#8c8c8c" }} />} color="#8c8c8c">
                  <Text strong>Cập nhật lần cuối</Text>
                  <div>
                    <Text type="secondary">{dayjs(reminder.updatedAt).format("DD/MM/YYYY HH:mm")}</Text>
                  </div>
                </Timeline.Item>
              )}
            </Timeline>
          </Card>
        </Col>

        {/* Right */}
        <Col xs={24} lg={8}>
          <Card className="professional-card mb-6" title={
            <div className="flex items-center space-x-2">
              <UserOutlined className="text-cyan-500" />
              <span>Thông tin liên quan</span>
            </div>
          }>
            <Space direction="vertical" size="middle" className="w-full">
              <div>
                <Text strong className="text-gray-600">Khách hàng liên quan</Text>
                <div className="mt-1 flex items-center space-x-2">
                  <Avatar icon={<UserOutlined />} size="small" />
                  <Text>{(leadData as any)?.data?.name || reminder.leadId || "Chưa chọn"}</Text>
                </div>
              </div>

              <Divider className="my-2" />

              <div>
                <Text strong className="text-gray-600">Nhắc nhở tới</Text>
                <div className="mt-1 flex items-center space-x-2">
                  <Avatar icon={<UserOutlined />} size="small" />
                  <Text>{(userData as any)?.data?.name || reminder.userId || "Chưa phân công"}</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
      {/* Edit reminder modal */}
      <ReminderEditModal
        modalProps={editModalProps}
        formProps={editFormProps}
        leadSelectProps={leadSelectProps}
        ownerSelectProps={ownerSelectProps}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default ReminderShow;


