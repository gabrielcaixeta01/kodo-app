import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/lib/supabaseClient";

export interface Session {
  id: string;
  user_id: string;
  activity_id: string;
  title: string;
  status: "in_progress" | "completed" | "interrupted";
  duration: number; // minutos
  started_at: string;
  ended_at?: string;
}

export function useSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

      if (error) throw error;

      const list = data ?? [];
      setSessions(list);

      // ✅ Garante sessão atual em navegações
      const active = list.find((s) => s.status === "in_progress") || null;
      setCurrentSession(active);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao buscar sessões"
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setCurrentSession(null);
      setLoading(false);
      return;
    }

    fetchSessions();
  }, [fetchSessions, user]);

  async function startSession(
    activityId: string,
    title: string,
    resumeDurationMinutes = 0
  ) {
    const supabase = getSupabaseClient();
    if (!supabase || !user) return;

    try {
      const startedAt = new Date(Date.now() - resumeDurationMinutes * 60000);
      const payload = {
        user_id: user.id,
        activity_id: activityId,
        title,
        status: "in_progress",
        started_at: startedAt,
      };

      console.log("[startSession] payload", JSON.stringify(payload, null, 2));

      const { data, error } = await supabase
        .from("sessions")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      setSessions((prev) => [data, ...prev]);
    } catch (err) {
      console.error(
        "[startSession] error",
        err && typeof err === "object" ? JSON.stringify(err, null, 2) : err
      );
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao iniciar sessão"
      );
    }
  }

  async function endSession(
    status: "completed" | "interrupted",
    duration: number
  ) {
    const supabase = getSupabaseClient();
    if (!supabase || !user || !currentSession) return;

    try {
      const { data, error } = await supabase
        .from("sessions")
        .update({
          status,
          duration,
          ended_at: new Date(),
        })
        .eq("id", currentSession.id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(null);
      setSessions((prev) => [
        data,
        ...prev.filter((s) => s.id !== currentSession.id),
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao encerrar sessão"
      );
    }
  }

  return {
    sessions,
    currentSession,
    loading,
    error,
    startSession,
    endSession,
  };
}
