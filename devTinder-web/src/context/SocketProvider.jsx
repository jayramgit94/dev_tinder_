import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { connectSocket, disconnectSocket, getSocket } from "../lib/socket";
import api from "../lib/api";
import { useToast } from "./ToastProvider";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const user = useSelector((store) => store.user.data);
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [inboxUnread, setInboxUnread] = useState(0);

  const loadNotifications = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await api.get("notifications");
      setNotifications(res.data?.data || []);
      setUnreadNotifCount(res.data?.unreadCount || 0);
    } catch {
      /* silent */
    }
  }, [user?._id]);

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
      disconnectSocket();
      setConnected(false);
      return undefined;
    }

    const socket = connectSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 30));
      setUnreadNotifCount((c) => c + 1);
      toast(notification.title, notification.type === "match" ? "success" : "info");
    };

    const onConversationUpdated = () => {
      loadInboxUnread();
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("notification", onNotification);
    socket.on("conversation_updated", onConversationUpdated);

    if (socket.connected) setConnected(true);

    loadNotifications();
    loadInboxUnread();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("notification", onNotification);
      socket.off("conversation_updated", onConversationUpdated);
    };
  }, [user?._id, toast, loadNotifications, loadInboxUnread]);

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
        getSocket,
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
