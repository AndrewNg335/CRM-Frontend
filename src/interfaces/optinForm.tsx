import { Campaign } from "./campaign";
import { User } from "./user";

export interface OptinForm {
    _id: string;
    title: string;
    description?: string;
    isActive: boolean;
    campaignId: Campaign;
    assignedTo: User;
    submissionCount: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }