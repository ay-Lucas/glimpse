"use client";
import { motion } from "framer-motion";

interface ScoreCircleProps {
  percentage: number;
  size?: number; // width/height in px
  strokeWidth?: number; // ring thickness
}

export function ScoreCircle({
  percentage,
  size = 100,
  strokeWidth = 6,
}: ScoreCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percentage / 100);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-block"
    >
      {/* rotate the whole ring −90° */}
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {/* background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-gray-200"
        />
        {/* animated progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          initial={{ stroke: "#10B981" }}
          whileHover={{ stroke: "#34D399" }}
          transition={{ duration: 0.25 }}
        />
      </g>
      {/* center label */}
      <text
        x="50%"
        y="53%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-md font-medium fill-gray-300"
      >
        {percentage}%
      </text>
    </motion.svg>
  );
}
