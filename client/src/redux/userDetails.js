import { createSlice } from '@reduxjs/toolkit';

const userDetails = createSlice({
  name: 'user',
  initialState: {
    userData: null,
  },
  reducers: {
    loadUserDetails: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { loadUserDetails } = userDetails.actions;
export default userDetails.reducer;
