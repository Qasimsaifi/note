import { writable } from 'svelte/store';

const getInitialTheme = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('theme') || 'retro';
  }
  return 'light'; // Fallback theme if localStorage is not available
};

const createThemeStore = () => {
  const { subscribe, set } = writable(getInitialTheme());

  return {
    subscribe,
    set: (value) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', value); // Save the selected theme to local storage
      }
      set(value);
    },
  };
};

export const theme = createThemeStore();
