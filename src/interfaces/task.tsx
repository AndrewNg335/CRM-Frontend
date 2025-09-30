export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  stage?: string;
  users?: { name: string; id: string }[];
}