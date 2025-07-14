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
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white/80 dark:bg-background/80 border-b border-zinc-200/60 backdrop-blur-lg">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-3">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <span className="inline-block">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="12" height="12" fill="#a78bfa"/>
              <rect x="18" y="2" width="12" height="12" fill="#a78bfa"/>
              <rect x="2" y="18" width="12" height="12" fill="#a78bfa"/>
              <rect x="18" y="18" width="12" height="12" fill="#a78bfa"/>
              <rect x="7" y="7" width="18" height="18" fill="white" fillOpacity="0.1"/>
            </svg>
          </span>
          <span className="text-2xl font-extrabold text-black dark:text-white tracking-tight">KindCampus</span>
        </div>
        {/* Hamburger for mobile */}
        <button className="md:hidden ml-auto p-2" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="block w-6 h-0.5 bg-black dark:bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-black dark:bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-black dark:bg-white"></span>
        </button>
        {/* Center Menu */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex space-x-10">
            <Link href="/" className="text-black dark:text-white font-medium hover:underline transition">Home</Link>
            <Link href="/kindcollab" className="text-black dark:text-white font-medium hover:underline transition">KindCollab</Link>
            <Link href="/kindtasks" className="text-black dark:text-white font-medium hover:underline transition">KindTasks</Link>
          </div>
        </div>
        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button className="text-black dark:text-white font-medium hover:underline transition" variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
          )}
          <ThemeToggle />
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden w-full bg-white dark:bg-background border-t border-zinc-200/60 px-4 pb-4">
          <div className="flex flex-col space-y-2 mt-2">
            <Link href="/" className="text-black dark:text-white font-medium hover:underline transition" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/kindcollab" className="text-black dark:text-white font-medium hover:underline transition" onClick={() => setMenuOpen(false)}>KindCollab</Link>
            <Link href="/kindtasks" className="text-black dark:text-white font-medium hover:underline transition" onClick={() => setMenuOpen(false)}>KindTasks</Link>
            <div className="flex items-center space-x-3 mt-2">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <SignInButton mode="modal">
                  <Button className="text-black dark:text-white font-medium hover:underline transition" variant="ghost" size="sm">
                    Sign in
                  </Button>
                </SignInButton>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 