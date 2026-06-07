import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import api from "../lib/api";
import { useToast } from "./ToastProvider";

const POLL_MS = 5000;
const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const user = useSelector((store) => store.user.data);
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [inboxUnread, setInboxUnread] = useState(0);
  const initializedRef = useRef(false);
  const lastNotifiedIdRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await api.get("notifications");
      const next = res.data?.data || [];
      const nextUnread = res.data?.unreadCount || 0;
      const latest = next[0];

      if (!initializedRef.current) {
        initializedRef.current = true;
        if (latest?._id) lastNotifiedIdRef.current = latest._id;
      } else if (
        latest?._id &&
        latest._id !== lastNotifiedIdRef.current &&
        !latest.readAt
      ) {
        lastNotifiedIdRef.current = latest._id;
        toast(latest.title, latest.type === "match" ? "success" : "info");
      }

      setNotifications(next);
      setUnreadNotifCount(nextUnread);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, [user?._id, toast]);

  const loadInboxUnread = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await api.get("inbox/conversations");
      const conversations = res.data?.data || [];
      setInboxUnread(
        conversations.reduce((count, c) => count + (c.unreadCount || 0), 0),
      );
    } catch {
      /* silent */
    }
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) {
      setConnected(false);
      setNotifications([]);
      setUnreadNotifCount(0);
      setInboxUnread(0);
      initializedRef.current = false;
      lastNotifiedIdRef.current = null;
      return undefined;
    }

    loadNotifications();
    loadInboxUnread();

    const interval = setInterval(() => {
      loadNotifications();
      loadInboxUnread();
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [user?._id, loadNotifications, loadInboxUnread]);

  const markNotificationRead = async (id) => {
    await api.patch(`notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, readAt: new Date().toISOString() } : n)),
    );
    setUnreadNotifCount((c) => Math.max(0, c - 1));
  };

  const markAllNotificationsRead = async () => {
    await api.post("notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
    setUnreadNotifCount(0);
  };

  return (
    <SocketContext.Provider
      value={{
        connected,
        notifications,
        unreadNotifCount,
        inboxUnread,
        loadNotifications,
        loadInboxUnread,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocketContext must be used within SocketProvider");
  return ctx;
}
