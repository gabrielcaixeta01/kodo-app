export type Difficulty = "baixa" | "média" | "alta";
export type Priority = "baixa" | "média" | "alta";
export type EnergyRequired = "low" | "medium" | "high";
export type ActivityStatus = "pending" | "in_progress" | "completed" | "interrupted";

export interface Activity {
  id: string;
  user_id: string;
  title: string;
  status: ActivityStatus;
  estimated_time: number;
  energy_required: EnergyRequired;
  difficulty: Difficulty;
  priority: Priority;
  due_date?: string;
  created_at: string;
  updated_at: string;
}
