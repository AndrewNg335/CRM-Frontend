export interface Opportunity {
    _id: string;
    name: string;
    description?: string;
    opportunityStage: OpportunityStage;
    amount?: number;
    probability?: number;
    leadSource: string;
    isClosed?: boolean;
    isWon?: boolean;
    nextStep?: string;
    leadId: string | { _id: string; name: string };
    campaignId: string | { _id: string; name: string };
    ownerId?: string;
    closeDate?: Date;
    createdAt: Date;
  }

  export enum OpportunityStage {
    QUALIFICATION = 'QUALIFICATION',
    NEEDS_ANALYSIS = 'NEEDS_ANALYSIS',
    PROPOSAL = 'PROPOSAL',
    NEGOTIATION = 'NEGOTIATION',
    CLOSED_WON = 'CLOSED_WON',
    CLOSED_LOST = 'CLOSED_LOST',
  }