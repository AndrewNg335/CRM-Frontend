export interface Task {
    _id: string;
    title: string;
    description?: string;
    dueDate?: string;
    stage?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
