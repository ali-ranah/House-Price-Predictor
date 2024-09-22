// emailSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
  },
});

export const { setEmail } = emailSlice.actions;

// Selector function to select the email from the state
export const selectEmail = (state) => state.email.email;

export default emailSlice.reducer;

export const setEmailAction = (email) => (dispatch) => {
  dispatch(setEmail(email));
  localStorage.setItem('email', email);
};
