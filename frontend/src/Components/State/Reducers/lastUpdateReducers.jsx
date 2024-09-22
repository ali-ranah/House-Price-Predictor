import { SET_LAST_UPDATE_DATE } from '../Actions/Types';

const initialState = {
  lastUpdateDate: localStorage.getItem('lastUpdateDate') || "Not Updated" // Load from local storage
};

const lastUpdateReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_LAST_UPDATE_DATE:
      return {
        ...state,
        lastUpdateDate: action.payload
      };
    default:
      return state;
  }
};

export default lastUpdateReducers;