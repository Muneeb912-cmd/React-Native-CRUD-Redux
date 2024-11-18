import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer,createTransform } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import usersReducer from './usersDataReducer';


const persistCurrentUserTransform = createTransform(
    (inboundState) => {
      return { currentUser: inboundState.currentUser };
    },
    (outboundState, key) => {
      return { currentUser: outboundState.currentUser };
    },
    { whitelist: ["users"] }
  );

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['users'], 
  transforms: [persistCurrentUserTransform],
};

const persistedReducer = persistReducer(persistConfig, usersReducer);

export const store = configureStore({
  reducer: {
    users: persistedReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

