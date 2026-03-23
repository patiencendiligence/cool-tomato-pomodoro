import { useState, useEffect } from 'react';
import type { Theme } from '../types';

const THEME_KEY = 'pomodoro-theme';

const themes = {
  light: {
    background: '#f5f5f5',
    surface: '#ffffff',
    primary: '#e74c3c',
    primaryHover: '#c0392b',
    secondary: '#27ae60',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    border: '#ecf0f1',
    borderStrong: '#bdc3c7',
    success: '#27ae60',
    warning: '#f39c12',
    danger: '#e74c3c',
    buttonBg: '#ecf0f1',
    buttonHover: '#d5dbdb',
    cardBg: '#ffffff',
    timerBg: '#e74c3c',
    timerText: '#ffffff',
    breakBg: '#27ae60',
  },
  dark: {
    background: '#1a1a2e',
    surface: '#16213e',
    primary: '#e74c3c',
    primaryHover: '#c0392b',
    secondary: '#27ae60',
    text: '#ecf0f1',
    textSecondary: '#95a5a6',
    border: '#2c3e50',
    borderStrong: '#34495e',
    success: '#27ae60',
    warning: '#f39c12',
    danger: '#e74c3c',
    buttonBg: '#2c3e50',
    buttonHover: '#34495e',
    cardBg: '#16213e',
    timerBg: '#e74c3c',
    timerText: '#ffffff',
    breakBg: '#27ae60',
  },
  tomato: {
    background: '#ff6347',
    surface: '#ff7f66',
    primary: '#ffffff',
    primaryHover: '#f0f0f0',
    secondary: '#2ecc71',
    text: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.8)',
    border: 'rgba(255,255,255,0.2)',
    borderStrong: 'rgba(255,255,255,0.4)',
    success: '#2ecc71',
    warning: '#f1c40f',
    danger: '#c0392b',
    buttonBg: 'rgba(255,255,255,0.2)',
    buttonHover: 'rgba(255,255,255,0.3)',
    cardBg: 'rgba(255,255,255,0.1)',
    timerBg: 'rgba(255,255,255,0.2)',
    timerText: '#ffffff',
    breakBg: '#2ecc71',
  },
};

function loadTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'tomato') {
    return stored;
  }
  return 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(loadTheme);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.body.style.backgroundColor = themes[theme].background;
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const colors = themes[theme];

  return { theme, setTheme, colors };
}

export { themes };
