import { Activity, Difficulty, Priority } from "@/types/activity";

export interface Action {
  activity: Activity;
  score: number;
  reasons: string[];
}

export interface Context {
  availableTime: number; // em minutos
  energy: "baixa" | "média" | "alta";
}

export function activityToAction(activity: Activity): Action {
  const reasons: string[] = [];
  let score = 0;

  // Score baseado em dificuldade
  const difficultyScores: Record<Difficulty, number> = {
    baixa: 30,
    média: 20,
    alta: 10,
  };
  score += difficultyScores[activity.difficulty];
  if (activity.difficulty === "baixa") reasons.push("Fácil de fazer");

  // Score baseado em prioridade
  const priorityScores: Record<Priority, number> = {
    alta: 40,
    média: 20,
    baixa: 5,
  };
  score += priorityScores[activity.priority];
  if (activity.priority === "alta") reasons.push("Alta prioridade");

  // Score baseado em tempo estimado
  if (activity.estimated_time <= 15) {
    score += 25;
    reasons.push("Rápido");
  } else if (activity.estimated_time <= 30) {
    score += 15;
  } else if (activity.estimated_time <= 60) {
    score += 10;
  } else {
    score += 5;
    reasons.push("Longo");
  }

  // Score baseado em energia requerida
  const energyScores: Record<Activity["energy_required"], number> = {
    low: 15,
    medium: 10,
    high: 5,
  };
  score += energyScores[activity.energy_required];

  // Score baseado em data de vencimento
  if (activity.due_date) {
    const daysUntilDue = Math.ceil(
      (new Date(activity.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilDue <= 1) {
      score += 50;
      reasons.push("Vencendo hoje");
    } else if (daysUntilDue <= 3) {
      score += 35;
      reasons.push("Vencendo em breve");
    } else if (daysUntilDue <= 7) {
      score += 15;
    }
  }

  return {
    activity,
    score,
    reasons: reasons.length > 0 ? reasons : ["Atividade disponível"],
  };
}

export function getRankedActions(actions: Action[], context: Context): Action[] {
  return actions
    .map((action) => {
      let adjustedScore = action.score;

      // Ajusta score baseado no contexto de tempo disponível
      if (context.availableTime < action.activity.estimated_time) {
        adjustedScore *= 0.5;
      } else if (context.availableTime >= action.activity.estimated_time * 2) {
        adjustedScore *= 1.2;
      }

      // Ajusta score baseado na energia disponível
      const energyMultipliers: Record<string, Record<Activity["energy_required"], number>> = {
        baixa: { low: 1.3, medium: 0.8, high: 0.3 },
        média: { low: 1.1, medium: 1.0, high: 0.7 },
        alta: { low: 1.0, medium: 1.1, high: 1.3 },
      };

      const multiplier =
        energyMultipliers[context.energy][action.activity.energy_required] || 1;
      adjustedScore *= multiplier;

      return {
        ...action,
        score: adjustedScore,
      };
    })
    .sort((a, b) => b.score - a.score);
}