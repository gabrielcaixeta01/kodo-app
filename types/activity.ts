export type Difficulty = "baixa" | "média" | "alta";
export type Priority = "baixa" | "média" | "alta";
export type ActivityStatus = "pending" | "in_progress" | "completed" | "interrupted";

export interface Activity {
  id: string;
  title: string;
  status: ActivityStatus;
  estimatedTime: number;
  energyRequired: "low" | "medium" | "high";
  difficulty: Difficulty;
  priority: Priority;
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
}
