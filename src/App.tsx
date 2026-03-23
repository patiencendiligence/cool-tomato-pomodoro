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
import type { TimerMode } from './types';

type Tab = 'timer' | 'tasks' | 'stats' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const { theme, setTheme, colors } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const {
    tasks,
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

  // Navigation tabs
  const navTabs: { id: Tab; icon: string }[] = [
    { id: 'timer', icon: '⏱️' },
    { id: 'tasks', icon: '✅' },
    { id: 'stats', icon: '📊' },
    { id: 'settings', icon: '⚙️' },
  ];

  // Theme-based container styles
  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, rgba(30, 30, 35, 0.95) 0%, rgba(20, 20, 25, 0.9) 50%, rgba(30, 30, 35, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      };
    }
    if (theme === 'tomato') {
      return {
        background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.85) 0%, rgba(192, 57, 43, 0.9) 50%, rgba(231, 76, 60, 0.85) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      };
    }
    return {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 252, 0.9) 50%, rgba(255, 255, 255, 0.95) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
    };
  };

  const themeStyles = getThemeStyles();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme === 'dark' 
        ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' 
        : theme === 'tomato'
        ? 'linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)'
        : 'linear-gradient(180deg, #f5f7fa 0%, #e8ecf0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
        `}
      </style>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        ...themeStyles,
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderRadius: '32px',
        boxShadow: `
          0 20px 60px rgba(0, 0, 0, 0.15),
          0 8px 20px rgba(0, 0, 0, 0.1),
          inset 0 1px 1px rgba(255, 255, 255, ${theme === 'dark' ? '0.1' : '0.8'}),
          inset 0 -1px 1px rgba(255, 255, 255, ${theme === 'dark' ? '0.05' : '0.4'})
        `,
        overflow: 'hidden',
      }}>
        {/* Main Content Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 16px',
          minWidth: '280px',
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
          <div style={{ 
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
          }}>
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
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div style={{ 
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
          }}>
            <Stats
              todayStats={todayStats}
              weeklyStats={weeklyStats}
              tasksCompleted={todayCompleted}
              colors={colors}
              t={t}
            />
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div style={{ 
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
          }}>
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
          </div>
        )}
      </div>

        {/* Vertical Navigation - Right Side */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 10px',
          borderLeft: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          background: theme === 'dark' 
            ? 'rgba(0,0,0,0.2)'
            : theme === 'tomato'
            ? 'rgba(255,255,255,0.15)'
            : 'rgba(255,255,255,0.5)',
        }}>
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id 
                  ? theme === 'dark'
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)'
                  : 'transparent',
                boxShadow: activeTab === tab.id 
                  ? theme === 'dark'
                    ? '0 2px 8px rgba(0,0,0,0.3)'
                    : '0 2px 8px rgba(0,0,0,0.1)'
                  : 'none',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
