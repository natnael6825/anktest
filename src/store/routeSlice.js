// src/store/routeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  redirectRoute: null,
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    // Action to set the redirect route
    setRedirectRoute: (state, action) => {
      state.redirectRoute = action.payload;
    },
    // Action to clear the redirect route once it’s been used
    clearRedirectRoute: (state) => {
      state.redirectRoute = null;
    },
  },
});

export const { setRedirectRoute, clearRedirectRoute } = routeSlice.actions;
export default routeSlice.reducer;
