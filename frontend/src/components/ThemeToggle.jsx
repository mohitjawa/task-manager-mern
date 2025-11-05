import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export default function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button className="theme-toggle" onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
