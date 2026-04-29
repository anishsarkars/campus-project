"use client";

import { Sun, Moon, ChevronRight, Menu } from "lucide-react";
import React, { useState } from "react";
import { getStoredNextCoins } from "@/lib/nextcoins";
import { useTheme } from "next-themes";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle dark mode"
        className="p-2 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 transition"
      >
        <Moon className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="p-2 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 transition"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState(0);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const update = (balance?: number) => {
      setCoins(balance ?? getStoredNextCoins());
    };
    update();
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ balance?: number }>).detail;
      update(detail?.balance);
    };
    window.addEventListener("nextcoins:add" as any, handler);
    return () => {
      window.removeEventListener("nextcoins:add" as any, handler);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full z-50 flex justify-center pt-4 sm:pt-6 px-3 sm:px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-white rounded-full shadow-sm border border-neutral-200 pl-4 pr-2 py-2 w-full max-w-[760px] relative flex items-center justify-between font-sans">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg viewBox="0 0 32 32" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="3.5" fill="#ef4d23" />
            <circle cx="16" cy="6" r="3.5" fill="#ef4d23" />
            <circle cx="23" cy="9" r="3.5" fill="#ef4d23" />
            <circle cx="26" cy="16" r="3.5" fill="#ef4d23" />
            <circle cx="23" cy="23" r="3.5" fill="#ef4d23" />
            <circle cx="16" cy="26" r="3.5" fill="#ef4d23" />
            <circle cx="9" cy="23" r="3.5" fill="#ef4d23" />
            <circle cx="6" cy="16" r="3.5" fill="#ef4d23" />
            <circle cx="9" cy="9" r="3.5" fill="#ef4d23" />
          </svg>
          <span className="font-semibold text-neutral-900 text-[15px] tracking-tight hidden sm:block">NextUP</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-[14px] text-neutral-700 font-medium">
          <Link href="/" className="flex items-center gap-1.5 hover:text-black transition">
            <div className="w-[1.5px] h-[1.5px] bg-black rounded-full" />
            Home
          </Link>
          <Link href="/skillswap" className="hover:text-black transition">SkillSwap</Link>
          <Link href="/collab" className="hover:text-black transition">Collab</Link>
          <Link href="/tasks" className="hover:text-black transition">Tasks</Link>
          <Link href="/discovery" className="hover:text-black transition">Discovery</Link>
        </div>

        {/* Right Cluster */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-800">
            <span className="text-xs text-neutral-500">Coins</span>
            {coins}
          </div>
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="bg-[#ef4d23] text-white rounded-full px-5 py-1.5 text-[14px] font-medium hover:opacity-90 transition">
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton afterSignOutUrl="/" />
          </Show>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button 
            className="p-2 text-neutral-700" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-200 p-5 z-20 flex flex-col gap-4 font-sans md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <Link href="/" className="text-neutral-800 font-semibold text-[16px] py-1 border-b border-neutral-50" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/skillswap" className="text-neutral-700 font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>SkillSwap</Link>
            <Link href="/collab" className="text-neutral-700 font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>Collab</Link>
            <Link href="/tasks" className="text-neutral-700 font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>Tasks</Link>
            <Link href="/discovery" className="text-neutral-700 font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>Discovery</Link>
            
            <div className="h-px bg-neutral-100 my-1" />
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900 text-[16px]">
                <span className="text-neutral-400 font-medium">Coins</span>
                {coins}
              </div>
              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="bg-[#ef4d23] text-white rounded-full px-6 py-2.5 text-[15px] font-semibold shadow-md active:scale-95 transition-transform">
                      Sign In
                    </button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <div className="scale-110">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </Show>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}