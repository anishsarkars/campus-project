"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import * as notificationsApi from "@/lib/api/notifications";
import type { Notification } from "@/types";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  // Fetch all notifications
  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await notificationsApi.listNotifications();
      setNotifications(data.notifications);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Connect SSE for real-time updates
  useEffect(() => {
    if (!isAuthenticated) {
      // Cleanup on logout
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setNotifications([]);
      return;
    }

    // Initial fetch
    refresh();

    // Setup SSE
    const es = notificationsApi.connectSSE();
    if (es) {
      eventSourceRef.current = es;

      es.addEventListener("notification", (event) => {
        try {
          const data = JSON.parse(event.data);
          // Add the new notification to the top of the list
          setNotifications((prev) => [
            {
              _id: Date.now().toString(), // Temporary ID until refresh
              recipient: { id: "", role: "Student" as const },
              type: data.type,
              message: data.message,
              relatedId: data.relatedId,
              status: "unread" as const,
              createdAt: data.createdAt || new Date().toISOString(),
            },
            ...prev,
          ]);
        } catch {
          // Invalid SSE data
        }
      });

      es.onerror = () => {
        // Reconnect after 5s on error
        es.close();
        setTimeout(() => {
          if (isAuthenticated) {
            const newEs = notificationsApi.connectSSE();
            if (newEs) eventSourceRef.current = newEs;
          }
        }, 5000);
      };
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isAuthenticated, refresh]);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "read" as const } : n))
      );
    } catch {
      // Silently fail
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loading, markAsRead, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
