import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connection: null,
};
const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    addConnection: (state, action) => {
      state.connection = action.payload;
    },
    removeConnection: (state, action) => {
      state.connection = null;
    },
  },
});
export const { addConnection, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
