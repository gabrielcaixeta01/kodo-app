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
      if (activity.due_date) {
        const date = new Date(activity.due_date).toDateString();
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
          const dotsToShow = Math.min(count, 3); // Máximo 3 pontos
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={idx}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg
                text-xs sm:text-sm font-medium transition relative
                ${!day ? "bg-transparent" : ""}
                ${
                  isToday? "bg-white text-black": "bg-neutral-700 text-neutral-300 hover:bg-neutral-800"
                }
              `}
            >
              <span className={count > 0 ? "mb-0.5" : ""}>{day}</span>
              {count > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: dotsToShow }).map((_, i) => (
                    <span 
                      key={i} 
                      className="w-1 h-1 rounded-full bg-red-500"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
