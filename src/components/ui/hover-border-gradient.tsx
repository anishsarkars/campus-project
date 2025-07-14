"use client";
import React from "react";

export function HoverBorderGradient({
  children,
  containerClassName = "",
  as: Component = "div",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  containerClassName?: string;
  as?: any;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={`relative inline-block overflow-hidden ${containerClassName}`}
      {...props}
    >
      <span className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-lg" />
      <span className={`relative z-10 ${className}`}>{children}</span>
    </Component>
  );
} 