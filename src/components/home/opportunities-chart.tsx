import { RiseOutlined } from "@ant-design/icons";
import { Area, AreaConfig } from "@ant-design/plots";
import { useList, useGetIdentity } from "@refinedev/core";
import { Card, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
import type { User } from "@/interfaces/user";

const { Text: AntText } = Typography;

export const OpportunitiesChart = () => {
  const { data: currentUser } = useGetIdentity<User>();
  const isAdmin = currentUser?.role?.name === 'Admin';
  
  const { data } = useList({
    resource: isAdmin ? "opportunities" : `opportunities/owner/${currentUser?._id}`,
    pagination: { mode: "off" },
    filters: [{ field: "isClosed", operator: "eq", value: true }],
    sorters: [{ field: "closeDate", order: "asc" }],
    queryOptions: { enabled: !!currentUser?._id },
  });

  const chartData = React.useMemo(() => {
    if (!data?.data) return [];

    // map sang { timeText, value, state }
    const mapped = data.data.map((opp: any) => ({
      timeText: opp.closeDate
        ? dayjs(opp.closeDate).format("MMM YYYY")
        : "Unknown",
      value: opp.amount || 0,
      state: opp.isWon ? "Won" : "Lost",
    }));

    // group theo timeText + state
    const grouped: Record<string, any> = {};
    mapped.forEach((item) => {
      const key = `${item.timeText}-${item.state}`;
      if (!grouped[key]) {
        grouped[key] = { ...item };
      } else {
        grouped[key].value += item.value;
      }
    });

    return Object.values(grouped);
  }, [data?.data]);

  const config: AreaConfig = {
    isStack: false,
    data: chartData,
    xField: "timeText",
    yField: "value",
    seriesField: "state",
    smooth: true,
    startOnZero: false,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    legend: {
      offsetY: -6,
      itemName: {
        style: {
          fontSize: 12,
          fill: '#64748b'
        }
      }
    },
    yAxis: {
      tickCount: 4,
      label: {
        style: {
          fontSize: 11,
          fill: '#64748b'
        },
        formatter: (v) => `${Number(v) / 1000} Vnd`,
      },
      grid: {
        line: {
          style: {
            stroke: '#f1f5f9',
            lineWidth: 1,
          }
        }
      }
    },
    xAxis: {
      label: {
        style: {
          fontSize: 11,
          fill: '#64748b'
        }
      },
      grid: {
        line: {
          style: {
            stroke: '#f1f5f9',
            lineWidth: 1,
          }
        }
      }
    },
    tooltip: {
      formatter: (d) => ({
        name: d.state,
        value: `${Number(d.value) / 1000} Vnd`,
      }),
      domStyles: {
        'g2-tooltip': {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
      }
    },
    areaStyle: (datum) => {
      const won = "l(270) 0:#ffffff 0.5:#a7f3d0 1:#10b981";
      const lost = "l(270) 0:#ffffff 0.5:#fecaca 1:#ef4444";
      return { fill: datum.state === "Won" ? won : lost };
    },
    color: (datum) => (datum.state === "Won" ? "#10b981" : "#ef4444"),
  };

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
          padding: "24px 20px 0px 20px",
          background: "rgba(255, 255, 255, 0.95)"
        },
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
          }}>
            <RiseOutlined style={{ color: "white", fontSize: 18 }} />
          </div>
          <div>
            <AntText strong style={{ fontSize: 16, color: "#1f2937" }}>
              Biểu Đồ Cơ Hội Kinh Doanh
            </AntText>
          </div>
        </div>
      }
    >
      <Area {...config} height={325} />
    </Card>
  );
};
