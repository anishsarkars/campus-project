"use client";
import React, { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { GlowingEffectDemo } from "@/components/ui/glowing-effect-demo";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

const images = [
  // Demo images matching the reference (AI/3D/abstract/nature/city)
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // nature
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", // car
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", // abstract
  "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80", // city
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80", // phone
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", // leaf
  "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=400&q=80", // hands
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80", // art supplies
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80", // code
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80", // friends
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", // abstract2
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // nature2
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", // car2
  "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80", // city2
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80", // phone2
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", // leaf2
];

const menu = [
  { name: "KindCollab", href: "/kindcollab" },
  { name: "KindTasks", href: "/kindtasks" },
];

// Arc parameters for a wide, flat, premium arc
const ARC_RADIUS_X = 650;
const ARC_RADIUS_Y = 150;
const ARC_CENTER_Y = 150;
const ARC_IMG_SIZE = 120;
const ARC_START_ANGLE = Math.PI * 1.08;
const ARC_END_ANGLE = Math.PI * -0.08;

function getArcPositionByAngle(angle: number) {
  const x = ARC_RADIUS_X * Math.cos(angle);
  const y = ARC_RADIUS_Y * Math.sin(angle);
  return { x, y };
}

function getArcPositions(n: number) {
  const positions = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const angle = ARC_START_ANGLE + t * (ARC_END_ANGLE - ARC_START_ANGLE);
    const x = ARC_RADIUS_X * Math.cos(angle);
    const y = ARC_RADIUS_Y * Math.sin(angle);
    // Slight, consistent rotation for premium look
    const rotate = ((angle * 180) / Math.PI + 90) + (i % 2 === 0 ? 8 : -8);
    positions.push({ x, y, rotate });
  }
  return positions;
}

const arcPositions = getArcPositions(images.length);

function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // On mount, check system or saved preference
    const root = window.document.documentElement;
    const saved = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && systemDark)) {
      root.classList.add("dark");
      setIsDark(true);
    } else {
      root.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="ml-4 p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export function HeroSectionArc() {
  // Animate the arc images smoothly along the arc
  const [baseAngle, setBaseAngle] = useState(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    const lastTimeRef = { current: performance.now() };
    const animate = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;
      setBaseAngle((prev) => prev + (delta * 0.00009)); // slower speed
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  const n = images.length;
  // Evenly distribute images along the arc, and animate their base angle
  const arcAngles = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return ARC_START_ANGLE + t * (ARC_END_ANGLE - ARC_START_ANGLE) + baseAngle;
  });

  // Add a gentle oscillating (up/down) motion for each image
  const nowRef = useRef(performance.now());
  useEffect(() => {
    const updateNow = () => {
      nowRef.current = performance.now();
      requestAnimationFrame(updateNow);
    };
    requestAnimationFrame(updateNow);
    return () => {};
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="w-full flex flex-col items-center justify-center py-16 md:py-28 relative overflow-visible">
          {/* Animated Spotlight Background */}
          <div className="pointer-events-none select-none absolute left-1/2 top-0 -translate-x-1/2 z-0 w-[900px] h-[400px]" style={{filter: 'blur(8px)', opacity: 0.7}}>
            <div className="w-full h-full animate-spotlight-move" style={{
              background: 'radial-gradient(circle at 60% 40%, rgba(80,180,255,0.18) 0%, rgba(80,180,255,0.08) 60%, transparent 100%)',
              width: '100%',
              height: '100%',
            }} />
          </div>

          {/* Arc Images (animated) */}
          <div className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 -top-32 z-10" style={{ width: 800, height: 220 }}>
            {images.map((src, i) => {
              const angle = arcAngles[i];
              const { x, y } = getArcPositionByAngle(angle);
              // Slight, consistent rotation for premium look
              const rotate = ((angle * 180) / Math.PI + 90) + (i % 2 === 0 ? 8 : -8);
              return (
                <img
                  key={i}
                  src={src}
                  alt="Arc"
                  className={`rounded-2xl shadow-2xl object-cover border-4 border-white dark:border-background absolute transition-transform duration-300`}
                  style={{
                    width: ARC_IMG_SIZE,
                    height: ARC_IMG_SIZE,
                    left: x + 400 - ARC_IMG_SIZE / 2, // center in 800px
                    top: y + 20, // visually center in 220px
                    transform: `rotate(${rotate}deg)`
                  }}
                />
              );
            })}
          </div>

          {/* Centered Content */}
          <div className="relative z-20 flex flex-col items-center justify-center mt-[120px] mb-8 px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-center mb-4 leading-tight text-foreground">
              Find Study Buddies, Swap Skills,<br />and Ace Assignments
            </h1>
            <p className="text-muted-foreground text-center max-w-xl mb-6 text-lg font-light">
              KindCampus connects students and faculty for peer learning, team-ups, and instant feedback on practical tasks—all in one place.
            </p>
            <div className="flex gap-4 mb-10">
              <Link href="/kindcollab">
                <button className="bg-foreground text-background px-7 py-3 rounded-full font-medium text-lg shadow hover:bg-primary transition flex items-center gap-2">
                  Go to Collab
                </button>
              </Link>
              <Link href="/kindtasks">
                <button className="bg-foreground text-background px-7 py-3 rounded-full font-medium text-lg shadow hover:bg-primary transition flex items-center gap-2">
                  Go to Tasks
                </button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="relative z-20 flex flex-col md:flex-row gap-8 w-full max-w-3xl justify-center mt-2 pb-4">
            <div className="flex-1 text-center">
              <div className="font-semibold mb-1 text-foreground">Real Connections</div>
              <div className="text-muted-foreground text-sm">Meet new friends and teammates instantly for collaborative learning.</div>
            </div>
            <div className="flex-1 text-center">
              <div className="font-semibold mb-1 text-foreground">Instant Feedback</div>
              <div className="text-muted-foreground text-sm">Get AI-powered hints and grading for assignments and projects.</div>
            </div>
            <div className="flex-1 text-center">
              <div className="font-semibold mb-1 text-foreground">All-in-One Platform</div>
              <div className="text-muted-foreground text-sm">Skill-swap, team up, and complete practical tasks in one app.</div>
            </div>
          </div>

          {/* Glowing Feature Grid */}
          <div className="relative z-20 w-full max-w-6xl mx-auto mt-8 mb-4 px-2">
            <GlowingEffectDemo />
          </div>
        </section>
      </main>
    </div>
  );
}

// Custom Animations: move out of render tree to fix styled-jsx error
// Use global so classes/keyframes are available everywhere
// prettier-ignore
export default function HeroSectionArcStyles() {
  return (
    <style jsx global>{`
      @keyframes spotlight-move {
        0% { background-position: 60% 40%; }
        50% { background-position: 50% 60%; }
        100% { background-position: 60% 40%; }
      }
      .animate-spotlight-move {
        animation: spotlight-move 8s ease-in-out infinite;
      }
      @keyframes arc-float0 {
        0% { transform: translateY(0px) scale(1) rotate(0deg); }
        50% { transform: translateY(-8px) scale(1.03) rotate(2deg); }
        100% { transform: translateY(0px) scale(1) rotate(0deg); }
      }
      @keyframes arc-float1 {
        0% { transform: translateY(0px) scale(1) rotate(0deg); }
        50% { transform: translateY(6px) scale(0.98) rotate(-2deg); }
        100% { transform: translateY(0px) scale(1) rotate(0deg); }
      }
      @keyframes arc-float2 {
        0% { transform: translateY(0px) scale(1) rotate(0deg); }
        50% { transform: translateY(-10px) scale(1.01) rotate(1deg); }
        100% { transform: translateY(0px) scale(1) rotate(0deg); }
      }
      @keyframes arc-float3 {
        0% { transform: translateY(0px) scale(1) rotate(0deg); }
        50% { transform: translateY(7px) scale(1.02) rotate(-1deg); }
        100% { transform: translateY(0px) scale(1) rotate(0deg); }
      }
      @keyframes arc-float4 {
        0% { transform: translateY(0px) scale(1) rotate(0deg); }
        50% { transform: translateY(-6px) scale(0.99) rotate(2deg); }
        100% { transform: translateY(0px) scale(1) rotate(0deg); }
      }
      .animate-arc-float0 { animation: arc-float0 7.5s ease-in-out infinite; }
      .animate-arc-float1 { animation: arc-float1 8.2s ease-in-out infinite; }
      .animate-arc-float2 { animation: arc-float2 7.8s ease-in-out infinite; }
      .animate-arc-float3 { animation: arc-float3 8.5s ease-in-out infinite; }
      .animate-arc-float4 { animation: arc-float4 7.9s ease-in-out infinite; }
    `}</style>
  );
} 