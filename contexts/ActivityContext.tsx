"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Activity = {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "interrupted" | "completed";
  estimatedTime: number;
  energyRequired: "baixa" | "média" | "alta";
  createdAt: number;
  updatedAt: number;
};

type ActivityContextType = {
  activities: Activity[];
  addActivity: (title: string, estimatedTime: number, energyRequired: Activity["energyRequired"]) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  resetWeeklyActivities: () => void;
};

const ActivityContext = createContext<ActivityContextType | null>(null);

const STORAGE_KEY = "kodo:activities";

export function ActivityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mounted, setMounted] = useState(false);

  // Carrega do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTimeout(() => {
        setActivities(JSON.parse(saved));
      }, 0);
    }
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  // Persiste no localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities, mounted]);

  const addActivity = useCallback(
    (title: string, estimatedTime: number, energyRequired: Activity["energyRequired"]) => {
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        title,
        status: "pending",
        estimatedTime,
        energyRequired,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setActivities(prev => [newActivity, ...prev]);
    },
    []
  );

  const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id
          ? { ...activity, ...updates, updatedAt: Date.now() }
          : activity
      )
    );
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  }, []);

  const resetWeeklyActivities = useCallback(() => {
    setActivities([]);
  }, []);

  const value = useMemo(
    () => ({
      activities,
      addActivity,
      updateActivity,
      deleteActivity,
      resetWeeklyActivities,
    }),
    [activities, addActivity, updateActivity, deleteActivity, resetWeeklyActivities]
  );

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const ctx = useContext(ActivityContext);
  if (!ctx) {
    throw new Error("useActivities must be used inside ActivityProvider");
  }
  return ctx;
}
