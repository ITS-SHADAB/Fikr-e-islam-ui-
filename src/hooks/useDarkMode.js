import { useEffect } from 'react';

export default function useDarkMode() {
  const theme = 'light';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const toggleTheme = () => {
    // No-op
  };

  return [theme, toggleTheme];
}
