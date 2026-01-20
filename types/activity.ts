export type Difficulty = "baixa" | "média" | "alta";
export type Priority = "baixa" | "média" | "alta";
export type ActivityStatus = "pending" | "in_progress" | "interrupted" | "completed";

export type Activity = {
  id: string;
  title: string;
  difficulty: Difficulty;
  priority: Priority;
  dueDate?: number; // timestamp
  createdAt: number;
  status: ActivityStatus;
};
