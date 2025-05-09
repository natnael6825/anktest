// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './userSlice';
// import offersReducer from './offerSlice';
// import routeReducer from "./routeSlice"

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//     offers: offersReducer,
//     route: routeReducer,
//   },
// });

// export default store;



// src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import offersReducer from './offerSlice';
import routeReducer from './routeSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Define the persist configuration
const persistConfig = {
  key: 'root',           
  storage,               
  whitelist: [ 'offers'] 
};

// Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
  offers: offersReducer,
  route: routeReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  // Disable serializable checks for redux-persist actions (optional but recommended)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create the persistor which will be used in your entry point
export const persistor = persistStore(store);

export default store;
