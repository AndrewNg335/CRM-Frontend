import { NotificationOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useList, useGetIdentity, useNavigation } from "@refinedev/core";
import { Card, Empty, List, Tag, Typography } from "antd";
import dayjs from "dayjs";

import { useMemo } from "react";
import UpcomingEventsSkeleton from "../skeleton/upcoming-events";
import type { User } from "@/interfaces/user";

const { Text: AntText } = Typography;

export const UpcomingReminders = () => {
  const now = useMemo(() => dayjs().toISOString(), []);
  const { data: currentUser } = useGetIdentity<User>();
  const isAdmin = currentUser?.role?.name === 'Admin';
  const { push } = useNavigation();
  
  const { data, isLoading } = useList({
    resource: isAdmin ? "reminders" : `reminders/user/${currentUser?._id}`,
    pagination: {
      pageSize: 5,
    },
    sorters: [
      {
        field: "timeReminder",
        order: "asc",
      },
    ],
    filters: [
      {
        field: "timeReminder",
        operator: "gte",
        value: now
      },
    ],
    queryOptions: { enabled: !!currentUser?._id },
  });

  const getReminderStatus = (timeReminder: string) => {
    const now = dayjs();
    const reminderTime = dayjs(timeReminder);
    const diffHours = reminderTime.diff(now, 'hour');

    if (diffHours < 0) {
      return { status: 'overdue', color: '#ff4d4f', text: 'Quá hạn', icon: <ExclamationCircleOutlined /> };
    } else if (diffHours < 24) {
      return { status: 'urgent', color: '#fa8c16', text: 'Sắp đến hạn', icon: <ClockCircleOutlined /> };
    } else {
      return { status: 'upcoming', color: '#52c41a', text: 'Sắp tới', icon: <NotificationOutlined /> };
    }
  };

  const reminders = (data?.data || []).map((item) => ({
    id: item._id,
    title: item.title,
    detail: item.detail,
    startDate: item.createdAt,
    endDate: item.timeReminder,
    status: getReminderStatus(item.timeReminder),
  }));

  return (
    <Card
      className="professional-card relative overflow-hidden"
      style={{ height: "100%" }}
      styles={{
        header: {
          padding: "16px 20px",
          background: "rgba(255, 255, 255, 0.9)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)"
        },
        body: {
          padding: "0",
          background: "rgba(255, 255, 255, 0.95)"
        },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(240, 147, 251, 0.4)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              borderRadius: 12
            }} />
            <NotificationOutlined style={{ 
              color: "white", 
              fontSize: 18, 
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
            }} />
          </div>
          <div>
            <AntText strong style={{ fontSize: 16, color: "#1f2937" }}>
              Nhắc Nhở Sắp Tới
            </AntText>
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div style={{ padding: "16px 20px" }}>
          <List
            itemLayout="horizontal"
            dataSource={Array.from({ length: 5 }).map((_, index) => ({
              id: index,
            }))}
            renderItem={() => <UpcomingEventsSkeleton />}
          />
        </div>
      ) : reminders.length === 0 ? (
        <div style={{ padding: "40px 20px" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <AntText style={{ color: "#6b7280", fontSize: 14 }}>
                Không có nhắc nhở nào sắp tới
              </AntText>
            }
          />
        </div>
      ) : (
        <div style={{
          padding: "8px 0",
          maxHeight: "400px",
          overflowY: "auto",
          overflowX: "hidden"
        }}>
          <List
            itemLayout="horizontal"
            dataSource={reminders}
            split={false}
            renderItem={(item, index) => {
              const renderDate = () =>
                item.endDate
                  ? dayjs(item.endDate).format("DD/MM/YYYY HH:mm")
                  : "-";

              return (
                <List.Item
                  style={{
                    padding: "16px 20px",
                    borderBottom: index < reminders.length - 1 ? "1px solid rgba(0, 0, 0, 0.06)" : "none",
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}
                  className="reminder-list-item"
                  onClick={() => push(`/reminders/show/${item.id}`)}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                    <div style={{ marginRight: 12, marginTop: 2 }}>
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: item.status.color,
                        boxShadow: `0 0 0 3px ${item.status.color}20`
                      }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <AntText
                          strong
                          style={{
                            fontSize: 14,
                            color: "#1f2937",
                            lineHeight: 1.4,
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                          title={item.title}
                        >
                          {item.title}
                        </AntText>
                        <Tag
                          color={item.status.color}
                          style={{
                            fontSize: 11,
                            borderRadius: 6,
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            flexShrink: 0
                          }}
                          icon={item.status.icon}
                        >
                          {item.status.text}
                        </Tag>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                        <ClockCircleOutlined style={{ fontSize: 12, color: "#6b7280", marginRight: 6 }} />
                        <AntText style={{ fontSize: 12, color: "#6b7280" }}>
                          {renderDate()}
                        </AntText>
                      </div>

                      {item.detail && (
                        <AntText
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            lineHeight: 1.4,
                            display: "block",
                            maxWidth: "250px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                          title={item.detail}
                        >
                          {item.detail}
                        </AntText>
                      )}
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default UpcomingReminders;