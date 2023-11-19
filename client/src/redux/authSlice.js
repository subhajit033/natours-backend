import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: null,
  },
  reducers: {
    authentication: (state, action) => {
        state.isAuthenticated = action.payload;
    },
  },
});
export const {authentication} = authSlice.actions;

export default authSlice.reducer;