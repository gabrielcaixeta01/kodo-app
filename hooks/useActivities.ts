import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { Activity } from "@/types/activity";

export function useActivities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase || !user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    async function fetchActivities() {
      try {
        setLoading(true);

        if (!supabase || !user) {
          setError("Supabase não está disponível");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("activities")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setActivities(data ?? []);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao buscar atividades"
        );
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
    const supabase = getSupabaseClient();
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from("activities")
        .insert({
          user_id: user.id,
          title,
          estimated_time: estimatedTime,
          energy_required: energyRequired,
          difficulty,
          priority,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      setActivities((prev) => [data, ...prev]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao criar atividade"
      );
    }
  }

  async function updateActivity(
    id: string,
    updates: Partial<Activity>
  ) {
    const supabase = getSupabaseClient();
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from("activities")
        .update({ ...updates, updated_at: new Date() })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      setActivities((prev) =>
        prev.map((a) => (a.id === id ? data : a))
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar atividade"
      );
    }
  }

  async function deleteActivity(id: string) {
    const supabase = getSupabaseClient();
    if (!supabase || !user) return;

    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao deletar atividade"
      );
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
