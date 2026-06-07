import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import api from "../lib/api";
import Alert from "./ui/Alert";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Avatar from "./ui/Avatar";
import Input from "./ui/Input";
import { SkeletonCard } from "./ui/Skeleton";
import UserRequestCard from "./UserRequestCard";
import MatchModal from "./MatchModal";
import Reveal from "./motion/Reveal";
import { cn } from "../lib/utils";

function EmptySection({ icon, title, description }) {
  return (
    <Card className="text-center py-12 !px-8">
      <div className="size-14 rounded-2xl bg-surface-subtle flex items-center justify-center text-2xl mx-auto mb-4">{icon}</div>
      <h3 className="font-semibold text-text-primary tracking-tight">{title}</h3>
      <p className="text-sm text-text-secondary mt-1.5 max-w-xs mx-auto leading-relaxed">{description}</p>
    </Card>
  );
}

function SectionHeader({ label, title, count }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <p className="label-caps mb-1.5">{label}</p>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      {typeof count === "number" && count > 0 && (
        <span className="text-xs font-medium text-text-muted px-2.5 py-1 rounded-full bg-surface-subtle">
          {count}
        </span>
      )}
    </div>
  );
}

const Profile = () => {
  const user = useSelector((store) => store.user.data);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatDraft, setChatDraft] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [matchModal, setMatchModal] = useState({ open: false, user: null });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("user/stats")
      .then((res) => setStats(res.data?.data))
      .catch(() => {});
  }, [receivedRequests.length, sentRequests.length, connections.length]);

  useEffect(() => {
    let ignore = false;

    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [receivedRes, sentRes, connectionsRes] = await Promise.all([
          api.get("user/requests/received"),
          api.get("user/requests/sent"),
          api.get("user/connections"),
        ]);

        if (ignore) return;

        setReceivedRequests(receivedRes.data?.data || []);
        setSentRequests(sentRes.data?.data || []);
        setConnections(connectionsRes.data?.data || []);
      } catch (error) {
        if (!ignore) setErrorMessage(error.message || "Failed to load profile data");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchProfileData();
    return () => { ignore = true; };
  }, []);

  const refreshProfileData = async () => {
    const [receivedRes, sentRes, connectionsRes] = await Promise.all([
      api.get("user/requests/received"),
      api.get("user/requests/sent"),
      api.get("user/connections"),
    ]);
    setReceivedRequests(receivedRes.data?.data || []);
    setSentRequests(sentRes.data?.data || []);
    setConnections(connectionsRes.data?.data || []);
  };

  const reviewRequest = async (status, requestId, fromUser) => {
    if (reviewingId) return;

    const snapshot = receivedRequests;
    setReviewingId(requestId);
    setErrorMessage("");
    setReceivedRequests((prev) => prev.filter((r) => r._id !== requestId));

    try {
      await api.post(`request/review/${status}/${requestId}`);

      if (status === "accepted" && fromUser) {
        setMatchModal({ open: true, user: fromUser });
      }

      await refreshProfileData();
    } catch (error) {
      setReceivedRequests(snapshot);
      setErrorMessage(error.message || "Failed to review request");
    } finally {
      setReviewingId(null);
    }
  };

  const getMatchUser = (connection) => {
    const currentUserId = user?._id?.toString?.() || String(user?._id || "");
    const fromUserId = connection.fromUserId?._id?.toString?.() || String(connection.fromUserId?._id || "");
    const toUserId = connection.toUserId?._id?.toString?.() || String(connection.toUserId?._id || "");

    if (fromUserId === currentUserId) return connection.toUserId;
    if (toUserId === currentUserId) return connection.fromUserId;
    return null;
  };

  const loadChat = async (matchUser) => {
    try {
      if (!matchUser?._id) {
        setChatError("Cannot open chat for this user right now.");
        return;
      }

      setActiveChatUser(matchUser);
      setChatLoading(true);
      setChatError("");

      const response = await api.get(`chat/${matchUser._id}/messages`);
      setChatMessages(response.data?.data || []);
    } catch (error) {
      setChatError(error.message || "Failed to load chat");
      setChatMessages([]);
    } finally {
      setChatLoading(false);
    }
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!activeChatUser || !chatDraft.trim()) return;

    try {
      setChatSending(true);
      setChatError("");
      await api.post(`chat/${activeChatUser._id}/messages`, { messageText: chatDraft.trim() });
      setChatDraft("");
      await loadChat(activeChatUser);
    } catch (error) {
      setChatError(error.message || "Failed to send message");
    } finally {
      setChatSending(false);
    }
  };

  return (
    <div className="container-narrow px-5 sm:px-8 py-8 lg:py-10">
      <Reveal>
        <div className="mb-10">
          <p className="label-caps mb-2">Account</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your profile</h1>
          <p className="text-[14px] text-text-secondary mt-1.5">Manage requests, matches, and connections</p>
        </div>
      </Reveal>

      {user && (
        <Reveal delay={0.05}>
          <Card hover className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 !p-6">
            <div className="flex items-center gap-4">
              <Avatar src={user.photoUrl} alt={user.firstName} size="xl" online={user.isOnline} />
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-text-secondary">{user.email}</p>
                {user.about && (
                  <p className="text-sm text-text-muted mt-1.5 line-clamp-2 max-w-md leading-relaxed">{user.about}</p>
                )}
              </div>
            </div>
            <Link to="/app/profile/edit" className="shrink-0">
              <Button variant="secondary" size="sm">Edit profile</Button>
            </Link>
          </Card>
        </Reveal>
      )}

      {stats && (
        <Reveal delay={0.08}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { label: "Incoming", value: stats.received, icon: "👋" },
              { label: "Sent", value: stats.sent, icon: "📤" },
              { label: "Matches", value: stats.matches, icon: "✨" },
              { label: "Unread", value: stats.unreadMessages, icon: "💬" },
            ].map((item) => (
              <Card key={item.label} className="!p-4 text-center">
                <span className="text-lg" aria-hidden="true">{item.icon}</span>
                <p className="text-2xl font-bold tracking-tight mt-1">{item.value}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.label}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      )}

      <MatchModal
        isOpen={matchModal.open}
        matchUser={matchModal.user}
        onClose={() => setMatchModal({ open: false, user: null })}
      />

      <section className="mb-12">
        <SectionHeader label="Inbox" title="Incoming requests" count={receivedRequests.length} />

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!isLoading && errorMessage && <Alert variant="error">{errorMessage}</Alert>}

        {!isLoading && !errorMessage && receivedRequests.length === 0 && (
          <EmptySection
            icon="👋"
            title="No incoming requests"
            description="When someone sends you a connection request, it will appear here."
          />
        )}

        {!isLoading && !errorMessage && receivedRequests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {receivedRequests.map((request) => (
                <motion.div
                  key={request._id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -48, scale: 0.95, transition: { duration: 0.22 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                >
                  <UserRequestCard
                    user={request.fromUserId || {}}
                    actions={
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          loading={reviewingId === request._id}
                          disabled={!!reviewingId}
                          onClick={() => reviewRequest("rejected", request._id)}
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          loading={reviewingId === request._id}
                          disabled={!!reviewingId}
                          onClick={() => reviewRequest("accepted", request._id, request.fromUserId)}
                        >
                          Accept
                        </Button>
                      </>
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <section className="mb-12">
        <SectionHeader label="Pending" title="Sent requests" count={sentRequests.length} />

        {!isLoading && !errorMessage && sentRequests.length === 0 && (
          <EmptySection
            icon="📤"
            title="No sent requests"
            description="Swipe right on profiles in the feed to send connection requests."
          />
        )}

        {!isLoading && !errorMessage && sentRequests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sentRequests.map((request) => (
              <UserRequestCard
                key={request._id}
                variant="pending"
                user={request.toUserId || {}}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <SectionHeader label="Connections" title="Your matches" count={connections.length} />

        {!isLoading && !errorMessage && connections.length === 0 && (
          <EmptySection
            icon="✨"
            title="No matches yet"
            description="When someone accepts your request — or you accept theirs — they'll show up here."
          />
        )}

        {!isLoading && !errorMessage && connections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {connections.map((connection) => {
              const matchUser = getMatchUser(connection);
              if (!matchUser?._id || matchUser._id === user?._id) return null;

              return (
                <UserRequestCard
                  key={connection._id}
                  user={matchUser}
                  actions={
                    <Button size="sm" onClick={() => loadChat(matchUser)}>
                      Message
                    </Button>
                  }
                />
              );
            })}
          </div>
        )}
      </section>

      <AnimatePresence>
        {activeChatUser && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <SectionHeader
              label="Quick chat"
              title={`${activeChatUser.firstName} ${activeChatUser.lastName}`}
            />

            {chatError && <Alert variant="error" className="mb-4">{chatError}</Alert>}

            <Card className="overflow-hidden !p-0">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-surface-muted/80">
                <Avatar src={activeChatUser.photoUrl} alt={activeChatUser.firstName} size="md" online />
                <div>
                  <p className="font-semibold tracking-tight">{activeChatUser.firstName} {activeChatUser.lastName}</p>
                  <p className="text-xs text-text-muted">Matched · chat also available in Inbox</p>
                </div>
                <button
                  type="button"
                  className="ml-auto text-text-muted hover:text-text-primary p-1.5 rounded-lg interactive-hover transition-colors"
                  onClick={() => setActiveChatUser(null)}
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto px-5 py-5 space-y-3 bg-surface-muted/40">
                {chatLoading && <p className="text-text-muted text-sm">Loading messages...</p>}
                {!chatLoading && chatMessages.length === 0 && (
                  <p className="text-text-muted text-sm text-center py-10">No messages yet. Say hello!</p>
                )}
                {chatMessages.map((message) => {
                  const isMine =
                    (message.fromUserId?._id?.toString?.() || "") ===
                    (user?._id?.toString?.() || "");
                  return (
                    <div key={message._id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                          isMine
                            ? "bg-brand-600 text-white rounded-br-md"
                            : "bg-surface-elevated border border-border text-text-primary rounded-bl-md",
                        )}
                      >
                        {message.messageText}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form className="flex gap-2 p-4 border-t border-border bg-surface-elevated" onSubmit={sendChatMessage}>
                <Input
                  className="flex-1"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button type="submit" loading={chatSending} disabled={!chatDraft.trim()}>Send</Button>
              </form>
            </Card>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
