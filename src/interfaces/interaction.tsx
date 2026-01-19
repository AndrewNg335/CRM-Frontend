export interface Interaction {
    _id: string;
    interactionType: string;
    detail: string;
    transcript?: string; 
    audioUrl?: string; 
    leadId: string;
    userId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInteractionDto {
    interactionType: string;
    detail: string;
    transcript?: string;
    audioUrl?: string;
    leadId: string;
    userId: string;
}

export interface TranscribeResponse {
    success: boolean;
    transcript: string;
    message?: string;
}

export interface SummarizeResponse {
    success: boolean;
    summary: string;
    message?: string;
}