export interface Reminder {
    _id: string;
    title: string;
    detail?: string;
    timeReminder: Date;
    leadId?: string;
    userId?: string;
    repeat: 'NEVER' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    reminderStatus: 'PENDING' | 'DONE' | 'CANCELLED';
    createdAt?: string;
    updatedAt?: string;
}
