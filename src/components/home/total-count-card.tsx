import React from "react";
import { AuditOutlined, ShopOutlined, TeamOutlined } from "@ant-design/icons";
import { Area, type AreaConfig } from "@ant-design/plots";
import { Card, Skeleton } from "antd";
import { Text } from "../text";
type Type = "leads" | "opportunities" | "deals";
type Props = {
    resource: Type;
    isLoading: boolean;
    totalCount?: number;
    onClick?: () => void;
};
export const DashboardTotalCountCard = ({ resource, isLoading, totalCount, onClick, }: Props) => {
    const { primaryColor, secondaryColor, icon, title } = variants[resource];
    const config: AreaConfig = {
        appendPadding: [1, 0, 0, 0],
        padding: 0,
        syncViewPadding: true,
        data: variants[resource].data,
        autoFit: true,
        tooltip: false,
        animation: false,
        xField: "index",
        yField: "value",
        xAxis: false,
        yAxis: {
            tickCount: 12,
            label: {
                style: {
                    fill: "transparent",
                },
            },
            grid: {
                line: {
                    style: {
                        stroke: "transparent",
                    },
                },
            },
        },
        smooth: true,
        areaStyle: () => {
            return {
                fill: `l(270) 0:#fff 0.2:${secondaryColor} 1:${primaryColor}`,
            };
        },
        line: {
            color: primaryColor,
        },
    };
    return (<Card className="professional-card relative overflow-hidden" style={{ height: "96px", padding: 0, cursor: onClick ? "pointer" : undefined }} bodyStyle={{
            padding: "8px 8px 8px 12px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
        }} size="small" onClick={onClick}>

      <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            whiteSpace: "nowrap",
        }}>
        {icon}
        <Text size="md" style={{ marginLeft: "8px", color: "#a7f3d0" }}>
          {title}
        </Text>
      </div>
      <div style={{
            display: "flex",
            justifyContent: "space-between",
        }}>
        <Text size="xxxl" strong style={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
            textAlign: "start",
            marginLeft: "48px",
            fontVariantNumeric: "tabular-nums",
            color: "#1e293b",
        }}>
          {isLoading ? (<Skeleton.Button style={{
                marginTop: "8px",
                width: "74px",
            }}/>) : (totalCount)}
        </Text>
        <Area {...config} style={{
            width: "50%",
        }}/>
      </div>
    </Card>);
};
const IconWrapper = ({ color, children, }: React.PropsWithChildren<{
    color: string;
}>) => {
    return (<div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: color,
        }}>
      {children}
    </div>);
};
const variants: {
    [key in Type]: {
        primaryColor: string;
        secondaryColor?: string;
        icon: React.ReactNode;
        title: string;
        data: {
            index: string;
            value: number;
        }[];
    };
} = {
    leads: {
        primaryColor: "#3b82f6",
        secondaryColor: "#3b82f6",
        icon: (<IconWrapper color="rgba(59, 130, 246, 0.2)">
        <ShopOutlined className="md" style={{
                color: "#3b82f6",
            }}/>
      </IconWrapper>),
        title: "Số lượng khách hàng tiềm năng",
        data: [
            {
                index: "1",
                value: 3500,
            },
            {
                index: "2",
                value: 2750,
            },
            {
                index: "3",
                value: 5000,
            },
            {
                index: "4",
                value: 4250,
            },
            {
                index: "5",
                value: 5000,
            },
        ],
    },
    opportunities: {
        primaryColor: "#10b981",
        secondaryColor: "#10b981",
        icon: (<IconWrapper color="rgba(16, 185, 129, 0.2)">
        <TeamOutlined className="md" style={{
                color: "#10b981",
            }}/>
      </IconWrapper>),
        title: "Số cơ hội kinh doanh",
        data: [
            {
                index: "1",
                value: 10000,
            },
            {
                index: "2",
                value: 19500,
            },
            {
                index: "3",
                value: 13000,
            },
            {
                index: "4",
                value: 17000,
            },
            {
                index: "5",
                value: 13000,
            },
            {
                index: "6",
                value: 20000,
            },
        ],
    },
    deals: {
        primaryColor: "#f59e0b",
        secondaryColor: "#f59e0b",
        icon: (<IconWrapper color="rgba(245, 158, 11, 0.2)">
        <AuditOutlined className="md" style={{
                color: "#f59e0b",
            }}/>
      </IconWrapper>),
        title: "Tổng số giao dịch",
        data: [
            {
                index: "1",
                value: 1000,
            },
            {
                index: "2",
                value: 1300,
            },
            {
                index: "3",
                value: 1200,
            },
            {
                index: "4",
                value: 2000,
            },
            {
                index: "5",
                value: 800,
            },
            {
                index: "6",
                value: 1700,
            },
            {
                index: "7",
                value: 1400,
            },
            {
                index: "8",
                value: 1800,
            },
        ],
    },
};
