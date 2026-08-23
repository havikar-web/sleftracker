import React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number; // 0 to 100
  size?: number; // width/height in px
  strokeWidth?: number;
  color?: string; // hex or CSS class
  className?: string;
  showValue?: boolean;
  valueSuffix?: string;
  label?: string;
}

export function ProgressCircle({
  value,
  size = 56,
  strokeWidth = 5,
  color = "#3b82f6",
  className,
  showValue = true,
  valueSuffix = "%",
  label,
}: ProgressCircleProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-zinc-200 dark:text-zinc-850"
        />

        {/* Foreground Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Centered Value */}
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-xs tracking-tighter">
            {clamped}
            {valueSuffix && <span className="text-[10px] font-normal opacity-70">{valueSuffix}</span>}
          </span>
          {label && <span className="text-[8px] text-zinc-500 font-medium -mt-0.5">{label}</span>}
        </div>
      )}
    </div>
  );
}
