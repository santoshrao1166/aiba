export const setTheme = theme => {
  return {
    type: 'SET_THEME',
    payload: theme,
  };
};

export const changeTheme = newTheme => {
  return {
    type: 'CHANGE_THEME',
    payload: newTheme,
  };
};
