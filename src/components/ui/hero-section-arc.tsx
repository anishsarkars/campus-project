"use client";

import React from "react";
import { ChevronDown, ChevronRight, TrendingDown, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

function Gauge({ value, color = "#ef4d23", showLabels = false, min = "", max = "" }: { value: number; color?: string; showLabels?: boolean; min?: string; max?: string }) {
  const activeTicks = Math.round((value / 100) * 40);
  
  return (
    <div className="w-full flex flex-col items-center mt-4">
      <svg viewBox="0 0 200 120" className="w-full max-w-[260px] overflow-visible">
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
            />
          );
        })}
        <text x="100" y="95" textAnchor="middle" fontSize="26" fontWeight="600" fill="#171717">
          {value}%
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
      <div className="relative z-10 w-full h-full flex flex-col pt-24 sm:pt-28 overflow-y-auto overflow-x-hidden no-scrollbar">
        
        {/* Hero Content */}
        <div className="flex flex-col items-center px-4 pt-4 sm:pt-8 pb-8 sm:pb-12 text-center shrink-0">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-[13px] font-medium text-neutral-800">
            <span className="w-2 h-2 rounded-full bg-[#ef4d23]" />
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
            className="mt-4 sm:mt-6 text-neutral-700 px-2 max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(14px, 3.5vw, 17px)' }}
          >
            NextUP connects students and faculty for peer learning, team-ups, and instant feedback on practical tasks—all in one place.
          </p>

          <Link href="/tasks">
            <button className="mt-6 sm:mt-8 inline-flex items-center gap-3 bg-[#0b0f1a] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5 text-[15px] font-medium hover:opacity-90 transition">
              Get Started
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className="px-3 sm:px-4 pb-12 w-full flex-1 shrink-0">
          <div className="bg-[#f5f2ee] rounded-3xl p-4 sm:p-6 w-full max-w-[880px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              
              {/* Card 1: Skill Swaps */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-[13px]">
                    <span className="text-[#ef4d23]">Swaps</span>
                    <span className="text-neutral-500">This Month</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-end gap-2">
                  <div className="text-[28px] font-semibold text-neutral-900 leading-none">6,896</div>
                  <div className="flex items-center gap-1 bg-red-50 text-red-600 rounded-full px-2 py-0.5 text-[11px] font-medium mb-1">
                    <TrendingDown className="w-3 h-3" />
                    -3,382 (33%)
                  </div>
                </div>
                <div className="text-[12px] text-neutral-500 mt-1.5">Compared to yesterday</div>
                
                <div className="mt-6 bg-green-50 text-green-700 text-[12px] font-medium py-1 px-3 rounded-lg text-center mx-auto w-max">
                  Month Target achieved
                </div>

                <div className="mt-auto">
                  <Gauge value={92} showLabels min="389K" max="425K" />
                </div>

                <div className="mt-4 bg-neutral-100 rounded-full p-1 flex items-center w-full">
                  <div className="flex-1 text-center bg-white shadow-sm rounded-full py-1.5 text-[12px] font-medium text-neutral-800">
                    Active Swaps
                  </div>
                  <div className="flex-1 text-center py-1.5 text-[12px] font-medium text-neutral-500">
                    Total Swaps
                  </div>
                </div>
              </div>

              {/* Card 2: Targets Form */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col gap-4">
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
                    <input type="number" defaultValue={10} className="w-full border border-neutral-200 rounded-lg pl-7 pr-3 py-2 text-[13px] font-medium text-neutral-800 focus:outline-none focus:border-[#ef4d23]" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-neutral-700">Set targets (This year)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium text-[13px]">#</span>
                    <input type="number" defaultValue={100} className="w-full border border-neutral-200 rounded-lg pl-7 pr-3 py-2 text-[13px] font-medium text-neutral-800 focus:outline-none focus:border-[#ef4d23]" />
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center border-t border-neutral-100">
                  <button className="bg-[#ef4d23] text-white rounded-lg px-5 py-2 text-[13px] font-medium hover:opacity-90 transition">
                    Save
                  </button>
                  <button className="text-neutral-500 text-[13px] font-medium underline ml-4 hover:text-neutral-800 transition">
                    Cancel
                  </button>
                  <button className="ml-auto text-neutral-400 hover:text-neutral-600 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card 3: Tasks */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col lg:col-span-1 sm:col-span-2 col-span-1">
                <div className="flex items-center gap-1.5 font-medium text-[13px]">
                  <span className="text-[#ef4d23]">Tasks Started</span>
                  <span className="text-neutral-500">today</span>
                </div>
                
                <div className="mt-4 flex items-end gap-2">
                  <div className="text-[28px] font-semibold text-neutral-900 leading-none">0</div>
                  <div className="flex items-center gap-1 bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5 text-[11px] font-medium mb-1">
                    <TrendingUp className="w-3 h-3" />
                    0
                  </div>
                </div>
                <div className="text-[12px] text-neutral-500 mt-1.5">Compared to yesterday</div>

                <div className="mt-auto">
                  <Gauge value={68} color="#9ca3af" />
                </div>

                <div className="mt-4 bg-neutral-100 rounded-full p-1 flex items-center w-full">
                  <div className="flex-1 text-center bg-white shadow-sm rounded-full py-1.5 text-[12px] font-medium text-neutral-800">
                    Tasks Completed
                  </div>
                  <div className="flex-1 text-center py-1.5 text-[12px] font-medium text-neutral-500">
                    Tasks Started
                  </div>
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