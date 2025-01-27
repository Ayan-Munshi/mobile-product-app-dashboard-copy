import { configureStore } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import logger from "redux-logger";
import { reducers } from "./rootReducers"; // Combine your reducers here
import { apiSlice } from "./practiceDashBoard/apiSlice"; // Adjust path as needed
import localStorage from "redux-persist/es/storage";

// Persist configuration
const persistConfig: PersistConfig<ReturnType<typeof reducers>> = {
  key: "root",
  storage: localStorage,
  timeout: 0, // Adjust if you want to handle persistence delays differently
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, reducers);

// Configure the Redux store with persist and middleware
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Add the RTK Query reducer
    persisted: persistedReducer, // Add persisted reducer if applicable
  },
  devTools: import.meta.env.NODE_ENV !== "production", // Enable devTools in development
  middleware: (getDefaultMiddleware) => {
    const baseMiddleware = getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    });

    // Add the RTK Query middleware
    const middleware = baseMiddleware.concat(apiSlice.middleware);

    // Add logger middleware only in development mode
    return import.meta.env.NODE_ENV === "development"
      ? middleware.concat(logger)
      : middleware;
  },
});

// Define RootState from the store
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch from the store
export type AppDispatch = typeof store.dispatch;

// Persistor for redux-persist
export const persistor = persistStore(store);
export default store;
