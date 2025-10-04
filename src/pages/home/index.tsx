import { useCustom, useList, useGetIdentity, useNavigation } from "@refinedev/core";
import { Col, Row } from "antd";
import { OpportunitiesChart, UpcomingReminders } from "@/components";
import { DashboardTotalCountCard } from "@/components/home/total-count-card";
import type { User } from "@/interfaces/user";
import { Opportunity, OpportunityStage } from "@/interfaces/opportunity";
export const Home = () => {
    const { data: currentUser } = useGetIdentity<User>();
    const isAdmin = currentUser?.role?.name === 'Admin';
    const { push } = useNavigation();
    const { data: leadsData, isLoading: leadsLoading } = useList({
        resource: isAdmin ? "leads" : `leads/user/${currentUser?._id}`,
        pagination: { mode: "off" },
        queryOptions: { enabled: !!currentUser?._id },
    });
    const { data: opportunitiesData, isLoading: opportunitiesLoading } = useList({
        resource: isAdmin ? "opportunities" : `opportunities/owner/${currentUser?._id}`,
        pagination: { mode: "off" },
        queryOptions: { enabled: !!currentUser?._id },
    });
    const isLoading = leadsLoading || opportunitiesLoading;
    return (<div className="min-h-screen relative">
      <div className="relative z-10 p-6">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-800">
            Bảng Điều Khiển
          </h1>
          <p className="text-slate-600 text-sm">
            Theo dõi và quản lý dữ liệu khách hàng của bạn
          </p>
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} sm={24} xl={8}>
            <div className="professional-card">
              <DashboardTotalCountCard resource="leads" isLoading={isLoading} totalCount={leadsData?.total || 0} onClick={() => push("/leads")}/>
            </div>
          </Col>
          <Col xs={24} sm={24} xl={8}>
            <div className="professional-card">
              <DashboardTotalCountCard resource="opportunities" isLoading={isLoading} totalCount={opportunitiesData?.total || 0} onClick={() => push("/opportunities")}/>
            </div>
          </Col>
          <Col xs={24} sm={24} xl={8}>
            <div className="professional-card">
              <DashboardTotalCountCard resource="deals" isLoading={isLoading} totalCount={opportunitiesData?.data?.filter((opportunity: any) => opportunity.opportunityStage === OpportunityStage.CLOSED_WON || opportunity.opportunityStage === OpportunityStage.CLOSED_LOST).length || 0}/>
            </div>
          </Col>
        </Row>
        <Row gutter={[32, 32]} style={{
            marginTop: "32px",
        }}>
          <Col xs={24} sm={24} xl={8} style={{
            height: "460px",
        }}>
            <div className="professional-card h-full">
              <UpcomingReminders />
            </div>
          </Col>
          <Col xs={24} sm={24} xl={16} style={{
            height: "460px",
        }}>
            <div className="professional-card h-full">
              <OpportunitiesChart />
            </div>
          </Col>
         
        </Row>
        <Row gutter={[32, 32]} style={{
            marginTop: "32px",
        }}>
            <Col xs={24}>
              
            </Col>
          </Row>
      </div>
    </div>);
};
