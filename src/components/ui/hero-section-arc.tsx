"use client";

import React from "react";
import { ChevronDown, ChevronRight, TrendingDown, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = React.useState(0);
  
  React.useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(value);
      return;
    }
    const duration = 1500;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(start + (end - start) * ease));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return <>{displayValue.toLocaleString()}</>;
}

function Gauge({ value, color = "#ef4d23", showLabels = false, min = "", max = "" }: { value: number; color?: string; showLabels?: boolean; min?: string; max?: string }) {
  const [currentValue, setCurrentValue] = React.useState(value);
  const [mounted, setMounted] = React.useState(false);

  // Start animation after component mounts on client
  React.useEffect(() => {
    setMounted(true);
    let start = 0;
    const end = value;
    if (start === end) {
      setCurrentValue(value);
      return;
    }
    const duration = 1500;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCurrentValue(Math.floor(start + (end - start) * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  const activeTicks = Math.round((currentValue / 100) * 40);

  // Prevent SSR mismatch: render nothing until mounted
  if (!mounted) return null;

  return (
    <div className="w-full flex flex-col items-center mt-2 sm:mt-4">
      <svg viewBox="0 0 200 120" className="w-full max-w-[180px] sm:max-w-[260px] overflow-visible">
        {Array.from({ length: 40 }).map((_, i) => {
          // Angle from PI to 2*PI
          const angle = Math.PI + (i / 39) * Math.PI;
          const r1 = 70; // Inner radius
          const r2 = 80; // Outer radius
          
          const x1 = 100 + r1 * Math.cos(angle);
          const y1 = 100 + r1 * Math.sin(angle);
          const x2 = 100 + r2 * Math.cos(angle);
          const y2 = 100 + r2 * Math.sin(angle);
          
          const isActive = i < activeTicks;
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isActive ? color : "#d4d4d8"}
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-colors duration-200"
            />
          );
        })}
        <text x="100" y="95" textAnchor="middle" fontSize="26" fontWeight="600" fill="#171717">
          {currentValue}%
        </text>
      </svg>
      {showLabels && (
        <div className="flex justify-between w-full mt-1 text-[11px] text-neutral-500 px-4 font-medium">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}

export function HeroSectionArc() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [monthTarget, setMonthTarget] = React.useState(7500);
  const [yearTarget, setYearTarget] = React.useState(50000);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const [activeTab, setActiveTab] = React.useState("This month");
  const [activeTaskTab, setActiveTaskTab] = React.useState<"completed" | "started">("completed");

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/tasks");
    } else {
      router.push("/auth");
    }
  };

  const currentSwapsMonth = 6896;
  const currentSwapsYear = 38920;
  
  const monthPercentage = Math.min(100, Math.round((currentSwapsMonth / Math.max(1, monthTarget)) * 100));
  const yearPercentage = Math.min(100, Math.round((currentSwapsYear / Math.max(1, yearTarget)) * 100));

  const taskData = {
    completed: { number: 182, trend: "+8%", gauge: 85, color: "#10b981" },
    started: { number: 248, trend: "+12%", gauge: 68, color: "#9ca3af" }
  };

  return (
    <div className="relative w-full h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl mt-4">
      {/* Background Video */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        // @ts-ignore
        webkit-playsinline="true"
        x5-playsinline="true"
        poster="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 bg-white/10 pointer-events-none" />

      {/* Foreground wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col pt-20 sm:pt-28 overflow-y-auto overflow-x-hidden no-scrollbar">
        
        {/* Hero Content */}
        <div className="flex flex-col items-center px-4 pt-4 sm:pt-8 pb-8 sm:pb-12 text-center shrink-0">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-[13px] font-medium text-neutral-800">
            <span className="w-2 h-2 rounded-full bg-[#ef4d23] animate-pulse" />
            NextUP
          </div>

          <h1 
            className="text-neutral-900 mt-5 sm:mt-6 max-w-4xl mx-auto"
            style={{ fontSize: 'clamp(36px, 8vw, 72px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            Find Study <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 }}>Buddies,</span> <br />
            Swap Skills & Ace Tasks
          </h1>

          <p 
            className="mt-3 sm:mt-6 text-neutral-700 px-4 max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(14px, 3vw, 17px)' }}
          >
            NextUP connects students and faculty for peer learning, team-ups, and instant feedback on practical tasks—all in one place.
          </p>

          <button onClick={handleGetStarted} className="mt-6 sm:mt-8 inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5 text-[15px] font-medium hover:opacity-90 transition transform hover:scale-105 active:scale-95 duration-200">
            Get Started
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="px-3 sm:px-4 pb-8 sm:pb-12 w-full flex-1 shrink-0">
          <div className="bg-[#f5f2ee] rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-[880px] mx-auto hover:shadow-xl transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              
              {/* Card 1: Skill Swaps */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-[13px]">
                    <span className="text-[#ef4d23]">Swaps</span>
                    <span className="text-neutral-500">{activeTab}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-end gap-2">
                  <div className="text-[28px] font-semibold text-neutral-900 leading-none">
                    <AnimatedNumber value={activeTab === "This month" ? currentSwapsMonth : currentSwapsYear} />
                  </div>
                  <div className={`flex items-center gap-1 ${activeTab === "This month" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"} rounded-full px-2 py-0.5 text-[11px] font-medium mb-1`}>
                    {activeTab === "This month" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {activeTab === "This month" ? "+420 (12%)" : "-3,382 (33%)"}
                  </div>
                </div>
                <div className="text-[12px] text-neutral-500 mt-1.5">Compared to yesterday</div>
                
                <div className={`mt-4 sm:mt-6 text-[11px] sm:text-[12px] font-medium py-1 px-3 rounded-lg text-center mx-auto w-max transition-colors duration-500 ${
                  (activeTab === "This month" ? monthPercentage : yearPercentage) >= 100 
                    ? "bg-green-50 text-green-700" 
                    : "bg-amber-50 text-amber-700"
                }`}>
                  {(activeTab === "This month" ? monthPercentage : yearPercentage) >= 100 
                    ? "Target achieved 🎉" 
                    : "On track to target"}
                </div>

                <div className="mt-auto">
                  <Gauge 
                    value={activeTab === "This month" ? monthPercentage : yearPercentage} 
                    showLabels 
                    min="0" 
                    max={activeTab === "This month" ? monthTarget.toLocaleString() : yearTarget.toLocaleString()} 
                  />
                </div>

                <div className="mt-4 bg-neutral-100 rounded-full p-1 flex items-center w-full">
                  <button onClick={() => setActiveTab("This month")} className={`flex-1 text-center shadow-sm rounded-full py-1 sm:py-1.5 text-[11px] sm:text-[12px] font-medium transition-colors ${activeTab === "This month" ? "bg-white text-neutral-800" : "text-neutral-500 hover:text-neutral-700"}`}>
                    This month
                  </button>
                  <button onClick={() => setActiveTab("This year")} className={`flex-1 text-center rounded-full py-1 sm:py-1.5 text-[11px] sm:text-[12px] font-medium transition-colors ${activeTab === "This year" ? "bg-white text-neutral-800 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
                    This year
                  </button>
                </div>
              </div>

              {/* Card 2: Targets Form */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-neutral-700">Show figures for</label>
                  <button className="flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-800 hover:bg-neutral-50 transition text-left">
                    This month
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-neutral-700">Compare period by</label>
                  <button className="flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-800 hover:bg-neutral-50 transition text-left">
                    Month-to-date (MTD)
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>

                <div className="h-px bg-neutral-100 my-1" />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-neutral-700">Set targets (This month)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium text-[13px]">#</span>
                    <input type="number" value={monthTarget} onChange={e => setMonthTarget(Number(e.target.value))} className="w-full border border-neutral-200 rounded-lg pl-7 pr-3 py-2 text-[13px] font-medium text-neutral-800 focus:outline-none focus:border-[#ef4d23] transition-colors" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-neutral-700">Set targets (This year)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium text-[13px]">#</span>
                    <input type="number" value={yearTarget} onChange={e => setYearTarget(Number(e.target.value))} className="w-full border border-neutral-200 rounded-lg pl-7 pr-3 py-2 text-[13px] font-medium text-neutral-800 focus:outline-none focus:border-[#ef4d23] transition-colors" />
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center border-t border-neutral-100">
                  <button onClick={handleSave} disabled={isSaving} className={`rounded-lg px-5 py-2 text-[13px] font-medium transition-all ${saved ? "bg-green-500 text-white" : "bg-[#ef4d23] text-white hover:opacity-90"} ${isSaving ? "opacity-70 cursor-wait" : ""}`}>
                    {isSaving ? "Saving..." : saved ? "Saved!" : "Save"}
                  </button>
                  <button onClick={() => { setMonthTarget(7500); setYearTarget(50000); }} className="text-neutral-500 text-[13px] font-medium underline ml-4 hover:text-neutral-800 transition">
                    Reset
                  </button>
                  <button className="ml-auto text-neutral-400 hover:text-neutral-600 transition hover:rotate-90">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card 3: Tasks */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col lg:col-span-1 sm:col-span-2 col-span-1 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-1.5 font-medium text-[13px]">
                  <span className="text-[#ef4d23]">Tasks {activeTaskTab === "completed" ? "Completed" : "Started"}</span>
                  <span className="text-neutral-500">today</span>
                </div>
                
                <div className="mt-4 flex items-end gap-2">
                  <div className="text-[28px] font-semibold text-neutral-900 leading-none">
                    <AnimatedNumber value={taskData[activeTaskTab].number} />
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 text-green-600 rounded-full px-2 py-0.5 text-[11px] font-medium mb-1">
                    <TrendingUp className="w-3 h-3" />
                    {taskData[activeTaskTab].trend}
                  </div>
                </div>
                <div className="text-[12px] text-neutral-500 mt-1.5">Compared to yesterday</div>

                <div className="mt-auto">
                  <Gauge value={taskData[activeTaskTab].gauge} color={taskData[activeTaskTab].color} />
                </div>

                <div className="mt-4 bg-neutral-100 rounded-full p-1 flex items-center w-full">
                  <button onClick={() => setActiveTaskTab("completed")} className={`flex-1 text-center rounded-full py-1.5 text-[12px] font-medium transition-colors ${activeTaskTab === "completed" ? "bg-white shadow-sm text-neutral-800" : "text-neutral-500 hover:text-neutral-700"}`}>
                    Tasks Completed
                  </button>
                  <button onClick={() => setActiveTaskTab("started")} className={`flex-1 text-center rounded-full py-1.5 text-[12px] font-medium transition-colors ${activeTaskTab === "started" ? "bg-white shadow-sm text-neutral-800" : "text-neutral-500 hover:text-neutral-700"}`}>
                    Tasks Started
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        /* Hide scrollbar for the hero inner scrolling */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}