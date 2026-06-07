import api from "../src/lib/api";
import { addFeed, appendFeed } from "./FeedSlice";
import { buildFeedQuery } from "../src/components/FeedFilters";

export const FEED_PAGE_SIZE = 10;
export const PREFETCH_THRESHOLD = 5;

const EMPTY_FILTERS = { city: "", gender: "", skills: [] };

export const prefetchUserPhotos = (users = []) => {
  users.forEach((user) => {
    const url = user.photoUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user._id}`;
    const img = new Image();
    img.src = url;
  });
};

export const fetchFeedPage = async (page = 1, filters = EMPTY_FILTERS) => {
  const res = await api.get(`feed?${buildFeedQuery(filters, page)}`);
  const users = res.data?.data || [];
  prefetchUserPhotos(users);
  return {
    users,
    total: res.data?.total ?? users.length,
    hasMore: res.data?.hasMore ?? users.length >= FEED_PAGE_SIZE,
    page,
  };
};

export const loadFeedIntoStore = async (dispatch, { page = 1, append = false, filters = EMPTY_FILTERS } = {}) => {
  const result = await fetchFeedPage(page, filters);
  if (append) dispatch(appendFeed(result.users));
  else dispatch(addFeed(result.users));
  return result;
};

export const prefetchInitialFeed = async (dispatch) => {
  const first = await loadFeedIntoStore(dispatch, { page: 1, append: false });
  if (first.hasMore && first.users.length > 0) {
    await loadFeedIntoStore(dispatch, { page: 2, append: true });
    return { ...first, prefetchedPage: 2 };
  }
  return { ...first, prefetchedPage: 1 };
};
