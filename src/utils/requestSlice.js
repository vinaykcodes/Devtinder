import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  request: null,
};
const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    addReq: (state, action) => {
      state.request = action.payload;
    },
    removeReq: (state) => {
      state.request = null;
    },
  },
});
export const { addReq, removeReq } = requestSlice.actions;
export default requestSlice.reducer;
