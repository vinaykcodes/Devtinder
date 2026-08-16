import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: { feed: null },
  reducers: {
    addfeed: (state, action) => {
      state.feed = action.payload;
    },

    removefeed: (state) => {
      state.feed = null;
    },
  },
});
export const { addfeed, removefeed } = feedSlice.actions;
export default feedSlice.reducer;
