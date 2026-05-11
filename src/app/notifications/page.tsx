"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";
import { Bell, BellOff, Check, Link2, Briefcase, RefreshCw, Repeat2, Users } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  connection: <Link2 className="w-4 h-4" />,
  opportunity: <Briefcase className="w-4 h-4" />,
  skillswap: <Repeat2 className="w-4 h-4" />,
  collaboration: <Users className="w-4 h-4" />,
  system: <Bell className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
  connection: "bg-blue-500/10 text-blue-600",
  opportunity: "bg-green-500/10 text-green-600",
  skillswap: "bg-purple-500/10 text-purple-600",
  collaboration: "bg-amber-500/10 text-amber-600",
  system: "bg-neutral-500/10 text-neutral-600",
};

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, refresh } = useNotifications();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return <div className="container mx-auto px-4 py-12 flex justify-center"><div className="w-8 h-8 border-3 border-[#ef4d23]/20 border-t-[#ef4d23] rounded-full animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#ef4d23]" />
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-[#ef4d23] text-white">{unreadCount} new</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-[#ef4d23]/20 border-t-[#ef4d23] rounded-full animate-spin" /></div>
      ) : notifications.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center">
            <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <Card key={notif._id} className={`rounded-xl transition-all ${notif.status === "unread" ? "border-[#ef4d23]/30 bg-[#ef4d23]/[0.02]" : ""}`}>
              <CardContent className="py-3 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${typeColors[notif.type] || typeColors.system}`}>
                  {typeIcons[notif.type] || typeIcons.system}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notif.status === "unread" ? "font-medium" : "text-muted-foreground"}`}>
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] capitalize">{notif.type}</Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
                {notif.status === "unread" && (
                  <Button variant="ghost" size="sm" onClick={() => markAsRead(notif._id)} className="shrink-0">
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
