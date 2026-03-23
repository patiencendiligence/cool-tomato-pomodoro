import { useState, useEffect, useCallback } from 'react';
import type { Language } from '../types';

const translations = {
  ko: {
    appName: '멋쟁이 토마토',
    timer: '타이머',
    tasks: '업무',
    stats: '통계',
    settings: '설정',
    work: '집중',
    shortBreak: '짧은 휴식',
    longBreak: '긴 휴식',
    start: '시작',
    pause: '일시정지',
    resume: '재개',
    stop: '중지',
    skip: '건너뛰기',
    reset: '초기화',
    pomodoro: '포모도로',
    pomodorosCompleted: '완료한 포모도로',
    focusTime: '집중 시간',
    minutes: '분',
    seconds: '초',
    addTask: '업무 추가',
    taskTitle: '업무 제목',
    taskDescription: '설명 (선택)',
    estimatedPomodoros: '예상 포모도로',
    priority: '우선순위',
    low: '낮음',
    medium: '보통',
    high: '높음',
    dueDate: '마감일',
    save: '저장',
    cancel: '취소',
    delete: '삭제',
    edit: '수정',
    complete: '완료',
    completed: '완료됨',
    inProgress: '진행중',
    noTasks: '업무가 없습니다',
    addFirstTask: '첫 번째 업무를 추가하세요!',
    todayStats: '오늘 통계',
    weeklyStats: '주간 통계',
    totalPomodoros: '총 포모도로',
    totalFocusTime: '총 집중 시간',
    tasksCompleted: '완료한 업무',
    hours: '시간',
    timerSettings: '타이머 설정',
    workDuration: '집중 시간',
    shortBreakDuration: '짧은 휴식',
    longBreakDuration: '긴 휴식',
    longBreakInterval: '긴 휴식 간격',
    autoStartBreaks: '휴식 자동 시작',
    autoStartPomodoros: '포모도로 자동 시작',
    notifications: '알림',
    notificationEnabled: '알림 활성화',
    sound: '소리',
    soundEnabled: '소리 활성화',
    theme: '테마',
    language: '언어',
    korean: '한국어',
    english: 'English',
    lightTheme: '라이트',
    darkTheme: '다크',
    tomatoTheme: '토마토',
    selectTask: '업무를 선택하세요',
    breakTime: '휴식 시간입니다!',
    workTime: '집중할 시간입니다!',
    pomodoroComplete: '포모도로 완료!',
    cycleComplete: '사이클 완료! 긴 휴식을 취하세요.',
    projects: '프로젝트',
    allTasks: '모든 업무',
    today: '오늘',
    noProject: '프로젝트 없음',
    focusOnTask: '이 업무에 집중',
    round: '라운드',
    timeUp: '시간 종료!',
  },
  en: {
    appName: 'Cool Tomato',
    timer: 'Timer',
    tasks: 'Tasks',
    stats: 'Stats',
    settings: 'Settings',
    work: 'Focus',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    skip: 'Skip',
    reset: 'Reset',
    pomodoro: 'Pomodoro',
    pomodorosCompleted: 'Pomodoros Completed',
    focusTime: 'Focus Time',
    minutes: 'min',
    seconds: 'sec',
    addTask: 'Add Task',
    taskTitle: 'Task Title',
    taskDescription: 'Description (optional)',
    estimatedPomodoros: 'Estimated Pomodoros',
    priority: 'Priority',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    dueDate: 'Due Date',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    complete: 'Complete',
    completed: 'Completed',
    inProgress: 'In Progress',
    noTasks: 'No tasks',
    addFirstTask: 'Add your first task!',
    todayStats: "Today's Stats",
    weeklyStats: 'Weekly Stats',
    totalPomodoros: 'Total Pomodoros',
    totalFocusTime: 'Total Focus Time',
    tasksCompleted: 'Tasks Completed',
    hours: 'hours',
    timerSettings: 'Timer Settings',
    workDuration: 'Work Duration',
    shortBreakDuration: 'Short Break',
    longBreakDuration: 'Long Break',
    longBreakInterval: 'Long Break Interval',
    autoStartBreaks: 'Auto-start Breaks',
    autoStartPomodoros: 'Auto-start Pomodoros',
    notifications: 'Notifications',
    notificationEnabled: 'Enable Notifications',
    sound: 'Sound',
    soundEnabled: 'Enable Sound',
    theme: 'Theme',
    language: 'Language',
    korean: '한국어',
    english: 'English',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    tomatoTheme: 'Tomato',
    selectTask: 'Select a task',
    breakTime: 'Break time!',
    workTime: 'Time to focus!',
    pomodoroComplete: 'Pomodoro complete!',
    cycleComplete: 'Cycle complete! Take a long break.',
    projects: 'Projects',
    allTasks: 'All Tasks',
    today: 'Today',
    noProject: 'No Project',
    focusOnTask: 'Focus on this task',
    round: 'Round',
    timeUp: "Time's up!",
  },
} as const;

export type Translations = typeof translations.ko | typeof translations.en;

const STORAGE_KEY = 'pomodoro-language';

function detectDefaultLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'ko' || stored === 'en') {
    return stored;
  }
  const browserLang = navigator.language || '';
  return browserLang.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(detectDefaultLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = translations[language];

  return { language, setLanguage, t };
}

export { translations };
