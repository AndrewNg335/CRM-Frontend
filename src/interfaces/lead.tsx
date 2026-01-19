export interface Lead {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    status?: string;
    createdAt: string;
    gender?: string;
    responsibleUserId?: string;
    source?: string;
    lastInteractionDate?: Date;
    note?: string;
    address?: string;
    interactionCount: number;
    updatedAt?: string;
}