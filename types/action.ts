export type Impact = "low" | "medium" | "high";
export type Energy = "low" | "medium" | "high";

export type Action = {
  id: string;
  title: string;
  estimatedTime: number; // em minutos
  daysToDeadline?: number;
  impact: Impact;
  relatedPaths: number;
  energyRequired: Energy;
};
