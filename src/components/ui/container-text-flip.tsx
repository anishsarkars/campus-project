"use client";
import React, { useEffect, useState } from "react";

export function ContainerTextFlip({ words, interval = 1800 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval]);
  return (
    <span className="inline-block transition-transform duration-500 ease-in-out will-change-transform animate-flip text-primary font-bold">
      {words[index]}
    </span>
  );
} 