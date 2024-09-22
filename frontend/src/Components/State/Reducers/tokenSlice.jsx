// tokenSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    removeToken(state) {
      state.token = null;
    },
  },
});

export const { setToken,removeToken } = tokenSlice.actions;

// Selector function to select the email from the state
export const selectToken = (state) => state.token.token;

export default tokenSlice.reducer;

export const setTokenAction = (token) => (dispatch) => {
  dispatch(setToken(token));
  localStorage.setItem('token', token);
};
export const removeTokenAction = () => (dispatch) => {
  dispatch(removeToken());
  localStorage.removeItem('token');
}
