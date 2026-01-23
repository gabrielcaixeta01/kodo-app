import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Activity } from "@/types/activity";

export function useActivities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    async function fetchActivities() {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from("activities")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        if (err) throw err;
        setActivities(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar atividades");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [user]);

  async function addActivity(
    title: string,
    estimatedTime: number,
    energyRequired: Activity["energy_required"],
    difficulty: Activity["difficulty"] = "média",
    priority: Activity["priority"] = "média"
  ) {
    try {
      const { data, error: err } = await supabase
        .from("activities")
        .insert([
          {
            user_id: user?.id,
            title,
            estimated_time: estimatedTime,
            energy_required: energyRequired,
            difficulty,
            priority,
            status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ])
        .select()
        .single();

      if (err) throw err;
      setActivities(prev => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar atividade");
    }
  }

  async function updateActivity(id: string, updates: Partial<Activity>) {
    try {
      const { data, error: err } = await supabase
        .from("activities")
        .update({
          ...updates,
          updated_at: new Date(),
        })
        .eq("id", id)
        .eq("user_id", user?.id)
        .select()
        .single();

      if (err) throw err;
      setActivities(prev =>
        prev.map(a => (a.id === id ? data : a))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar atividade");
    }
  }

  async function deleteActivity(id: string) {
    try {
      const { error: err } = await supabase
        .from("activities")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (err) throw err;
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar atividade");
    }
  }

  return {
    activities,
    loading,
    error,
    addActivity,
    updateActivity,
    deleteActivity,
  };
}