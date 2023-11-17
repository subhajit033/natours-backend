import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import userDetails from './userDetails';
import tourData from './tourData';
const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userDetails,
    tour: tourData,
  },
});

export default store;
