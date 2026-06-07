import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSocketContext } from "../context/SocketProvider";
import Avatar from "./ui/Avatar";
import { cn } from "../lib/utils";

const typeConfig = {
  message: { icon: "💬", bg: "bg-blue-50" },
  match: { icon: "🎉", bg: "bg-emerald-50" },
  request: { icon: "👋", bg: "bg-violet-50" },
};

export default function NotificationBell() {
  const {
    notifications,
    unreadNotifCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useSocketContext();
  const [open, setOpen] = useState(false);

  const handleClick = async (notification) => {
    if (!notification.readAt) {
      await markNotificationRead(notification._id);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "relative p-2.5 rounded-xl transition-all duration-200",
          open ? "bg-brand-50 text-brand-700" : "hover:bg-black/[0.04] text-text-secondary",
        )}
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${unreadNotifCount ? `, ${unreadNotifCount} unread` : ""}`}
        aria-expanded={open}
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadNotifCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
          >
            {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-border bg-surface-elevated/95 backdrop-blur-xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-black/[0.06] bg-surface-muted/80">
                <span className="font-semibold text-sm tracking-tight">Notifications</span>
                {unreadNotifCount > 0 && (
                  <button
                    type="button"
                    className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
                    onClick={markAllNotificationsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="p-10 text-center">
                    <div className="size-12 rounded-2xl bg-surface-subtle flex items-center justify-center text-xl mx-auto mb-3">🔔</div>
                    <p className="text-sm text-text-muted">You&apos;re all caught up</p>
                  </div>
                )}
                {notifications.map((n) => {
                  const config = typeConfig[n.type] || { icon: "🔔", bg: "bg-neutral-50" };
                  return (
                    <Link
                      key={n._id}
                      to={n.link || "/app"}
                      onClick={() => handleClick(n)}
                      className={cn(
                        "flex gap-3 px-4 py-3.5 border-b border-black/[0.04] last:border-0 transition-colors hover:bg-black/[0.02]",
                        !n.readAt && "bg-brand-50/40",
                      )}
                    >
                      <span className={cn("size-9 rounded-xl flex items-center justify-center text-base shrink-0", config.bg)} aria-hidden="true">
                        {config.icon}
                      </span>
                      {n.fromUser?.photoUrl && (
                        <Avatar src={n.fromUser.photoUrl} alt="" size="sm" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary truncate">{n.title}</p>
                        <p className="text-xs text-text-muted line-clamp-2 mt-0.5 leading-relaxed">{n.body}</p>
                      </div>
                      {!n.readAt && (
                        <span className="size-2 rounded-full bg-brand-600 shrink-0 mt-2" aria-label="Unread" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
