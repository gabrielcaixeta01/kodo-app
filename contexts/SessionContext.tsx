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
  // ✅ inicialização correta (sem effect)
  const [session, setSession] = useState<Session | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [history, setHistory] = useState<CompletedSession[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  /* 🔹 persistir sessão ativa */
  useEffect(() => {
    if (session) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(session)
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  /* 🔹 persistir histórico */
  useEffect(() => {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );
  }, [history]);

  /* =====================
     Actions
  ===================== */

  function startSession(actionTitle: string) {
    setSession({
      id: crypto.randomUUID(),
      actionTitle,
      startedAt: Date.now(),
    });
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
