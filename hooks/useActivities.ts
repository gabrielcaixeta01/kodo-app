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

    // 🔄 Subscribe to real-time updates
    const channel = supabase.channel("activities_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setActivities((prev) => [payload.new as Activity, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setActivities((prev) =>
              prev.map((a) => (a.id === (payload.new as Activity).id ? (payload.new as Activity) : a))
            );
          } else if (payload.eventType === "DELETE") {
            setActivities((prev) => prev.filter((a) => a.id !== (payload.old as Activity).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function addActivity(
    title: string,
    estimatedTime: number,
    energyRequired: Activity["energy_required"],
    difficulty: Activity["difficulty"] = "média",
    priority: Activity["priority"] = "média",
    dueDate?: string
  ) {
    const supabase = getSupabaseClient();
    if (!supabase || !user) {
      console.error("Supabase ou user não disponível");
      return;
    }

    try {
      // Ajusta due_date para meio-dia local evitando problema de timezone
      let formattedDueDate = null;
      if (dueDate) {
        const [year, month, day] = dueDate.split('-').map(Number);
        formattedDueDate = new Date(year, month - 1, day, 12, 0, 0).toISOString();
      }

      const payload = {
        user_id: user.id,
        title,
        estimated_time: estimatedTime,
        energy_required: energyRequired,
        difficulty,
        priority,
        status: "pending",
        due_date: formattedDueDate,
      };
      
      console.log("Payload completo:", JSON.stringify(payload, null, 2));
      
      const { data, error } = await supabase
        .from("activities")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error("Erro completo:", JSON.stringify(error, null, 2));
        throw error;
      }

      console.log("Atividade criada:", data);

      if (data) {
        setActivities((prev) => [data, ...prev]);
      } else {
        console.warn("Dados retornados são nulos");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao criar atividade";
      console.error("Catch error:", errorMsg);
      setError(errorMsg);
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
