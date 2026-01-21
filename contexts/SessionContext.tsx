/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =====================
   Types
===================== */

type Session = {
  id: string;
  actionTitle: string;
  activityId?: string;
  startedAt: number;
};

type CompletedSession = {
  id: string;
  actionTitle: string;
  activityId?: string;
  startedAt: number;
  endedAt: number;
};

type InterruptedSession = {
  id: string;
  actionTitle: string;
  activityId?: string;
  startedAt: number;
  interruptedAt: number;
  completionPercentage: number;
};

type SessionContextType = {
  session: Session | null;
  history: CompletedSession[];
  interrupted: InterruptedSession[];
  startSession: (actionTitle: string, activityId?: string) => void;
  endSession: () => void;
  interruptSession: () => void;
  resumeSession: (interruptedSessionId: string) => void;
  resetWeeklyProgress: () => void;
};

/* =====================
   Context
===================== */

const SessionContext = createContext<SessionContextType | null>(
  null
);

const STORAGE_KEY = "kodo:active-session";
const HISTORY_KEY = "kodo:session-history";
const INTERRUPTED_KEY = "kodo:interrupted-sessions";

/* =====================
   Provider
===================== */

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [history, setHistory] = useState<CompletedSession[]>([]);
  const [interrupted, setInterrupted] = useState<InterruptedSession[]>([]);
  const [mounted, setMounted] = useState(false);

  // Carrega do localStorage após montagem
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }

    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedInterrupted = localStorage.getItem(INTERRUPTED_KEY);
    if (savedInterrupted) {
      setInterrupted(JSON.parse(savedInterrupted));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Persiste sessão ativa
  useEffect(() => {
    if (!mounted) return;
    
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session, mounted]);

  // Persiste histórico
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history, mounted]);

  // Persiste interrompidas
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(INTERRUPTED_KEY, JSON.stringify(interrupted));
  }, [interrupted, mounted]);

  /* =====================
     Actions
  ===================== */

  const startSession = useCallback((actionTitle: string, activityId?: string) => {
    const newSession = {
      id: crypto.randomUUID(),
      actionTitle,
      activityId,
      startedAt: Date.now(),
    };
    setSession(newSession);
  }, []);

  const endSession = useCallback(() => {
    if (!session) return;

    const completed: CompletedSession = {
      id: session.id,
      actionTitle: session.actionTitle,
      activityId: session.activityId,
      startedAt: session.startedAt,
      endedAt: Date.now(),
    };

    setHistory(prev => [completed, ...prev]);
    setSession(null);
  }, [session]);

  const interruptSession = useCallback(() => {
    if (!session) return;

    const elapsed = Date.now() - session.startedAt;
    const elapsedMinutes = elapsed / 60000;
    // Assume 60 minutos como tempo padrão esperado
    const expectedMinutes = 60;
    const percentage = Math.min(100, Math.round((elapsedMinutes / expectedMinutes) * 100));

    const interruptedSession: InterruptedSession = {
      id: session.id,
      actionTitle: session.actionTitle,
      activityId: session.activityId,
      startedAt: session.startedAt,
      interruptedAt: Date.now(),
      completionPercentage: percentage,
    };

    setInterrupted(prev => [interruptedSession, ...prev]);
    setSession(null);
  }, [session]);

  const resumeSession = useCallback((interruptedSessionId: string) => {
    const interruptedSession = interrupted.find(s => s.id === interruptedSessionId);
    if (!interruptedSession) return;

    // Calcula o tempo já decorrido baseado na porcentagem
    const expectedMinutes = 60;
    const elapsedMinutes = (interruptedSession.completionPercentage / 100) * expectedMinutes;
    const elapsedMs = elapsedMinutes * 60000;

    // Cria nova sessão com startedAt ajustado para manter o progresso
    const resumedSession: Session = {
      id: interruptedSession.id,
      actionTitle: interruptedSession.actionTitle,
      activityId: interruptedSession.activityId,
      startedAt: Date.now() - elapsedMs,
    };

    // Remove da lista de interrompidas e cria sessão ativa
    setInterrupted(prev => prev.filter(s => s.id !== interruptedSessionId));
    setSession(resumedSession);
  }, [interrupted]);

  const resetWeeklyProgress = useCallback(() => {
    // Limpa histórico e sessões interrompidas
    setHistory([]);
    setInterrupted([]);
    // Mantém a sessão ativa se existir
  }, []);

  const value = useMemo(
    () => ({
      session,
      history,
      interrupted,
      startSession,
      endSession,
      interruptSession,
      resumeSession,
      resetWeeklyProgress,
    }),
    [session, history, interrupted, startSession, endSession, interruptSession, resumeSession, resetWeeklyProgress]
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

/* =====================
   Hook
===================== */

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error(
      "useSession must be used inside SessionProvider"
    );
  }
  return ctx;
}
