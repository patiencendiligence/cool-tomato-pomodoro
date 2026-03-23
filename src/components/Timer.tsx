import React from 'react';
import type { TimerMode } from '../types';
import type { Translations } from '../hooks/useLanguage';

interface TimerProps {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  pomodorosInCycle: number;
  totalPomodoros: number;
  longBreakInterval: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onModeChange: (mode: TimerMode) => void;
  colors: Record<string, string>;
  t: Translations;
}

export const Timer: React.FC<TimerProps> = ({
  mode,
  timeLeft,
  isRunning,
  pomodorosInCycle,
  totalPomodoros,
  longBreakInterval,
  onStart,
  onPause,
  onResume,
  onSkip,
  onModeChange,
  colors,
  t,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = mode === 'work' 
    ? 1 - (timeLeft / (25 * 60))
    : 1 - (timeLeft / (mode === 'shortBreak' ? 5 * 60 : 20 * 60));

  const getModeColor = () => {
    if (mode === 'work') return colors.timerBg;
    return colors.breakBg;
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'work': return t.work;
      case 'shortBreak': return t.shortBreak;
      case 'longBreak': return t.longBreak;
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px',
        marginBottom: '24px',
      }}>
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              backgroundColor: mode === m ? getModeColor() : colors.buttonBg,
              color: mode === m ? '#fff' : colors.text,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: mode === m ? 'bold' : 'normal',
              transition: 'all 0.2s',
            }}
          >
            {m === 'work' ? t.work : m === 'shortBreak' ? t.shortBreak : t.longBreak}
          </button>
        ))}
      </div>

      <div style={{
        width: '240px',
        height: '240px',
        borderRadius: '50%',
        backgroundColor: getModeColor(),
        margin: '0 auto 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        position: 'relative',
      }}>
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
          }}
          width="240"
          height="240"
        >
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
          />
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={2 * Math.PI * 110 * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s' }}
          />
        </svg>
        
        <div style={{ 
          fontSize: '56px', 
          fontWeight: 'bold', 
          color: '#fff',
          fontFamily: 'monospace',
          zIndex: 1,
        }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: 'rgba(255,255,255,0.8)',
          marginTop: '8px',
          zIndex: 1,
        }}>
          {getModeLabel()}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px',
        marginBottom: '20px',
      }}>
        {!isRunning ? (
          <button
            onClick={timeLeft === (mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 20 * 60) ? onStart : onResume}
            style={{
              padding: '14px 40px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#fff',
              color: getModeColor(),
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {timeLeft === (mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 20 * 60) ? t.start : t.resume}
          </button>
        ) : (
          <button
            onClick={onPause}
            style={{
              padding: '14px 40px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#fff',
              color: getModeColor(),
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {t.pause}
          </button>
        )}
        
        {isRunning && (
          <button
            onClick={onSkip}
            style={{
              padding: '14px 24px',
              fontSize: '14px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: '30px',
              cursor: 'pointer',
            }}
          >
            {t.skip}
          </button>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4px',
        color: colors.textSecondary,
        fontSize: '14px',
      }}>
        <span>{t.round}</span>
        <span style={{ fontWeight: 'bold', color: colors.text }}>
          {pomodorosInCycle}/{longBreakInterval}
        </span>
        <span style={{ margin: '0 8px' }}>•</span>
        <span>🍅 {totalPomodoros}</span>
      </div>
    </div>
  );
};
