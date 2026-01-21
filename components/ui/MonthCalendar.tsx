"use client";

import { useActivities } from "@/hooks/useActivities";

export function MonthCalendar() {
  const { activities } = useActivities();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const activitiesByDate = activities.reduce(
    (acc, activity) => {
      if (activity.dueDate) {
        const date = new Date(activity.dueDate).toDateString();
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="rounded-2xl border border-neutral-700 bg-neutral-900/50 p-4 sm:p-6">
      <h3 className="text-sm font-medium text-neutral-300 mb-4">
        {new Date(year, month).toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        })}
      </h3>

      <div className="grid grid-cols-7 gap-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
          <div key={day} className="text-center text-xs text-neutral-500 font-medium">
            {day}
          </div>
        ))}

        {days.map((day, idx) => {
          const dateStr = day
            ? new Date(year, month, day).toDateString()
            : null;
          const count = dateStr ? activitiesByDate[dateStr] || 0 : 0;
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={idx}
              className={`
                aspect-square flex items-center justify-center rounded-lg
                text-xs sm:text-sm font-medium transition
                ${!day ? "bg-transparent" : ""}
                ${
                  isToday
                    ? "bg-white text-black"
                    : count > 0
                    ? "bg-neutral-700 text-white"
                    : "bg-neutral-800 text-neutral-500"
                }
              `}
            >
              {day}
              {count > 0 && (
                <span className="absolute bottom-1 text-xs opacity-70">
                  •
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
