import { useState, useCallback, useRef, useEffect } from 'react';
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
  
  // Drag state for floating widget
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, textarea, a')) return;
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      let newX = dragRef.current.initialX + dx;
      let newY = dragRef.current.initialY + dy;
      
      // Keep within viewport bounds
      const widget = widgetRef.current;
      if (widget) {
        const rect = widget.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
      }
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
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
    <>
      {/* Full screen transparent background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'transparent',
        pointerEvents: 'none',
      }} />
      
      {/* Floating Widget */}
      <div 
        ref={widgetRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: 'linear-gradient(180deg, #f8f8fc 0%, #f0f0f5 100%)',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          overflow: 'hidden',
          zIndex: 99999,
          pointerEvents: 'auto',
        }}
      >
        {/* Main Content Area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
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
              padding: '12px',
              minWidth: '260px',
              maxWidth: '300px',
              maxHeight: '180px',
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
              padding: '12px',
              minWidth: '260px',
              maxWidth: '300px',
              maxHeight: '180px',
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
              padding: '12px',
              minWidth: '260px',
              maxWidth: '300px',
              maxHeight: '180px',
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

        {/* Vertical Navigation - Always visible on right */}
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
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)'
                  : 'transparent',
                boxShadow: activeTab === tab.id 
                  ? '0 2px 8px rgba(0,0,0,0.1)' 
                  : 'none',
                cursor: 'pointer',
                fontSize: '14px',
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
    </>
  );
}

export default App;
