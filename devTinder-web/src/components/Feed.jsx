import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import { addFeed, appendFeed, removeFeed, resetFeed, prependFeed } from "../../utils/FeedSlice";
import SwipeDeck, { SwipeActions } from "./SwipeDeck";
import FeedFilters, { buildFeedQuery } from "./FeedFilters";
import ProfileDetailModal from "./ProfileDetailModal";
import MatchModal from "./MatchModal";
import Alert from "./ui/Alert";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Skeleton from "./ui/Skeleton";
import { useToast } from "../context/ToastProvider";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [remainingUsers, setRemainingUsers] = useState([]);
  const [filters, setFilters] = useState({ city: "", gender: "", skills: [] });
  const [activeFilters, setActiveFilters] = useState({ city: "", gender: "", skills: [] });
  const [detailUser, setDetailUser] = useState(null);
  const [matchUser, setMatchUser] = useState(null);
  const [lastSwipe, setLastSwipe] = useState(null);
  const [deckBusy, setDeckBusy] = useState(false);
  const deckRef = useRef(null);

  useEffect(() => { if (Array.isArray(feed)) setRemainingUsers(feed); }, [feed]);

  const loadFeed = async (pageNum = 1, append = false, filterSet = activeFilters) => {
    try {
      setIsLoading(!append);
      const res = await api.get(`feed?${buildFeedQuery(filterSet, pageNum)}`);
      const users = res.data?.data || [];
      setTotal(res.data?.total ?? users.length);
      setHasMore(res.data?.hasMore ?? users.length >= 10);
      if (append) dispatch(appendFeed(users));
      else dispatch(addFeed(users));
    } catch (error) {
      setErrorMessage(error.message || "Failed to load feed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadFeed(1, false); }, []);

  const applyFilters = () => {
    setActiveFilters(filters);
    setPage(1);
    dispatch(resetFeed());
    loadFeed(1, false, filters);
  };

  const resetFilters = () => {
    const empty = { city: "", gender: "", skills: [] };
    setFilters(empty);
    setActiveFilters(empty);
    setPage(1);
    dispatch(resetFeed());
    loadFeed(1, false, empty);
  };

  const deckLocked = isSending || deckBusy;

  const afterSwipe = async (user, status, res) => {
    setLastSwipe({ user, status });
    dispatch(removeFeed(user._id));
    setRemainingUsers((prev) => {
      const next = prev.filter((u) => u._id !== user._id);
      if (next.length <= 2 && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadFeed(nextPage, true);
      }
      return next;
    });
    if (status === "interested") {
      if (res?.data?.matched) {
        setMatchUser(user);
        toast("It's a match! 🎉", "success");
      } else toast("Connection request sent!", "success");
    }
  };

  const sendRequest = async (status, user) => {
    try {
      setIsSending(true);
      setErrorMessage("");
      const res = await api.post(`request/send/${status}/${user._id}`);
      await afterSwipe(user, status, res);
      return true;
    } catch (error) {
      setErrorMessage(error.message || "Failed to send request");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const superConnect = async (user) => {
    try {
      setIsSending(true);
      setErrorMessage("");
      const res = await api.post(`request/super/${user._id}`);
      await afterSwipe(user, "interested", res);
      toast(res.data?.matched ? "Super match! ⭐" : "Super Connect sent!", "success");
      return true;
    } catch (error) {
      setErrorMessage(error.message || "Super Connect failed");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const undoSwipe = async () => {
    if (!lastSwipe) return;
    try {
      await api.delete(`request/undo/${lastSwipe.user._id}`);
      dispatch(prependFeed(lastSwipe.user));
      setRemainingUsers((prev) => [lastSwipe.user, ...prev]);
      setLastSwipe(null);
      toast("Swipe undone", "success");
    } catch {
      toast("Could not undo", "error");
    }
  };

  const blockUser = async (user) => {
    await api.post(`user/block/${user._id}`);
    toast("User blocked", "success");
    setRemainingUsers((prev) => prev.filter((u) => u._id !== user._id));
  };

  const reportUser = async (user) => {
    const reason = window.prompt("Reason for report?");
    if (!reason) return;
    await api.post("user/report", { userId: user._id, reason });
    toast("Report submitted", "success");
  };

  if (isLoading && !remainingUsers.length) {
    return (
      <div className="container-narrow px-4 py-8 flex flex-col items-center gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="w-full max-w-sm h-[540px] rounded-3xl" />
        <Skeleton className="h-10 w-64" />
      </div>
    );
  }

  const current = remainingUsers[0];

  return (
    <div className="container-narrow px-5 sm:px-8 py-10 lg:py-12">
      <div className="text-center mb-8">
        <p className="label-caps mb-3">Discover</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Find your next collaborator</h1>
        <p className="text-[15px] text-text-secondary mt-2">
          {total > 0 ? `${total} developers · ` : ""}Swipe right to connect
        </p>
      </div>

      <FeedFilters filters={filters} onChange={setFilters} onApply={applyFilters} onReset={resetFilters} loading={isLoading} />

      {errorMessage && <Alert variant="error" className="mb-6 max-w-sm mx-auto" onDismiss={() => setErrorMessage("")}>{errorMessage}</Alert>}

      {remainingUsers.length > 0 ? (
        <>
          <SwipeDeck
            ref={deckRef}
            user={current}
            nextUser={remainingUsers[1]}
            onSwipeLeft={(u) => sendRequest("ignore", u)}
            onSwipeRight={(u) => sendRequest("interested", u)}
            onSuper={superConnect}
            onViewDetails={setDetailUser}
            disabled={deckLocked}
            onBusyChange={setDeckBusy}
          />
          <SwipeActions
            onPass={() => current && deckRef.current?.swipeLeft()}
            onConnect={() => current && deckRef.current?.swipeRight()}
            onSuper={() => current && deckRef.current?.swipeSuper()}
            onUndo={undoSwipe}
            canUndo={!!lastSwipe}
            disabled={deckLocked}
            loading={isSending}
          />
          <p className="text-center text-xs text-text-muted mt-4">
            {remainingUsers.length} remaining · tap card for details · ⌘K search
          </p>
        </>
      ) : (
        <Card className="text-center py-20 max-w-sm mx-auto !p-10">
          <div className="size-16 rounded-2xl bg-surface-subtle flex items-center justify-center text-3xl mx-auto mb-5">🔍</div>
          <h2 className="text-xl font-bold tracking-tight">No profiles found</h2>
          <p className="text-[14px] text-text-secondary mt-2">Try adjusting filters or run npm run seed</p>
          <Button className="mt-4" variant="secondary" onClick={resetFilters}>Reset filters</Button>
        </Card>
      )}

      <ProfileDetailModal
        user={detailUser}
        open={!!detailUser}
        onClose={() => setDetailUser(null)}
        compatibility={detailUser?.compatibility}
        onConnect={() => {
          setDetailUser(null);
          deckRef.current?.swipeRight();
        }}
        onPass={() => {
          setDetailUser(null);
          deckRef.current?.swipeLeft();
        }}
        onSuper={() => {
          setDetailUser(null);
          deckRef.current?.swipeSuper();
        }}
        onBlock={blockUser}
        onReport={reportUser}
      />
      <MatchModal isOpen={!!matchUser} matchUser={matchUser} onClose={() => setMatchUser(null)} />
    </div>
  );
};

export default Feed;
