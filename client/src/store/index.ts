import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    auth: authReducer,
    job: jobReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
