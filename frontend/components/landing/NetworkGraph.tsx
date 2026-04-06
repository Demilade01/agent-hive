"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  status: "active" | "idle";
  pulsePhase: number;
}

interface Connection {
  from: number;
  to: number;
}

export function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const initializeNetwork = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Create nodes
    const nodes: Node[] = [];
    for (let i = 0; i < 25; i++) {
      nodes.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        status: Math.random() > 0.7 ? "active" : "idle",
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Create connections (nearest neighbors)
    const connections: Connection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      // Connect to 2-3 nearest nodes
      const distances = nodes.map((node, idx) => ({
        idx,
        dist: Math.hypot(node.x - nodes[i].x, node.y - nodes[i].y),
      }));
      distances
        .sort((a, b) => a.dist - b.dist)
        .slice(1, 4)
        .forEach((d) => {
          if (!connections.some((c) => c.from === i && c.to === d.idx)) {
            connections.push({ from: i, to: d.idx });
          }
        });
    }

    nodesRef.current = nodes;
    connectionsRef.current = connections;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    // Update canvas size
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, width, height);

    const nodes = nodesRef.current;

    // Update and draw nodes
    nodes.forEach((node) => {
      // Update position with bounds checking
      node.x += node.vx;
      node.y += node.vy;

      if (node.x <= 0 || node.x >= width) node.vx *= -1;
      if (node.y <= 0 || node.y >= height) node.vy *= -1;

      node.x = Math.max(0, Math.min(width, node.x));
      node.y = Math.max(0, Math.min(height, node.y));

      // Update pulse phase
      node.pulsePhase = (node.pulsePhase + 0.02) % (Math.PI * 2);

      // Randomly change status
      if (Math.random() < 0.002) {
        node.status = node.status === "active" ? "idle" : "active";
      }

      // Draw node
      const pulseSize =
        3 + (Math.sin(node.pulsePhase) + 1) * 1.5;
      const radius =
        node.status === "active" ? 4 + pulseSize : 3 + pulseSize * 0.5;

      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 2);

      if (node.status === "active") {
        gradient.addColorStop(0, "rgba(0, 212, 255, 0.8)");
        gradient.addColorStop(1, "rgba(0, 212, 255, 0.1)");
        ctx.fillStyle = gradient;
      } else {
        gradient.addColorStop(0, "rgba(124, 58, 237, 0.6)");
        gradient.addColorStop(1, "rgba(124, 58, 237, 0.05)");
        ctx.fillStyle = gradient;
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw core dot
      ctx.fillStyle =
        node.status === "active" ? "rgba(0, 212, 255, 1)" : "rgba(124, 58, 237, 1)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, 1, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw connections
    const connections = connectionsRef.current;
    connections.forEach((conn) => {
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];

      const distance = Math.hypot(toNode.x - fromNode.x, toNode.y - fromNode.y);

      if (distance < 300) {
        const opacity = Math.max(0.1, 1 - distance / 300);
        const isActivePath =
          fromNode.status === "active" || toNode.status === "active";

        ctx.strokeStyle = isActivePath
          ? `rgba(0, 212, 255, ${opacity * 0.3})`
          : `rgba(124, 58, 237, ${opacity * 0.15})`;

        ctx.lineWidth = isActivePath ? 1.5 : 1;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    initializeNetwork();

    const handleResize = () => {
      initializeNetwork();
    };

    window.addEventListener("resize", handleResize);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeNetwork, animate]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full h-full absolute inset-0"
    />
  );
}
