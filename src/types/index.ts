export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  notificationEnabled: boolean;
  soundEnabled: boolean;
  selectedSound: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  pomodorosEstimated: number;
  pomodorosCompleted: number;
  projectId: string | null;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  taskId: string | null;
  startTime: string;
  endTime: string;
  duration: number;
  type: TimerMode;
  completed: boolean;
}

export interface DailyStats {
  date: string;
  totalPomodoros: number;
  totalFocusTime: number;
  tasksCompleted: number;
  sessions: PomodoroSession[];
}

export interface AppState {
  tasks: Task[];
  projects: Project[];
  sessions: PomodoroSession[];
  settings: TimerSettings;
  currentTaskId: string | null;
}

export type Language = 'ko' | 'en';

export type Theme = 'light' | 'dark' | 'tomato';
