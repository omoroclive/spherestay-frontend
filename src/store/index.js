import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'

// Import your slices
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import cacheReducer from './slices/cacheSlice'
import wishlistReducer from './slices/wishlistSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist these reducers
}

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  cache: cacheReducer,
  wishlist: wishlistReducer, // Ensure wishlistReducer is imported and added
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

// Create the persistor
const persistor = persistStore(store)

// Named exports
export { store, persistor }

// Default export (for backward compatibility)
export default store