"use client";

import { Sun, Moon, Menu, Bell, User, LogOut, Coins, Link2, X } from "lucide-react";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";
import type { StudentProfile } from "@/types";

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
        className="p-2 rounded-full border border-border bg-card text-foreground hover:bg-accent transition"
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
      className="p-2 rounded-full border border-border bg-card text-foreground hover:bg-accent transition"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, profile, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const coinBalance = profile && "coin_balance" in profile ? (profile as StudentProfile).coin_balance ?? 0 : 0;

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setMenuOpen(false);
  };

  return (
    <div className="absolute top-0 left-0 w-full z-50 flex justify-center pt-4 sm:pt-6 px-3 sm:px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-card/90 backdrop-blur-md rounded-full shadow-sm border border-border pl-4 pr-2 py-2 w-full max-w-[760px] relative flex items-center justify-between font-sans">
        
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
          <span className="font-semibold text-foreground text-[15px] tracking-tight hidden sm:block">NextUP</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-[14px] text-muted-foreground font-medium">
          <Link href="/" className="flex items-center gap-1.5 hover:text-foreground transition">
            <div className="w-[1.5px] h-[1.5px] bg-foreground rounded-full" />
            Home
          </Link>
          <Link href="/skillswap" className="hover:text-foreground transition">SkillSwap</Link>
          <Link href="/collab" className="hover:text-foreground transition">Collab</Link>
          <Link href="/tasks" className="hover:text-foreground transition">Tasks</Link>
          <Link href="/discovery" className="hover:text-foreground transition">Discovery</Link>
        </div>

        {/* Right Cluster */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isAuthenticated && user?.role === "student" && (
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-muted-foreground">Coins</span>
              {coinBalance}
            </div>
          )}
          
          {isAuthenticated && (
            <Link href="/notifications" className="relative p-2 rounded-full border border-border bg-card text-foreground hover:bg-accent transition">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ef4d23] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          )}
          
          <ThemeToggle />
          
          {!isAuthenticated ? (
            <Link
              href="/auth"
              className="bg-[#ef4d23] text-white rounded-full px-5 py-1.5 text-[14px] font-medium hover:opacity-90 transition"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-full bg-[#ef4d23] text-white flex items-center justify-center text-sm font-bold hover:opacity-90 transition"
              >
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl shadow-xl border border-border py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                  <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link href="/connections" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition">
                    <Link2 className="w-4 h-4" /> Connections
                  </Link>
                  <Link href="/notifications" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition">
                    <Bell className="w-4 h-4" /> Notifications
                    {unreadCount > 0 && <span className="ml-auto bg-[#ef4d23] text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                  </Link>
                  {user?.role === "student" && (
                    <Link href="/transactions" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition">
                      <Coins className="w-4 h-4" /> Transactions
                    </Link>
                  )}
                  <div className="border-t border-border mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-500/10 transition">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && (
            <Link href="/notifications" className="relative p-2 text-foreground">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#ef4d23] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {unreadCount > 9 ? "+" : unreadCount}
                </span>
              )}
            </Link>
          )}
          <ThemeToggle />
          <button 
            className="p-2 text-foreground" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-border p-5 z-20 flex flex-col gap-4 font-sans md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <Link href="/" className="text-foreground font-semibold text-[16px] py-1 border-b border-border" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/skillswap" className="text-muted-foreground font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>SkillSwap</Link>
            <Link href="/collab" className="text-muted-foreground font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>Collab</Link>
            <Link href="/tasks" className="text-muted-foreground font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>Tasks</Link>
            <Link href="/discovery" className="text-muted-foreground font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>Discovery</Link>
            
            {isAuthenticated && (
              <>
                <div className="h-px bg-border" />
                <Link href="/profile" className="text-muted-foreground font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link href="/connections" className="text-muted-foreground font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>Connections</Link>
                {user?.role === "student" && (
                  <Link href="/transactions" className="text-muted-foreground font-medium text-[16px] py-1" onClick={() => setMenuOpen(false)}>Transactions</Link>
                )}
              </>
            )}
            
            <div className="h-px bg-border my-1" />
            
            <div className="flex items-center justify-between pt-2">
              {isAuthenticated && user?.role === "student" && (
                <div className="flex items-center gap-2 font-bold text-foreground text-[16px]">
                  <span className="text-muted-foreground font-medium">Coins</span>
                  {coinBalance}
                </div>
              )}
              <div className="flex items-center gap-3 ml-auto">
                {!isAuthenticated ? (
                  <Link
                    href="/auth"
                    className="bg-[#ef4d23] text-white rounded-full px-6 py-2.5 text-[15px] font-semibold shadow-md active:scale-95 transition-transform"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white rounded-full px-6 py-2.5 text-[15px] font-semibold shadow-md active:scale-95 transition-transform"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}