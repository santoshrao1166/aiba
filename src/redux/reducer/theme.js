export const theme = (state = 'light', action) => {
  switch (action.type) {
    case 'CHANGE_THEME':
      return (state = action.payload);

    case 'SET_THEME':
      state = action.payload;
      return state;

    default:
      return state;
  }
};
