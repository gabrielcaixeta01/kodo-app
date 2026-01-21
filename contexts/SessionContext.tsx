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
  completionPercentage: number;
};

type CompletedSession = {
  id: string;
  actionTitle: string;
  activityId?: string;
  startedAt: number;
  completedAt: number;
  durationMinutes: number;
  completionPercentage: number;
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
  updateSessionProgress: (completionPercentage: number) => void;
  resetWeeklyProgress: () => void;
};

/* =====================
   Context
===================== */

const SessionContext = createContext<SessionContextType | null>(null);

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

    setMounted(true);
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
    const newSession: Session = {
      id: crypto.randomUUID(),
      actionTitle,
      activityId,
      startedAt: Date.now(),
      completionPercentage: 0,
    };
    setSession(newSession);
  }, []);

  const updateSessionProgress = useCallback((completionPercentage: number) => {
    if (!session) return;

    setSession(prev => 
      prev ? { ...prev, completionPercentage: Math.min(100, Math.max(0, completionPercentage)) } : null
    );
  }, [session]);

  const endSession = useCallback(() => {
    if (!session) return;

    const durationMinutes = Math.round((Date.now() - session.startedAt) / 60000);

    const completed: CompletedSession = {
      id: session.id,
      actionTitle: session.actionTitle,
      activityId: session.activityId,
      startedAt: session.startedAt,
      completedAt: Date.now(),
      durationMinutes,
      completionPercentage: session.completionPercentage,
    };

    setHistory(prev => [completed, ...prev]);
    setSession(null);
  }, [session]);

  const interruptSession = useCallback(() => {
    if (!session) return;

    const interruptedSession: InterruptedSession = {
      id: session.id,
      actionTitle: session.actionTitle,
      activityId: session.activityId,
      startedAt: session.startedAt,
      interruptedAt: Date.now(),
      completionPercentage: session.completionPercentage,
    };

    setInterrupted(prev => [interruptedSession, ...prev]);
    setSession(null);
  }, [session]);

  const resumeSession = useCallback((interruptedSessionId: string) => {
    const interruptedSession = interrupted.find(s => s.id === interruptedSessionId);
    if (!interruptedSession) return;

    const resumedSession: Session = {
      id: interruptedSession.id,
      actionTitle: interruptedSession.actionTitle,
      activityId: interruptedSession.activityId,
      startedAt: Date.now(),
      completionPercentage: interruptedSession.completionPercentage,
    };

    setInterrupted(prev => prev.filter(s => s.id !== interruptedSessionId));
    setSession(resumedSession);
  }, [interrupted]);

  const resetWeeklyProgress = useCallback(() => {
    setHistory([]);
    setInterrupted([]);
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
      updateSessionProgress,
      resetWeeklyProgress,
    }),
    [session, history, interrupted, startSession, endSession, interruptSession, resumeSession, updateSessionProgress, resetWeeklyProgress]
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
    throw new Error("useSession must be used inside SessionProvider");
  }
  return ctx;
}
