import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useCallback as reactUseCallback } from "react";

export interface Session {
    id: string;
    user_id: string;
    activity_id: string;
    title: string;
    status: "in_progress" | "completed" | "interrupted";
    duration: number; // em minutos
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
        try {
            setLoading(true);
            const { data, error: err } = await supabase
                .from("sessions")
                .select("*")
                .eq("user_id", user?.id)
                .order("started_at", { ascending: false });

            if (err) throw err;
            setSessions(data || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao buscar sessões");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            setSessions([]);
            setLoading(false);
            return;
        }

        fetchSessions();
    }, [fetchSessions, user]);

    async function startSession(activityId: string, title: string) {
        try {
            const { data, error: err } = await supabase
                .from("sessions")
                .insert([
                    {
                        user_id: user?.id,
                        activity_id: activityId,
                        title,
                        status: "in_progress",
                        started_at: new Date(),
                    },
                ])
                .select()
                .single();

            if (err) throw err;
            setCurrentSession(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao iniciar sessão");
        }
    }

    async function endSession(status: "completed" | "interrupted", duration: number) {
        if (!currentSession) return;

        try {
            const { data, error: err } = await supabase
                .from("sessions")
                .update({
                    status,
                    duration,
                    ended_at: new Date(),
                })
                .eq("id", currentSession.id)
                .select()
                .single();

            if (err) throw err;
            setCurrentSession(null);
            setSessions(prev => [data, ...prev.filter(s => s.id !== currentSession.id)]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao encerrar sessão");
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

// Implementation using React's useCallback
function useCallback<T extends (...args: unknown[]) => unknown>(fn: T, deps: unknown[]): T {
    return reactUseCallback(fn, deps);
}
