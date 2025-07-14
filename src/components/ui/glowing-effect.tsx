"use client";
import React from "react";

interface GlowingEffectProps {
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
}

export const GlowingEffect: React.FC<GlowingEffectProps> = ({
  spread = 40,
  glow = true,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.01,
}) => {
  if (disabled) return null;
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 rounded-2xl overflow-hidden`}
      style={{
        filter: glow ? `blur(${spread / 2}px)` : undefined,
        opacity: 0.7,
        background:
          "radial-gradient(circle at 60% 40%, rgba(80,180,255,0.18) 0%, rgba(80,180,255,0.08) 60%, transparent 100%)",
        transition: "background 0.3s, filter 0.3s",
      }}
    />
  );
}; 