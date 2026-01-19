"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Activity } from "@/types/activity";

type ActivityContextType = {
  activities: Activity[];
  addActivity: (
    data: Omit<Activity, "id" | "createdAt">
  ) => void;
};

const ActivityContext =
  createContext<ActivityContextType | null>(null);

const STORAGE_KEY = "kodo:activities";

export function ActivityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activities, setActivities] = useState<Activity[]>(
    () => {
      if (typeof window === "undefined") return [];
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(activities)
    );
  }, [activities]);

  function addActivity(
    data: Omit<Activity, "id" | "createdAt">
  ) {
    setActivities(prev => [
      {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...data,
      },
      ...prev,
    ]);
  }

  return (
    <ActivityContext.Provider
      value={{ activities, addActivity }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const ctx = useContext(ActivityContext);
  if (!ctx) {
    throw new Error(
      "useActivities must be used inside ActivityProvider"
    );
  }
  return ctx;
}
