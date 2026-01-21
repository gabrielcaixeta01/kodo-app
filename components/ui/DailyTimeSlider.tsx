"use client";

import { useState } from "react";

interface DailyTimeSliderProps {
  value: number; // em minutos
  onChange: (minutes: number) => void;
}

export function DailyTimeSlider({ value, onChange }: DailyTimeSliderProps) {
  const [displayValue, setDisplayValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setDisplayValue(newValue);
    onChange(newValue);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins}m`;
    }
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  };

  // Calculate progress percentage for visual feedback
  const progress = ((displayValue - 15) / (480 - 15)) * 100;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs sm:text-sm text-neutral-400">Tempo disponível por dia</p>
        <span className="text-base sm:text-lg font-medium text-white whitespace-nowrap">{formatTime(displayValue)}</span>
      </div>

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(
            to right,
            rgb(255, 255, 255) 0%,
            rgb(255, 255, 255) ${progress}%,
            rgb(38, 38, 38) ${progress}%,
            rgb(38, 38, 38) 100%
          );
          outline: none;
          -webkit-slider-thumb-appearance: none;
          cursor: pointer;
          touch-action: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(1.15);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        input[type="range"]::-moz-range-thumb:hover {
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        input[type="range"]::-moz-range-thumb:active {
          transform: scale(1.15);
        }

        input[type="range"]::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>

      <input
        type="range"
        min="15"
        max="480"
        step="15"
        value={displayValue}
        onChange={handleChange}
      />

      <div className="flex justify-between text-xs text-neutral-500">
        <span>15m</span>
        <span>8h</span>
      </div>
    </div>
  );
}
