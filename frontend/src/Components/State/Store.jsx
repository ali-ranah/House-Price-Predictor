// store.js
import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './Reducers/emailSlice';
import lastUpdateReducers from './Reducers/lastUpdateReducers';
import tokenReducer from './Reducers/tokenSlice';
import nameReducer from './Reducers/nameSlice';
import googleReducer from './Reducers/googleSlice';
const Store = configureStore({
  reducer: {
    email: emailReducer,
    lastUpdate: lastUpdateReducers,
    token:tokenReducer,
    name:nameReducer,
    google: googleReducer,
  },
});

export default Store;
