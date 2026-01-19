/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* =====================
   Types
===================== */

type Session = {
  id: string;
  actionTitle: string;
  startedAt: number;
};

type CompletedSession = {
  id: string;
  actionTitle: string;
  startedAt: number;
  endedAt: number;
};

type SessionContextType = {
  session: Session | null;
  history: CompletedSession[];
  startSession: (actionTitle: string) => void;
  endSession: () => void;
};

/* =====================
   Context
===================== */

const SessionContext = createContext<SessionContextType | null>(
  null
);

const STORAGE_KEY = "kodo:active-session";
const HISTORY_KEY = "kodo:session-history";

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

  /* =====================
     Actions
  ===================== */

  function startSession(actionTitle: string) {
    const newSession = {
      id: crypto.randomUUID(),
      actionTitle,
      startedAt: Date.now(),
    };
    setSession(newSession);
  }

  function endSession() {
    if (!session) return;

    const completed: CompletedSession = {
      id: session.id,
      actionTitle: session.actionTitle,
      startedAt: session.startedAt,
      endedAt: Date.now(),
    };

    setHistory(prev => [completed, ...prev]);
    setSession(null);
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        history,
        startSession,
        endSession,
      }}
    >
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
