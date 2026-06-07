import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { prefetchInitialFeed } from "../../utils/feedLoader";

export default function useFeedPrefetch(user, enabled = true) {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !user?._id || startedRef.current) return undefined;
    if (Array.isArray(feed) && feed.length >= 10) return undefined;

    startedRef.current = true;
    let cancelled = false;

    prefetchInitialFeed(dispatch).catch(() => {
      if (!cancelled) startedRef.current = false;
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch, enabled, feed, user?._id]);
}
