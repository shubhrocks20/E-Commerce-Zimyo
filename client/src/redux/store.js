// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./cart/cartSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Wrap the cart reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, cartReducer);

// Create the Redux store with the persisted reducer
const store = configureStore({
  reducer: {
    cart: persistedReducer,
  },
  // Configure middleware to handle non-serializable values
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignored actions or paths
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["cart"], // If the entire cart state is being persisted
      },
    }),
});

// Create a persistor to manage rehydration
export const persistor = persistStore(store);
export default store;
