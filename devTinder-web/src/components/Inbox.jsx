import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import api from "../lib/api";
import Alert from "./ui/Alert";
import Avatar from "./ui/Avatar";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { cn } from "../lib/utils";
import { useSocketContext } from "../context/SocketProvider";

const MESSAGE_POLL_MS = 3000;

const formatMessageTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
};

const Inbox = () => {
  const currentUser = useSelector((store) => store.user.data);
  const { loadInboxUnread } = useSocketContext();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [mobilePanel, setMobilePanel] = useState("list");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const response = await api.get("inbox/conversations");
      const nextConversations = response.data?.data || [];
      setConversations(nextConversations);

      if (selectedUser?._id) {
        const refreshed = nextConversations.find((c) => c.matchUser?._id === selectedUser._id);
        if (refreshed?.matchUser) setSelectedUser(refreshed.matchUser);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to load inbox");
    } finally {
      setLoadingConversations(false);
    }
  }, [selectedUser?._id]);

  const loadMessages = useCallback(async (userId) => {
    if (!userId) return;
    try {
      setLoadingMessages(true);
      const response = await api.get(`chat/${userId}/messages`);
      setMessages(response.data?.data || []);
      loadInboxUnread();
    } catch (error) {
      setErrorMessage(error.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [loadInboxUnread]);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, MESSAGE_POLL_MS);
    return () => clearInterval(interval);
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedUser?._id) return undefined;

    loadMessages(selectedUser._id);
    const interval = setInterval(() => loadMessages(selectedUser._id), MESSAGE_POLL_MS);
    return () => clearInterval(interval);
  }, [selectedUser?._id, loadMessages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id || !draft.trim()) return;

    try {
      setSendingMessage(true);
      setErrorMessage("");
      const response = await api.post(`chat/${selectedUser._id}/messages`, { messageText: draft.trim() });
      const message = response.data?.data;
      if (message) {
        setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
      }
      setDraft("");
      loadConversations();
    } catch (error) {
      setErrorMessage(error.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const unreadTotal = conversations.reduce((count, c) => count + (c.unreadCount || 0), 0);

  return (
    <div className="container-wide px-5 sm:px-8 py-8 lg:py-10 min-h-[calc(100vh-64px)]">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="label-caps mb-2">Messages</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-[14px] text-text-secondary mt-1">
            Chat with matches{unreadTotal > 0 && ` · ${unreadTotal} unread`}
          </p>
        </div>
        {mobilePanel === "chat" && (
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobilePanel("list")}>
            ← Back
          </Button>
        )}
      </div>

      {errorMessage && (
        <Alert variant="error" className="mb-4" onDismiss={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 min-h-[72vh]">
        <aside
          className={cn(
            "bg-surface-elevated rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col",
            mobilePanel === "chat" ? "hidden lg:flex" : "flex",
          )}
        >
          <div className="px-5 py-4 border-b border-black/[0.06] bg-surface-muted/60 flex items-center justify-between">
            <span className="font-semibold text-sm tracking-tight">Conversations</span>
            {unreadTotal > 0 && <Badge>{unreadTotal}</Badge>}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations && (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="size-10 rounded-full bg-surface-subtle" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-surface-subtle rounded w-2/3" />
                      <div className="h-2.5 bg-surface-subtle rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loadingConversations && conversations.length === 0 && (
              <div className="p-10 text-center">
                <div className="size-14 rounded-2xl bg-surface-subtle flex items-center justify-center text-2xl mx-auto mb-4">💬</div>
                <p className="text-sm font-medium text-text-primary">No conversations yet</p>
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed max-w-[220px] mx-auto">
                  When someone accepts your request, they&apos;ll appear here.
                </p>
              </div>
            )}
            {!loadingConversations && conversations.map((conversation) => {
              const matchUser = conversation.matchUser;
              const isActive = matchUser?._id === selectedUser?._id;
              return (
                <button
                  key={conversation.connectionId}
                  type="button"
                  className={cn(
                    "w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all duration-200 border-b border-black/[0.03] last:border-0",
                    isActive
                      ? "bg-brand-50/80 border-l-2 border-l-brand-600"
                      : "hover:bg-black/[0.02] border-l-2 border-l-transparent",
                  )}
                  onClick={() => {
                    setSelectedUser(matchUser);
                    setMobilePanel("chat");
                    setErrorMessage("");
                  }}
                >
                  <Avatar src={matchUser?.photoUrl} alt={matchUser?.firstName} size="md" online />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("font-medium truncate text-sm", isActive ? "text-brand-700" : "text-text-primary")}>
                        {(matchUser?.firstName || "") + " " + (matchUser?.lastName || "")}
                      </span>
                      {conversation.unreadCount > 0 && <Badge>{conversation.unreadCount}</Badge>}
                    </div>
                    <p className="text-xs text-text-muted truncate mt-0.5">
                      {conversation.latestMessage?.messageText || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section
          className={cn(
            "bg-surface-elevated rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[72vh]",
            mobilePanel === "list" ? "hidden lg:flex" : "flex",
          )}
        >
          {!selectedUser?._id ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="size-16 rounded-2xl bg-linear-to-br from-brand-50 to-brand-100 flex items-center justify-center text-3xl mb-5">✉️</div>
              <p className="font-semibold text-text-primary tracking-tight">Select a conversation</p>
              <p className="text-sm text-text-muted mt-1.5 max-w-xs leading-relaxed">
                Choose a match from the list to start chatting.
              </p>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-black/[0.06] bg-surface-muted/60 flex items-center gap-3">
                <Avatar src={selectedUser.photoUrl} alt={selectedUser.firstName} size="md" online />
                <div>
                  <p className="font-semibold text-text-primary tracking-tight text-sm">
                    {(selectedUser.firstName || "") + " " + (selectedUser.lastName || "")}
                  </p>
                  <p className="text-xs text-text-muted">Messages refresh every few seconds</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-surface-muted/30">
                {loadingMessages && (
                  <p className="text-text-muted text-sm text-center py-10">Loading messages...</p>
                )}
                {!loadingMessages && messages.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-text-muted text-sm">No messages yet.</p>
                    <p className="text-xs text-text-muted mt-1">Say hello to break the ice 👋</p>
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {messages.map((message) => {
                    const isMine =
                      (message.fromUserId?._id?.toString?.() || "") ===
                      (currentUser?._id?.toString?.() || "");
                    return (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className={cn("flex gap-2", isMine ? "flex-row-reverse" : "flex-row")}
                      >
                        {!isMine && <Avatar src={message.fromUserId?.photoUrl} alt="" size="sm" />}
                        <div
                          className={cn(
                            "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                            isMine
                              ? "bg-brand-600 text-white rounded-br-md"
                              : "bg-surface-elevated border border-border text-text-primary rounded-bl-md",
                          )}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{message.messageText}</p>
                          <p className={cn("text-[11px] mt-1", isMine ? "text-brand-100" : "text-text-muted")}>
                            {formatMessageTime(message.createdAt)}
                            {isMine && (message.readAt ? " · Read" : " · Sent")}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-border bg-surface-elevated flex gap-2 items-end">
                <Input
                  className="flex-1"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button type="submit" loading={sendingMessage} disabled={!draft.trim()}>
                  Send
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Inbox;
