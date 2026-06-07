import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (_state, action) => action.payload,
    appendFeed: (state, action) => {
      if (!Array.isArray(state)) return action.payload;
      const existingIds = new Set(state.map((u) => u._id));
      const newUsers = action.payload.filter((u) => !existingIds.has(u._id));
      return [...state, ...newUsers];
    },
    removeFeed: (state, action) => {
      if (!Array.isArray(state)) return state;
      return state.filter((user) => user._id !== action.payload);
    },
    resetFeed: () => null,
    prependFeed: (state, action) => {
      const u = action.payload;
      if (!Array.isArray(state)) return [u];
      return [u, ...state.filter((x) => x._id !== u._id)];
    },
  },
});

export const { addFeed, appendFeed, removeFeed, resetFeed, prependFeed } = feedSlice.actions;
export default feedSlice.reducer;
