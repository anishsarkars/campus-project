"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { Sun, Moon } from "lucide-react";
import React from "react";
import { useUser, UserButton } from "@clerk/nextjs";

function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
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
      className="ml-2 p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export function Navbar() {
  const { isSignedIn } = useUser();
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-6xl bg-white/80 rounded-xl px-6 py-3 flex items-center justify-between shadow-2xl border border-zinc-200/60 backdrop-blur-lg">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          {/* Placeholder purple logo SVG */}
          <span className="inline-block">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="12" height="12" fill="#a78bfa"/>
              <rect x="18" y="2" width="12" height="12" fill="#a78bfa"/>
              <rect x="2" y="18" width="12" height="12" fill="#a78bfa"/>
              <rect x="18" y="18" width="12" height="12" fill="#a78bfa"/>
              <rect x="7" y="7" width="18" height="18" fill="white" fillOpacity="0.1"/>
            </svg>
          </span>
          <span className="text-2xl font-extrabold text-black tracking-tight">KindCampus</span>
        </div>
        {/* Center Menu */}
        <div className="flex-1 flex justify-center">
          <div className="flex space-x-10">
            <Link href="/" className="text-black font-medium hover:underline transition">Home</Link>
            <Link href="/kindcollab" className="text-black font-medium hover:underline transition">KindCollab</Link>
            <Link href="/kindtasks" className="text-black font-medium hover:underline transition">KindTasks</Link>
          </div>
        </div>
        {/* Right Side Buttons */}
        <div className="flex items-center space-x-3">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button className="text-black font-medium hover:underline transition" variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
} 