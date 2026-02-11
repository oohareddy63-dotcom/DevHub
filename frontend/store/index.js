import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import postReducer from './slices/postSlice';
import connectionReducer from './slices/connectionSlice';
import buildLogReducer from './slices/buildLogSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    connections: connectionReducer,
    buildLogs: buildLogReducer,
  },
});
