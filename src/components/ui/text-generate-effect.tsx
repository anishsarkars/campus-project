"use client";
import React, { useEffect, useState } from "react";

export function TextGenerateEffect({ words }: { words: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + words[i]);
      i++;
      if (i >= words.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [words]);
  return (
    <span className="whitespace-pre-line font-mono text-lg md:text-2xl text-foreground/90">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
} 