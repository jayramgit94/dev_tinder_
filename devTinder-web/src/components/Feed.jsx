import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { prependFeed, removeFeed, resetFeed } from "../../utils/FeedSlice";
import {
  FEED_PAGE_SIZE,
  PREFETCH_THRESHOLD,
  loadFeedIntoStore,
  prefetchUserPhotos,
} from "../../utils/feedLoader";
import SwipeDeck, { SwipeActions } from "./SwipeDeck";
import FeedFilters from "./FeedFilters";
import ProfileDetailModal from "./ProfileDetailModal";
import MatchModal from "./MatchModal";
import Alert from "./ui/Alert";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Skeleton from "./ui/Skeleton";
import { useToast } from "../context/ToastProvider";
import api from "../lib/api";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(!Array.isArray(feed) || feed.length === 0);
  const [isSending, setIsSending] = useState(false);
  const [page, setPage] = useState(() => (Array.isArray(feed) && feed.length >= FEED_PAGE_SIZE ? 2 : 1));
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [remainingUsers, setRemainingUsers] = useState(Array.isArray(feed) ? feed : []);
  const [filters, setFilters] = useState({ city: "", gender: "", skills: [] });
  const [activeFilters, setActiveFilters] = useState({ city: "", gender: "", skills: [] });
  const [detailUser, setDetailUser] = useState(null);
  const [matchUser, setMatchUser] = useState(null);
  const [lastSwipe, setLastSwipe] = useState(null);
  const [undoAvailable, setUndoAvailable] = useState(false);
  const [deckBusy, setDeckBusy] = useState(false);
  const deckRef = useRef(null);
  const prefetchingRef = useRef(false);
  const filtersRef = useRef(activeFilters);

  filtersRef.current = activeFilters;

  useEffect(() => {
    if (Array.isArray(feed)) {
      setRemainingUsers(feed);
      prefetchUserPhotos(feed.slice(0, 5));
    }
  }, [feed]);

  const prefetchNextPage = useCallback(async (currentPage, filterSet = filtersRef.current) => {
    if (prefetchingRef.current || !hasMore) return;
    prefetchingRef.current = true;
    const nextPage = currentPage + 1;
    try {
      const result = await loadFeedIntoStore(dispatch, {
        page: nextPage,
        append: true,
        filters: filterSet,
      });
      setPage(nextPage);
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch {
      /* silent — user can still swipe current buffer */
    } finally {
      prefetchingRef.current = false;
    }
  }, [dispatch, hasMore]);

  const ensureBuffer = useCallback((remainingCount, currentPage) => {
    if (remainingCount <= PREFETCH_THRESHOLD && hasMore) {
      prefetchNextPage(currentPage);
    }
  }, [hasMore, prefetchNextPage]);

  const loadFeed = useCallback(async (pageNum = 1, append = false, filterSet = activeFilters) => {
    try {
      setIsLoading(!append);
      const result = await loadFeedIntoStore(dispatch, {
        page: pageNum,
        append,
        filters: filterSet,
      });
      setTotal(result.total);
      setHasMore(result.hasMore);
      setPage(pageNum);

      if (!append && result.hasMore && result.users.length > 0) {
        prefetchNextPage(pageNum, filterSet);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to load feed");
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters, dispatch, prefetchNextPage]);

  useEffect(() => {
    if (Array.isArray(feed) && feed.length > 0) {
      setIsLoading(false);
      ensureBuffer(feed.length, page);
      return;
    }
    loadFeed(1, false);
  }, []);

  const applyFilters = () => {
    setActiveFilters(filters);
    setPage(1);
    setLastSwipe(null);
    setUndoAvailable(false);
    dispatch(resetFeed());
    loadFeed(1, false, filters);
  };

  const resetFilters = () => {
    const empty = { city: "", gender: "", skills: [] };
    setFilters(empty);
    setActiveFilters(empty);
    setPage(1);
    setLastSwipe(null);
    setUndoAvailable(false);
    dispatch(resetFeed());
    loadFeed(1, false, empty);
  };

  const deckLocked = isSending || deckBusy;

  const afterSwipe = async (user, status, res) => {
    const matched = Boolean(res?.data?.matched);
    setLastSwipe({ user, status, matched });
    setUndoAvailable(!matched);
    dispatch(removeFeed(user._id));
    setRemainingUsers((prev) => {
      const next = prev.filter((u) => u._id !== user._id);
      ensureBuffer(next.length, page);
      return next;
    });

    if (status === "interested") {
      if (matched) {
        setMatchUser(user);
        toast("It's a match! 🎉", "success");
      } else {
        toast("Connection request sent!", "success");
        toast("Changed your mind? You can undo once.", "info");
      }
    } else {
      toast("Passed — undo once if you want them back.", "info");
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
      if (!res.data?.matched) toast("You can undo this swipe once.", "info");
      return true;
    } catch (error) {
      setErrorMessage(error.message || "Super Connect failed");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const undoSwipe = async () => {
    if (!lastSwipe || !undoAvailable) return;
    try {
      await api.delete(`request/undo/${lastSwipe.user._id}`);
      dispatch(prependFeed(lastSwipe.user));
      setRemainingUsers((prev) => [lastSwipe.user, ...prev]);
      setLastSwipe(null);
      setUndoAvailable(false);
      toast("Swipe undone — profile is back", "success");
    } catch {
      toast("Could not undo this swipe", "error");
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
  const upNext = remainingUsers.slice(1, 4);

  return (
    <div className="container-narrow px-5 sm:px-8 py-10 lg:py-12">
      <div className="text-center mb-8">
        <p className="label-caps mb-3">Discover</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Find your next collaborator</h1>
        <p className="text-[15px] text-text-secondary mt-2">
          {total > 0 ? `${total} developers · ` : ""}
          {remainingUsers.length} ready to swipe
        </p>
      </div>

      <FeedFilters filters={filters} onChange={setFilters} onApply={applyFilters} onReset={resetFilters} loading={isLoading} />

      {errorMessage && <Alert variant="error" className="mb-6 max-w-sm mx-auto" onDismiss={() => setErrorMessage("")}>{errorMessage}</Alert>}

      {remainingUsers.length > 0 ? (
        <>
          <SwipeDeck
            ref={deckRef}
            user={current}
            upNext={upNext}
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
            canUndo={undoAvailable && !!lastSwipe}
            disabled={deckLocked}
            loading={isSending}
          />
          <p className="text-center text-xs text-text-muted mt-4">
            {remainingUsers.length} in deck · tap card for details · ⌘K search
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
