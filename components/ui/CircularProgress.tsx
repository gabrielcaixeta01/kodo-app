"use client";

import React from "react";

type CircularProgressProps = {
  value: number; // 0-100
  size?: number; // px
  strokeWidth?: number; // px
  trackColor?: string;
  progressColor?: string;
  label?: string;
};

export function CircularProgress({
  value,
  size = 160,
  strokeWidth = 10,
  trackColor = "#262626", // neutral-800
  progressColor = "#ffffff",
  label,
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
        style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center rotate-[0deg]">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-medium text-white">{Math.round(clamped)}%</div>
          {label && (
            <div className="text-xs text-neutral-400 mt-1">{label}</div>
          )}
        </div>
      </div>
    </div>
  );
}
