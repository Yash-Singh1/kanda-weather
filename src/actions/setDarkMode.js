export const SET_DARK_MODE = 'SET_DARK_MODE';

export function setDarkMode(darkMode) {
  return {
    type: SET_DARK_MODE,
    darkMode
  };
}
