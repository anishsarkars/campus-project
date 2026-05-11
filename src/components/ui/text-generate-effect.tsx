"use client";
import React, { useEffect, useState } from "react";

export function TextGenerateEffect({ words }: { words: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    if (!words) return;
    const interval = setInterval(() => {
      if (words && i < words.length) {
        const char = words[i];
        if (char !== undefined) {
          setDisplayed((prev) => prev + char);
        }
        i++;
      } else {
        clearInterval(interval);
      }
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