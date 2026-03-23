import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerMode, TimerSettings } from '../types';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 20,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  notificationEnabled: true,
  soundEnabled: true,
  selectedSound: 'bell',
};

const SETTINGS_KEY = 'pomodoro-settings';

function loadSettings(): TimerSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: TimerSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function useTimer(onComplete?: (mode: TimerMode) => void) {
  const [settings, setSettingsState] = useState<TimerSettings>(loadSettings);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosInCycle, setPomodorosInCycle] = useState(0);
  const [totalPomodoros, setTotalPomodoros] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const getDuration = useCallback((timerMode: TimerMode): number => {
    switch (timerMode) {
      case 'work':
        return settings.workDuration * 60;
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
    }
  }, [settings]);

  const playSound = useCallback(() => {
    if (settings.soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleicAJIjeli0AAHCU1/KqVQ8AI4TifEwAAGuCv9aVPwwAIH/VcUQAAGRtnrF+MwwAHHO8WEAAAF5llZ9pKwwAGGelSDsAAFheg5FbJQsAFVyQNjUAAFJYdoROIAsAEleAKTAAAExTaoM/GwoAEFBxHSwAAEdOX3c5FgoADklmFCgAAEFJU2wzEgoAC0NdDyQAADxFR2UrDwoACj5UCSAAADdAO1olDAoACDlLBhwAADI8MU8hCQoABjRDAhkAAC03JkUdBwkABTBAAxYAACkzHDsZBQkABC0+/xMSAAAkLxIwFgMJAAMpOv0REAAAHysIJhMCCQACJTf7DxEAABsnACIOAgkAASE0+Q0PAAAWJP8dDAIJAAAcMfgLDgAAEiD/GAsBCQAAGC71CQ0AAA8e/xQKAAkAABQq8wcMAAALD/8QCQAJAAARJ/EFDAAACH//DggACQAADSPvAwsAAAX//wwHAAkAAAwh7wILAAAD//8LBwAJAAAKH+4BCgAAA///CwcACQAACR3uAAoAAAH//woGAAkAAAgb7v8JAAAg//8KBgAJAAAHGu7+CQAAH///CQYACQAABhjt/QgAAB7//wgFAAkAAAUW7fwIAAAd//8IBQAJAAAEFe37CAAAGv//BwQACQAABBTt+gcAABn//wYEAAkAAAMT7PkHAAAY//8GBAAJAAADEuz5BwAAFv//BQQACQAAA');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  }, [settings.soundEnabled]);

  const showNotification = useCallback((title: string, body: string) => {
    if (settings.notificationEnabled && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/icons/icon128.png' });
      }
    }
  }, [settings.notificationEnabled]);

  const updateSettings = useCallback((newSettings: Partial<TimerSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const switchMode = useCallback((newMode: TimerMode, autoStart = false) => {
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
    setIsRunning(autoStart);
    if (autoStart) {
      startTimeRef.current = Date.now();
    }
  }, [getDuration]);

  const handleTimerComplete = useCallback(() => {
    playSound();
    onComplete?.(mode);

    if (mode === 'work') {
      const newPomodorosInCycle = pomodorosInCycle + 1;
      setPomodorosInCycle(newPomodorosInCycle);
      setTotalPomodoros((prev) => prev + 1);

      if (newPomodorosInCycle >= settings.longBreakInterval) {
        showNotification('🎉 Cycle Complete!', 'Time for a long break!');
        setPomodorosInCycle(0);
        switchMode('longBreak', settings.autoStartBreaks);
      } else {
        showNotification('✅ Pomodoro Complete!', 'Time for a short break!');
        switchMode('shortBreak', settings.autoStartBreaks);
      }
    } else {
      showNotification('⏰ Break Over!', 'Time to focus!');
      switchMode('work', settings.autoStartPomodoros);
    }
  }, [mode, pomodorosInCycle, settings, playSound, showNotification, switchMode, onComplete]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleTimerComplete]);

  const start = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(true);
    startTimeRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  }, [getDuration, mode]);

  const skip = useCallback(() => {
    setIsRunning(false);
    handleTimerComplete();
  }, [handleTimerComplete]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(settings.workDuration * 60);
    setPomodorosInCycle(0);
  }, [settings.workDuration]);

  const setModeManually = useCallback((newMode: TimerMode) => {
    setIsRunning(false);
    switchMode(newMode, false);
  }, [switchMode]);

  return {
    mode,
    timeLeft,
    isRunning,
    pomodorosInCycle,
    totalPomodoros,
    settings,
    start,
    pause,
    resume,
    stop,
    skip,
    reset,
    setMode: setModeManually,
    updateSettings,
  };
}
