// nameSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: null,
};

const nameSlice = createSlice({
  name: 'name',
  initialState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },
  },
});

export const { setName } = nameSlice.actions;

// Selector function to select the name from the state
export const selectName = (state) => state.name.name;

export default nameSlice.reducer;

export const setNameAction = (name) => (dispatch) => {
  dispatch(setName(name));
  localStorage.setItem('name', name);
};
