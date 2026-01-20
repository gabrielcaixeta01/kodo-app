export type Impact = "baixa" | "média" | "alta";
export type Energy = "baixa" | "média" | "alta";

export type Action = {
  id: string;
  title: string;
  estimatedTime: number; // em minutos
  daysToDeadline?: number;
  impact: Impact;
  relatedPaths: number;
  energyRequired: Energy;
};
