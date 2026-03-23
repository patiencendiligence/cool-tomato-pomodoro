import React, { useState } from 'react';
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
  t,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const getModeColor = () => {
    if (mode === 'work') return 'rgba(231, 76, 60, 0.6)';
    return 'rgba(39, 174, 96, 0.6)';
  };

  const getModeGlow = () => {
    if (mode === 'work') return '0 0 60px rgba(231, 76, 60, 0.4)';
    return '0 0 60px rgba(39, 174, 96, 0.4)';
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'work': return t.work;
      case 'shortBreak': return t.shortBreak;
      case 'longBreak': return t.longBreak;
    }
  };

  const glassStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(45, 45, 55, 0.9) 0%, rgba(30, 30, 40, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2),
      ${getModeGlow()}
    `,
  };

  const timeBlockStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 20px',
  };

  const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '50px',
    background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
  };

  const numberStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: '300',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    letterSpacing: '-2px',
    lineHeight: 1,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '8px',
  };

  const isFullTime = timeLeft === (mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 20 * 60);

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '30px 20px',
        position: 'relative',
      }}
    >
      {/* Mode indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        padding: '6px 16px',
        borderRadius: '20px',
        background: getModeColor(),
        backdropFilter: 'blur(10px)',
      }}>
        <span style={{ fontSize: '14px' }}>
          {mode === 'work' ? '🍅' : '☕'}
        </span>
        <span style={{ 
          color: '#fff', 
          fontSize: '13px', 
          fontWeight: '500',
          letterSpacing: '0.5px',
        }}>
          {getModeLabel()}
        </span>
      </div>

      {/* Main Timer Display - Liquid Glass */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...glassStyle,
          padding: '24px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, ${getModeColor()} 0%, transparent 50%)`,
          opacity: isRunning ? 0.3 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
        }} />

        {/* Progress bar at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          width: `${((mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 20 * 60) - timeLeft) / (mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 20 * 60) * 100}%`,
          background: mode === 'work' 
            ? 'linear-gradient(90deg, #e74c3c, #ff6b5b)' 
            : 'linear-gradient(90deg, #27ae60, #2ecc71)',
          borderRadius: '0 2px 2px 0',
          transition: 'width 1s linear',
        }} />

        {hours > 0 && (
          <>
            <div style={timeBlockStyle}>
              <span style={numberStyle}>{String(hours).padStart(2, '0')}</span>
              <span style={labelStyle}>{t.hours}</span>
            </div>
            <div style={dividerStyle} />
          </>
        )}
        
        <div style={timeBlockStyle}>
          <span style={numberStyle}>{String(minutes).padStart(2, '0')}</span>
          <span style={labelStyle}>{t.minutes}</span>
        </div>
        
        <div style={dividerStyle} />
        
        <div style={timeBlockStyle}>
          <span style={{
            ...numberStyle,
            color: isRunning ? '#fff' : 'rgba(255,255,255,0.8)',
          }}>
            {String(seconds).padStart(2, '0')}
          </span>
          <span style={labelStyle}>{t.seconds}</span>
        </div>

        {/* Hover Controls Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: isHovered ? 'auto' : 'none',
          borderRadius: '24px',
        }}>
          {!isRunning ? (
            <button
              onClick={isFullTime ? onStart : onResume}
              style={{
                padding: '12px 32px',
                fontSize: '15px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                color: '#333',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ▶ {isFullTime ? t.start : t.resume}
            </button>
          ) : (
            <>
              <button
                onClick={onPause}
                style={{
                  padding: '12px 28px',
                  fontSize: '15px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
                }}
              >
                ⏸ {t.pause}
              </button>
              <button
                onClick={onSkip}
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '30px',
                  cursor: 'pointer',
                }}
              >
                ⏭ {t.skip}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mode Selector - Glass Pills */}
      <div style={{ 
        display: 'flex', 
        gap: '8px',
        marginTop: '24px',
        padding: '6px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
      }}>
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '14px',
              background: mode === m 
                ? 'rgba(255,255,255,0.15)' 
                : 'transparent',
              color: mode === m ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: mode === m ? '600' : '400',
              transition: 'all 0.2s',
              letterSpacing: '0.3px',
            }}
          >
            {m === 'work' ? `🍅 ${t.work}` : m === 'shortBreak' ? `☕ ${t.shortBreak}` : `🌴 ${t.longBreak}`}
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginTop: '20px',
        padding: '12px 24px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ fontSize: '16px' }}>🔄</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{t.round}</span>
          <span style={{ 
            color: '#fff', 
            fontWeight: '600',
            fontSize: '14px',
          }}>
            {pomodorosInCycle}/{longBreakInterval}
          </span>
        </div>
        
        <div style={{
          width: '1px',
          height: '20px',
          background: 'rgba(255,255,255,0.1)',
        }} />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ fontSize: '16px' }}>🍅</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{t.totalPomodoros}</span>
          <span style={{ 
            color: '#fff', 
            fontWeight: '600',
            fontSize: '14px',
          }}>
            {totalPomodoros}
          </span>
        </div>
      </div>
    </div>
  );
};
