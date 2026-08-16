import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthChecked: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.isAuthChecked = true;
    },
    removeUser: (state) => {
      state.user = null;
      state.isAuthChecked = true;
    },
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload !== undefined ? action.payload : true;
    },
  },
});

export default userSlice.reducer;
export const { addUser, removeUser, setAuthChecked } = userSlice.actions;