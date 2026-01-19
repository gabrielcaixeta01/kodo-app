export type Difficulty = "low" | "medium" | "high";
export type Priority = "low" | "medium" | "high";

export type Activity = {
  id: string;
  title: string;
  difficulty: Difficulty;
  priority: Priority;
  dueDate?: number; // timestamp
  createdAt: number;
};
