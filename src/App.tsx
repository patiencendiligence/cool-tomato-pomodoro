import { useState, useCallback } from 'react';
import { useTimer } from './hooks/useTimer';
import { useTasks } from './hooks/useTasks';
import { useStats } from './hooks/useStats';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { Timer } from './components/Timer';
import { TaskList } from './components/TaskList';
import { Stats } from './components/Stats';
import { Settings } from './components/Settings';
import { Navigation } from './components/Navigation';
import type { TimerMode } from './types';

type Tab = 'timer' | 'tasks' | 'stats' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const { theme, setTheme, colors } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const {
    tasks,
    currentTask,
    currentTaskId,
    completedTasks,
    addTask,
    deleteTask,
    completeTask,
    incrementPomodoro,
    selectTask,
  } = useTasks();

  const { addSession, getTodayStats, getWeeklyStats } = useStats();

  const handleTimerComplete = useCallback((mode: TimerMode) => {
    if (mode === 'work') {
      addSession(currentTaskId, 25 * 60, 'work', true);
      if (currentTaskId) {
        incrementPomodoro(currentTaskId);
      }
    }
  }, [currentTaskId, addSession, incrementPomodoro]);

  const {
    mode,
    timeLeft,
    isRunning,
    pomodorosInCycle,
    totalPomodoros,
    settings,
    start,
    pause,
    resume,
    skip,
    setMode,
    updateSettings,
  } = useTimer(handleTimerComplete);

  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const todayCompleted = completedTasks.filter(
    (t) => t.completedAt && t.completedAt.startsWith(new Date().toISOString().split('T')[0])
  ).length;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      color: colors.text,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '420px',
      margin: '0 auto',
      position: 'relative',
    }}>
      <header style={{
        padding: '16px',
        textAlign: 'center',
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '20px',
          fontWeight: 'bold',
          color: colors.primary,
        }}>
          🍅 {t.appName}
        </h1>
        {currentTask && activeTab === 'timer' && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            backgroundColor: colors.primary + '15',
            borderRadius: '20px',
            fontSize: '13px',
            color: colors.text,
            display: 'inline-block',
          }}>
            📌 {currentTask.title}
          </div>
        )}
      </header>

      <main style={{ 
        flex: 1, 
        overflowY: 'auto',
        paddingBottom: '70px',
      }}>
        {activeTab === 'timer' && (
          <Timer
            mode={mode}
            timeLeft={timeLeft}
            isRunning={isRunning}
            pomodorosInCycle={pomodorosInCycle}
            totalPomodoros={totalPomodoros}
            longBreakInterval={settings.longBreakInterval}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onSkip={skip}
            onModeChange={setMode}
            colors={colors}
            t={t}
          />
        )}
        
        {activeTab === 'tasks' && (
          <TaskList
            tasks={tasks}
            currentTaskId={currentTaskId}
            onSelectTask={selectTask}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onCompleteTask={completeTask}
            colors={colors}
            t={t}
          />
        )}
        
        {activeTab === 'stats' && (
          <Stats
            todayStats={todayStats}
            weeklyStats={weeklyStats}
            tasksCompleted={todayCompleted}
            colors={colors}
            t={t}
          />
        )}
        
        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            theme={theme}
            language={language}
            onUpdateSettings={updateSettings}
            onSetTheme={setTheme}
            onSetLanguage={setLanguage}
            colors={colors}
            t={t}
          />
        )}
      </main>

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        colors={colors}
        t={t}
      />
    </div>
  );
}

export default App;
