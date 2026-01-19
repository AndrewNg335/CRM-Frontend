export interface User {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: {
        _id: string;
        name: string;
        permissions: string[];
        __v: number;
    };
    taskAssignedCount: number;
    leadAssignedCount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    phone?: string;
    address?: string;
    avatarUrl?: string;
}