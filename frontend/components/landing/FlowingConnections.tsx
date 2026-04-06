"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function FlowingConnections() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationTimeRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      animationTimeRef.current += 0.016;

      const svg = svgRef.current;
      if (!svg) return;

      // Update flowing circles along paths
      const circles = svg.querySelectorAll("circle[data-animated]");
      circles.forEach((circle, idx) => {
        const pathLength = 250;
        const speed = 50;
        const offset = ((animationTimeRef.current * speed + idx * 40) % pathLength);

        // This would need actual path positioning logic
        // For now, we'll use a simple oscillating animation
        const x = 50 + Math.sin(animationTimeRef.current * 2 + idx) * 20;
        const y = 50 + Math.cos(animationTimeRef.current * 1.5 + idx * 0.5) * 20;

        circle.setAttribute("cx", String(x));
        circle.setAttribute("cy", String(y));
      });
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Define gradient */}
      <defs>
        <linearGradient id="violetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#00D4FF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Central hub */}
      <circle cx="50" cy="50" r="8" fill="url(#violetGradient)" filter="url(#glow)" />

      {/* Flowing connection lines */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 50 + Math.cos(rad) * 30;
        const y2 = 50 + Math.sin(rad) * 30;

        return (
          <g key={`connection-${angle}`}>
            {/* Base line */}
            <line
              x1="50"
              y1="50"
              x2={x2}
              y2={y2}
              stroke="url(#flowGradient)"
              strokeWidth="1.5"
              opacity="0.4"
            />

            {/* Animated flowing particles */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={`particle-${angle}-${i}`}
                data-animated="true"
                cx={x2}
                cy={y2}
                r="1.5"
                fill="#00D4FF"
                opacity="0.7"
                filter="url(#glow)"
                animate={{
                  cx: [
                    50 + Math.cos(rad) * 5,
                    50 + Math.cos(rad) * 20,
                    50 + Math.cos(rad) * 35,
                  ],
                  cy: [
                    50 + Math.sin(rad) * 5,
                    50 + Math.sin(rad) * 20,
                    50 + Math.sin(rad) * 35,
                  ],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}

            {/* End nodes */}
            <circle
              cx={x2}
              cy={y2}
              r="3"
              fill="#7C3AED"
              opacity="0.6"
              filter="url(#glow)"
            />
          </g>
        );
      })}

      {/* Pulsing aura around center */}
      <motion.circle
        cx="50"
        cy="50"
        r="8"
        fill="none"
        stroke="#00D4FF"
        strokeWidth="0.5"
        opacity="0.3"
        animate={{ r: [8, 15, 8] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
}
