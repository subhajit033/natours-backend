import { createSlice } from '@reduxjs/toolkit';

const tourData = createSlice({
  name: 'tour',
  initialState: {
    tours: null,
  },
  reducers: {
    addTours: (state, action) => {
      state.tours = action.payload;
    },
  },
});

export const {addTours} = tourData.actions;
export default tourData.reducer