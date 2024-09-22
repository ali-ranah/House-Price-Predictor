// googleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
};

const googleSlice = createSlice({
  name: 'google',
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setIsLoggedOut(state) {
      state.isLoggedIn = false;
    },
  },
});

export const { setIsLoggedIn, setIsLoggedOut } = googleSlice.actions;

// Selector function to select isLoggedIn from the state
export const selectIsLoggedIn = (state) => state.google.isLoggedIn;

export default googleSlice.reducer;

export const setGoogleAction = (action) => (dispatch) => {
  dispatch(setIsLoggedIn(action));
  localStorage.setItem('isLoggedIn', action);
};
