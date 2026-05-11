"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import * as connectionsApi from "@/lib/api/connections";
import { toast } from "sonner";
import { UserCheck, UserX, Users, Clock } from "lucide-react";
import type { Connection, StudentProfile, OrganisationProfile } from "@/types";

export default function ConnectionsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, profile } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchConnections = useCallback(async () => {
    try {
      const data = await connectionsApi.list();
      setConnections(data.connections || []);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchConnections();
  }, [isAuthenticated, fetchConnections]);

  const getProfileName = (p: string | StudentProfile | OrganisationProfile): string => {
    if (typeof p === "string") return "User";
    if ("name" in p && p.name) return p.name;
    if ("email" in p) return (p as any).email || "User";
    return "User";
  };

  const getProfileEmail = (p: string | StudentProfile | OrganisationProfile): string => {
    if (typeof p === "string") return "";
    return (p as any).email || "";
  };

  const myProfileId = profile?._id;

  if (authLoading || !isAuthenticated) {
    return <div className="container mx-auto px-4 py-12 flex justify-center"><div className="w-8 h-8 border-3 border-[#ef4d23]/20 border-t-[#ef4d23] rounded-full animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-[#ef4d23]" />
        <h1 className="text-3xl font-bold">Connections</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-[#ef4d23]/20 border-t-[#ef4d23] rounded-full animate-spin" /></div>
      ) : connections.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No connections yet. Start connecting with peers!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {connections.map((conn) => {
            const isFrom = typeof conn.from.id !== "string" && conn.from.id._id === myProfileId;
            const other = isFrom ? conn.to : conn.from;
            const otherProfile = other.id;

            return (
              <Card key={conn._id} className="rounded-xl">
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ef4d23]/10 text-[#ef4d23] flex items-center justify-center font-bold text-sm">
                      {getProfileName(otherProfile).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{getProfileName(otherProfile)}</p>
                      <p className="text-xs text-muted-foreground">{getProfileEmail(otherProfile)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">{other.role}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {conn.status === "accepted" ? <UserCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {conn.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
