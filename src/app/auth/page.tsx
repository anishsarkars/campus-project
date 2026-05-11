"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { getGoogleOAuthUrl, getGitHubOAuthUrl } from "@/lib/api/auth";
import { toast } from "sonner";
import { Mail, Lock, GraduationCap, Building2, ArrowRight, Github } from "lucide-react";
import type { ApiError } from "@/types";

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, isAuthenticated, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"student" | "organisation">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect authenticated users safely inside useEffect
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Welcome back!");
        router.replace("/");
      } else {
        await signup(email, password, role);
        toast.success("Account created!");
        router.replace("/onboarding");
      }
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = getGoogleOAuthUrl(role);
  };

  const handleGitHubAuth = () => {
    window.location.href = getGitHubOAuthUrl(role);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-96px)] bg-background flex items-center justify-center px-4 py-12 lg:px-8">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left side: Logo & Text */}
        <div className="text-center lg:text-left space-y-6 order-1 lg:order-1">
          <div className="flex justify-center lg:justify-start">
            <svg viewBox="0 0 32 32" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground leading-tight">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
            {mode === "login"
              ? "Sign in to your NextUP account to continue collaborating, learning, and sharing skills."
              : "Join NextUP to connect with peers, find study buddies, and start collaborating."}
          </p>
        </div>

        {/* Right side: Auth Card */}
        <div className="w-full max-w-md mx-auto space-y-6 order-2 lg:order-2">
          <Card className="rounded-2xl border-border shadow-xl">
            <CardContent className="pt-6 space-y-5">
              {/* Role Selector (Signup only) */}
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">I am a</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        role === "student"
                          ? "border-[#ef4d23] bg-[#ef4d23]/5 text-[#ef4d23]"
                          : "border-border text-muted-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("organisation")}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        role === "organisation"
                          ? "border-[#ef4d23] bg-[#ef4d23]/5 text-[#ef4d23]"
                          : "border-border text-muted-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      Organisation
                    </button>
                  </div>
                </div>
              )}

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={handleGitHubAuth}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition"
                >
                  <Github className="w-5 h-5" />
                  Continue with GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-[#ef4d23] hover:bg-[#d9431d] text-white py-6"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {mode === "login" ? "Signing in..." : "Creating account..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {mode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Toggle mode */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-[#ef4d23] font-medium hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-[#ef4d23] font-medium hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
