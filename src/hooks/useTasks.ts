import { useState, useEffect, useCallback } from 'react';
import type { Task, Project } from '../types';

const TASKS_KEY = 'pomodoro-tasks';
const PROJECTS_KEY = 'pomodoro-projects';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function loadProjects(): Project[] {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'pomodorosCompleted' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      completed: false,
      pomodorosCompleted: 0,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (currentTaskId === id) {
      setCurrentTaskId(null);
    }
  }, [currentTaskId]);

  const completeTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: true, completedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  const incrementPomodoro = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 }
          : task
      )
    );
  }, []);

  const addProject = useCallback((name: string, color: string) => {
    const newProject: Project = {
      id: generateId(),
      name,
      color,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) =>
      prev.map((task) =>
        task.projectId === id ? { ...task, projectId: null } : task
      )
    );
  }, []);

  const selectTask = useCallback((id: string | null) => {
    setCurrentTaskId(id);
  }, []);

  const currentTask = tasks.find((t) => t.id === currentTaskId) || null;
  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return {
    tasks,
    projects,
    currentTask,
    currentTaskId,
    incompleteTasks,
    completedTasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    incrementPomodoro,
    addProject,
    deleteProject,
    selectTask,
  };
}
