"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  intensity?: number;
}

export function TiltCard({
  children,
  className = "",
  glowColor = "rgba(249, 115, 22, 0.22)",
  onClick,
  intensity = 8,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);

  const smoothX = useSpring(mouseX, { stiffness: 220, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 220, damping: 24 });

  const rotateX = useTransform(smoothY, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(smoothX, [0, 1], [-intensity, intensity]);

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotX}% ${spotY}%, ${glowColor}, transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    mouseX.set(xPct);
    mouseY.set(yPct);
    spotX.set(xPct * 100);
    spotY.set(yPct * 100);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div style={{ perspective: "1200px" }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileTap={onClick ? { scale: 0.985 } : undefined}
        className={`group relative h-full overflow-hidden rounded-2xl glass-panel glass-panel-hover ${
          onClick ? "cursor-pointer" : ""
        } ${className}`}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </div>
  );
}
