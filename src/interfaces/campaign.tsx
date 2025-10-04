export interface Campaign {
    _id: string;
    name: string;
    description?: string;
    isActive?: boolean;
    campaignStatus?: string;
    responsibleUserId?: string;
    campaignBudgetCost?: number;
    campaignExpectedRevenue?: number;
    startDate?: Date;
    endDate?: Date;
    opportunityCount?: number;
    leadCount?: number;
}
