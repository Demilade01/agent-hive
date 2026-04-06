"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface NetworkNode {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
}

interface NetworkLine {
  from: number;
  to: number;
  opacity: number;
}

export function AnimatedNetworkVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<NetworkNode[]>([]);
  const linesRef = useRef<NetworkLine[]>([]);
  const animationTimeRef = useRef(0);

  const initializeNetwork = useCallback(() => {
    const nodes: NetworkNode[] = [];

    // Create nodes
    for (let i = 0; i < 15; i++) {
      nodes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: Math.random() > 0.6 ? "#00D4FF" : "#7C3AED",
        opacity: Math.random() * 0.6 + 0.4,
      });
    }

    // Create lines connecting nodes
    const lines: NetworkLine[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < Math.min(i + 3, nodes.length); j++) {
        lines.push({
          from: i,
          to: j,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    }

    nodesRef.current = nodes;
    linesRef.current = lines;
  }, []);

  useEffect(() => {
    initializeNetwork();
  }, [initializeNetwork]);

  useEffect(() => {
    const interval = setInterval(() => {
      animationTimeRef.current += 0.016;

      // Update SVG
      const svg = svgRef.current;
      if (!svg) return;

      // Update circles
      nodesRef.current.forEach((node, idx) => {
        const circle = svg.querySelector(`circle[data-id="${idx}"]`) as SVGCircleElement;
        if (circle) {
          const oscillation = Math.sin(animationTimeRef.current * 2 + idx) * 0.3;
          circle.setAttribute("r", String(node.size + oscillation));
          circle.setAttribute(
            "opacity",
            String(node.opacity + oscillation * 0.1)
          );

          // Pulse color change
          const isActive = Math.sin(animationTimeRef.current + idx * 0.5) > 0.3;
          circle.setAttribute("fill", isActive ? "#00D4FF" : "#7C3AED");
        }
      });

      // Update lines
      linesRef.current.forEach((line, idx) => {
        const g = svg.querySelector(`g[data-line-id="${idx}"]`) as SVGGElement;
        if (g) {
          const lineOpacity = line.opacity + Math.sin(animationTimeRef.current * 1.5 + idx) * 0.15;
          g.setAttribute("opacity", String(Math.max(0.05, Math.min(0.5, lineOpacity))));
        }
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
      {/* Lines */}
      {linesRef.current.map((line, idx) => {
        const fromNode = nodesRef.current[line.from];
        const toNode = nodesRef.current[line.to];
        if (!fromNode || !toNode) return null;

        return (
          <g key={`line-${idx}`} data-line-id={idx} opacity={line.opacity}>
            <line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="url(#gradientCyan)"
              strokeWidth="0.5"
              opacity="0.6"
            />
          </g>
        );
      })}

      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="gradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Nodes */}
      {nodesRef.current.map((node, idx) => (
        <circle
          key={`node-${idx}`}
          data-id={idx}
          cx={node.x}
          cy={node.y}
          r={node.size}
          fill={node.color}
          opacity={node.opacity}
          className="transition-opacity"
        />
      ))}
    </svg>
  );
}
