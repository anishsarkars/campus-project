"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthFromCallback } = useAuth();
  // Guard: run the callback logic exactly once
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const error = searchParams.get("error");
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const role = searchParams.get("role") as "student" | "organisation" | null;
    const provider = searchParams.get("provider") as "google" | "github" | "local" | null;

    if (error) {
      toast.error("Authentication failed. Please try again.");
      router.replace("/auth");
      return;
    }

    if (token && id && email && role && provider) {
      setAuthFromCallback(token, { id, email, role, provider });
      toast.success("Signed in successfully!");
      router.replace("/");
    } else {
      toast.error("Invalid callback parameters");
      router.replace("/auth");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty – hasRun ref prevents double execution

  return (
    <div className="min-h-screen bg-background flex items-center justify-center -mt-20 sm:-mt-24">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#ef4d23]/20 border-t-[#ef4d23] rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground text-sm">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center -mt-20 sm:-mt-24">
        <div className="w-12 h-12 border-4 border-[#ef4d23]/20 border-t-[#ef4d23] rounded-full animate-spin" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
