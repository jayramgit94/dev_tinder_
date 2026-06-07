import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";
import { removeUser } from "../../../utils/userSlice";
import { useSocketContext } from "../../context/SocketProvider";
import NotificationBell from "../NotificationBell";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import ThemeToggle from "../ThemeToggle";
import { cn } from "../../lib/utils";

const navItems = [
  { label: "Feed", to: "/app", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
  { label: "Inbox", to: "/app/inbox", icon: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" },
  { label: "Profile", to: "/app/profile", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
];

export default function AppNavbar() {
  const user = useSelector((store) => store.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { inboxUnread, connected } = useSocketContext();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try { await api.post("logout"); } catch { /* proceed */ }
    dispatch(removeUser());
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 glass-nav">
      <nav className="container-wide flex items-center justify-between h-[64px] px-5 sm:px-8" aria-label="App">
        <div className="flex items-center gap-6">
          <Link to="/app" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-text-primary text-surface font-bold text-[10px]">DT</span>
            <span className="font-semibold text-[14px] hidden sm:block tracking-tight">DevTinder</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5 p-1 rounded-full bg-surface-subtle">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/app"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200",
                    isActive
                      ? "bg-surface-elevated text-text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary",
                  )
                }
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
                {item.label === "Inbox" && inboxUnread > 0 && (
                  <Badge className="ml-0.5 !px-1.5 !py-0">{inboxUnread}</Badge>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {connected && (
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-text-muted mr-2">
              <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Synced
            </span>
          )}
          <ThemeToggle />
          <NotificationBell />
          <button
            type="button"
            className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 interactive-hover transition-colors ml-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Avatar src={user?.photoUrl} alt={user?.firstName} size="sm" online />
            <span className="hidden sm:block text-[13px] font-medium max-w-[100px] truncate">{user?.firstName}</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute right-5 top-[calc(100%+8px)] z-50 w-52 rounded-2xl border border-border bg-surface-elevated shadow-xl py-2 overflow-hidden"
            >
              <Link to="/app/profile/edit" className="block px-4 py-2.5 text-[14px] text-text-primary hover:bg-surface-subtle" onClick={() => setMenuOpen(false)}>Edit profile</Link>
              <Link to="/" className="block px-4 py-2.5 text-[14px] text-text-primary hover:bg-surface-subtle" onClick={() => setMenuOpen(false)}>Home</Link>
              <button type="button" className="w-full text-left px-4 py-2.5 text-[14px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40" onClick={handleLogout}>Log out</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
