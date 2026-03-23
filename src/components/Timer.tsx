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
  const [isExpanded, setIsExpanded] = useState(false);
  
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

  const getStatusEmoji = () => {
    if (!isRunning) return '☕';
    return mode === 'work' ? '🍅' : '☕';
  };

  const isFullTime = timeLeft === (mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 20 * 60);

  // Expanded view - Big Typography Style
  if (isExpanded) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '20px',
          minHeight: '400px',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,240,245,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          margin: '10px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: '20px',
        }}>
          <button
            onClick={() => setIsExpanded(false)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.05)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            ⏱
          </button>
          
          {/* Mode selector on hover */}
          <div style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.08)',
            borderRadius: '20px',
            padding: '4px',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}>
            {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '16px',
                  background: mode === m ? '#000' : 'transparent',
                  color: mode === m ? '#fff' : '#666',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '500',
                }}
              >
                {m === 'work' ? '🍅' : m === 'shortBreak' ? '☕' : '🌴'}
              </button>
            ))}
          </div>
        </div>

        {/* Bouncing Tomato OR Timer */}
        {!isRunning ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ animation: 'bounce 1s ease-in-out infinite' }}>
              <img 
                src="/tomato-mascot.png" 
                alt="Cool Tomato"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 20px rgba(231, 76, 60, 0.3))',
                }}
              />
            </div>
            <div style={{
              marginTop: '20px',
              padding: '8px 20px',
              borderRadius: '20px',
              background: 'rgba(39, 174, 96, 0.15)',
              color: '#27ae60',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              ☕ {t.shortBreak}
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            paddingLeft: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{
                fontSize: '96px',
                fontWeight: '700',
                color: '#000',
                lineHeight: 0.9,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                letterSpacing: '-4px',
              }}>
                {String(minutes).padStart(2, '0')}
              </span>
              <span style={{
                fontSize: '24px',
                color: '#666',
                marginBottom: '15px',
                fontWeight: '400',
              }}>
                {t.work}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{
                fontSize: '96px',
                fontWeight: '700',
                color: '#000',
                lineHeight: 0.9,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                letterSpacing: '-4px',
              }}>
                {String(seconds).padStart(2, '0')}
              </span>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '12px',
                opacity: 0.3,
              }}>
                <span style={{ fontSize: '28px', fontWeight: '600', color: '#000' }}>
                  {String((seconds + 1) % 60).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <div style={{
                fontSize: '14px',
                color: '#888',
              }}>
                🔄 {pomodorosInCycle}/{longBreakInterval} • 🍅 {totalPomodoros} {t.pomodoro}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          paddingTop: '20px',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}>
          {!isRunning ? (
            <button
              onClick={isFullTime ? onStart : onResume}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: 'none',
                background: '#000',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              ▶
            </button>
          ) : (
            <>
              <button
                onClick={onPause}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#000',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ⏸
              </button>
              <button
                onClick={onSkip}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '2px solid rgba(0,0,0,0.1)',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ⏭
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Compact view - Liquid Glass Style
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

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '30px 20px',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bouncing Tomato when stopped - OR - Timer when running */}
      {!isRunning ? (
        <div style={{
          marginBottom: '20px',
          animation: 'bounce 1s ease-in-out infinite',
        }}>
          <img 
            src="/tomato-mascot.png" 
            alt="Cool Tomato"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 16px rgba(231, 76, 60, 0.3))',
              cursor: 'pointer',
            }}
            onClick={isFullTime ? onStart : onResume}
          />
        </div>
      ) : null}

      {/* Main Timer Display - Liquid Glass (only when running OR always show compact) */}
      <div
        style={{
          ...glassStyle,
          padding: '24px 16px',
          display: isRunning ? 'flex' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          position: 'relative',
          overflow: 'hidden',
          opacity: isRunning ? 1 : 0.6,
        }}
      >
        {/* Status Badge - Top Right */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: '-8px',
          padding: '6px 14px',
          borderRadius: '16px',
          background: isRunning ? getModeColor() : 'rgba(39, 174, 96, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          <span style={{ fontSize: '12px' }}>{getStatusEmoji()}</span>
          <span style={{ 
            color: '#fff', 
            fontSize: '11px', 
            fontWeight: '600',
            letterSpacing: '0.5px',
          }}>
            {isRunning ? (mode === 'work' ? t.work : t.shortBreak) : t.shortBreak}
          </span>
        </div>

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
            color: isRunning ? '#fff' : 'rgba(255,255,255,0.6)',
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
          background: 'rgba(0, 0, 0, 0.75)',
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
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                fontSize: '20px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                color: '#333',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ▶
            </button>
          ) : (
            <>
              <button
                onClick={onPause}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                  color: '#333',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ⏸
              </button>
              <button
                onClick={onSkip}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  fontSize: '14px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ⏭
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Controls - Icons only, show on hover */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '12px',
        marginTop: '24px',
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.3s ease',
        pointerEvents: isHovered ? 'auto' : 'none',
      }}>
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '8px',
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
        }}>
          {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              style={{
                width: '36px',
                height: '36px',
                border: 'none',
                borderRadius: '50%',
                background: mode === m 
                  ? 'rgba(255,255,255,0.2)' 
                  : 'transparent',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={m === 'work' ? t.work : m === 'shortBreak' ? t.shortBreak : t.longBreak}
            >
              {m === 'work' ? '🍅' : m === 'shortBreak' ? '☕' : '🌴'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsExpanded(true)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
          title="Expand"
        >
          ⤢
        </button>
      </div>

      {/* Stats Row - Always visible */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginTop: isHovered ? '16px' : '24px',
        padding: '10px 20px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        transition: 'margin-top 0.3s ease',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ fontSize: '14px' }}>🔄</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{t.round}</span>
          <span style={{ 
            color: '#fff', 
            fontWeight: '600',
            fontSize: '13px',
          }}>
            {pomodorosInCycle}/{longBreakInterval}
          </span>
        </div>
        
        <div style={{
          width: '1px',
          height: '16px',
          background: 'rgba(255,255,255,0.1)',
        }} />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ fontSize: '14px' }}>🍅</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{t.totalPomodoros}</span>
          <span style={{ 
            color: '#fff', 
            fontWeight: '600',
            fontSize: '13px',
          }}>
            {totalPomodoros}
          </span>
        </div>
      </div>
    </div>
  );
};
