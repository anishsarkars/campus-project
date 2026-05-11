"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { getToken, setToken, removeToken } from "@/lib/api/client";
import * as authApi from "@/lib/api/auth";
import * as usersApi from "@/lib/api/users";
import type {
  AuthUser,
  StudentProfile,
  OrganisationProfile,
} from "@/types";

// ── Context shape ─────────────────────────────────────────────────────

interface AuthContextType {
  user: AuthUser | null;
  profile: StudentProfile | OrganisationProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isStudent: boolean;
  isOrganisation: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: "student" | "organisation") => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setAuthFromCallback: (token: string, user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<StudentProfile | OrganisationProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate auth state on mount from stored token
  const hydrate = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      // Decode JWT to get basic user info (without server call)
      const payload = JSON.parse(atob(token.split(".")[1]));
      
      // Check expiry
      if (payload.exp * 1000 < Date.now()) {
        removeToken();
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Set basic user info immediately
      setUser({
        id: payload.id,
        email: "",
        role: payload.role,
        provider: "local",
      });

      // Fetch full profile from backend
      const data = await usersApi.getMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      // Token is invalid or backend is down
      removeToken();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();

    // Listen for forced logout events (from API client 401 handler)
    const handleLogout = () => {
      setUser(null);
      setProfile(null);
    };
    window.addEventListener("nextup:logout", handleLogout);
    return () => window.removeEventListener("nextup:logout", handleLogout);
  }, [hydrate]);

  // Login
  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setUser(data.user);
    localStorage.setItem("nextup:user", JSON.stringify(data.user));
    
    // Fetch profile
    try {
      const meData = await usersApi.getMe();
      setProfile(meData.profile);
    } catch {
      // Profile fetch failed, user is still logged in
    }
  };

  // Signup
  const signup = async (email: string, password: string, role: "student" | "organisation") => {
    const data = await authApi.signup({ email, password, role });
    setUser(data.user);
    localStorage.setItem("nextup:user", JSON.stringify(data.user));

    // Fetch profile
    try {
      const meData = await usersApi.getMe();
      setProfile(meData.profile);
    } catch {
      // Profile fetch failed
    }
  };

  // Logout
  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setProfile(null);
    localStorage.removeItem("nextup:user");
  };

  // Refresh profile (used after profile updates)
  const refreshProfile = async () => {
    try {
      const data = await usersApi.getMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      // Silently fail
    }
  };

  // Set auth from OAuth callback (called from /auth/callback page)
  const setAuthFromCallback = useCallback((token: string, authUser: AuthUser) => {
    setToken(token);
    setUser(authUser);
    localStorage.setItem("nextup:user", JSON.stringify(authUser));
    // Fetch profile in background
    usersApi.getMe().then((data) => {
      setProfile(data.profile);
    }).catch(() => {});
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isStudent: user?.role === "student",
    isOrganisation: user?.role === "organisation",
    login,
    signup,
    logout,
    refreshProfile,
    setAuthFromCallback,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}