import { useState, useEffect, useCallback } from 'react';
import type { PomodoroSession, TimerMode } from '../types';

const SESSIONS_KEY = 'pomodoro-sessions';

function loadSessions(): PomodoroSession[] {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: PomodoroSession[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function useStats() {
  const [sessions, setSessions] = useState<PomodoroSession[]>(loadSessions);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const addSession = useCallback((
    taskId: string | null,
    duration: number,
    type: TimerMode,
    completed: boolean
  ) => {
    const now = new Date();
    const newSession: PomodoroSession = {
      id: generateId(),
      taskId,
      startTime: new Date(now.getTime() - duration * 1000).toISOString(),
      endTime: now.toISOString(),
      duration,
      type,
      completed,
    };
    setSessions((prev) => [...prev, newSession]);
  }, []);

  const getTodayStats = useCallback(() => {
    const today = getDateString();
    const todaySessions = sessions.filter(
      (s) => s.startTime.startsWith(today) && s.type === 'work' && s.completed
    );

    return {
      totalPomodoros: todaySessions.length,
      totalFocusTime: todaySessions.reduce((acc, s) => acc + s.duration, 0),
    };
  }, [sessions]);

  const getWeeklyStats = useCallback(() => {
    const weekStart = getWeekStart();
    const weeklySessions = sessions.filter((s) => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= weekStart && s.type === 'work' && s.completed;
    });

    const dailyData: Record<string, { pomodoros: number; focusTime: number }> = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = getDateString(date);
      dailyData[dateStr] = { pomodoros: 0, focusTime: 0 };
    }

    weeklySessions.forEach((s) => {
      const dateStr = s.startTime.split('T')[0];
      if (dailyData[dateStr]) {
        dailyData[dateStr].pomodoros += 1;
        dailyData[dateStr].focusTime += s.duration;
      }
    });

    return {
      totalPomodoros: weeklySessions.length,
      totalFocusTime: weeklySessions.reduce((acc, s) => acc + s.duration, 0),
      dailyData,
    };
  }, [sessions]);

  const getTaskStats = useCallback((taskId: string) => {
    const taskSessions = sessions.filter(
      (s) => s.taskId === taskId && s.type === 'work' && s.completed
    );
    return {
      pomodoros: taskSessions.length,
      totalTime: taskSessions.reduce((acc, s) => acc + s.duration, 0),
    };
  }, [sessions]);

  return {
    sessions,
    addSession,
    getTodayStats,
    getWeeklyStats,
    getTaskStats,
  };
}
