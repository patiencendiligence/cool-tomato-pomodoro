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

  return (
    <div style={{
      width: '360px',
      minHeight: '120px',
      background: 'linear-gradient(180deg, #f8f8fc 0%, #f0f0f5 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
    }}>
      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
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
        gap: '6px',
        padding: '10px 8px',
        borderLeft: '1px solid rgba(0,0,0,0.05)',
        background: 'rgba(255,255,255,0.5)',
      }}>
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)'
                : 'transparent',
              boxShadow: activeTab === tab.id 
                ? '0 2px 8px rgba(0,0,0,0.1)' 
                : 'none',
              cursor: 'pointer',
              fontSize: '16px',
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
  );
}

export default App;
