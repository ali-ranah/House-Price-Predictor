import { SET_LAST_UPDATE_DATE } from './Types';

export const setLastUpdateDate = (date) => {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  localStorage.setItem('lastUpdateDate', formattedDate); // Save formatted date to local storage
  return {
    type: SET_LAST_UPDATE_DATE,
    payload: formattedDate
  };
};

