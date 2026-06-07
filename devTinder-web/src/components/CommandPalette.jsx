import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import Avatar from "./ui/Avatar";
import Badge from "./ui/Badge";

const pages = [
  { label: "Feed", to: "/app" },
  { label: "Inbox", to: "/app/inbox" },
  { label: "Profile", to: "/app/profile" },
  { label: "Edit profile", to: "/app/profile/edit" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || q.length < 2) { setUsers([]); return; }
    const t = setTimeout(() => {
      api.get(`user/search?q=${encodeURIComponent(q)}`).then((r) => setUsers(r.data?.data || []));
    }, 250);
    return () => clearTimeout(t);
  }, [q, open]);

  const go = useCallback((to) => { navigate(to); setOpen(false); setQ(""); }, [navigate]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            className="fixed left-1/2 top-[15%] z-[101] w-[min(560px,92vw)] -translate-x-1/2 rounded-2xl border border-border bg-surface-elevated shadow-2xl overflow-hidden">
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search devs or type a command..."
              className="w-full px-5 py-4 text-sm bg-transparent border-b border-border outline-none text-text-primary" />
            <div className="max-h-80 overflow-y-auto p-2">
              {q.length < 2 && pages.map((p) => (
                <button key={p.to} type="button" onClick={() => go(p.to)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-text-primary hover:bg-surface-subtle">{p.label}</button>
              ))}
              {users.map((u) => (
                <button key={u._id} type="button" onClick={() => go("/app/profile")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-subtle">
                  <Avatar src={u.photoUrl} alt="" size="sm" />
                  <span className="text-sm font-medium">{u.firstName} {u.lastName}</span>
                  {u.compatibility > 0 && <Badge>{u.compatibility}% match</Badge>}
                </button>
              ))}
            </div>
            <p className="px-4 py-2 text-[11px] text-text-muted border-t border-black/[0.04]">⌘K · Esc to close</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
