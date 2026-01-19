"use client";

import { createContext, useContext, useState } from "react";

type Session = {
  id: string;
  actionTitle: string;
  startedAt: number;
};

type SessionContextType = {
  session: Session | null;
  startSession: (actionTitle: string) => void;
  endSession: () => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  function startSession(actionTitle: string) {
    setSession({
      id: crypto.randomUUID(),
      actionTitle,
      startedAt: Date.now(),
    });
  }

  function endSession() {
    setSession(null);
  }

  return (
    <SessionContext.Provider
      value={{ session, startSession, endSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return ctx;
}
