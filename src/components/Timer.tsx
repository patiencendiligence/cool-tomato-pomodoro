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
  
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const getStatusEmoji = () => {
    if (mode === 'work') return '🍅';
    if (mode === 'shortBreak') return '☕';
    return '🌴';
  };

  const getStatusLabel = () => {
    if (mode === 'work') return t.work;
    if (mode === 'shortBreak') return t.shortBreak;
    return t.longBreak;
  };

  const isFullTime = timeLeft === (mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 20 * 60);

  // Liquid Glass Style - color based on mode
  const getModeColor = () => {
    if (mode === 'work') return { r: 231, g: 76, b: 60 };
    if (mode === 'shortBreak') return { r: 39, g: 174, b: 96 };
    return { r: 46, g: 204, b: 113 };
  };
  const modeColor = getModeColor();

  const liquidGlassStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, rgba(${modeColor.r}, ${modeColor.g}, ${modeColor.b}, 0.12) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(${modeColor.r}, ${modeColor.g}, ${modeColor.b}, 0.08) 100%)`,
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    borderRadius: '32px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.08),
      0 2px 8px rgba(0, 0, 0, 0.04),
      inset 0 1px 1px rgba(255, 255, 255, 0.8),
      inset 0 -1px 1px rgba(255, 255, 255, 0.3)
    `,
  };

  // Expanded view
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
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(245,245,250,0.95) 100%)',
          backdropFilter: 'blur(40px)',
          borderRadius: '40px',
          margin: '10px',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
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
              width: '44px',
              height: '44px',
              borderRadius: '22px',
              border: '1px solid rgba(0,0,0,0.06)',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(20px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            ✕
          </button>
          
          {/* Mode selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '4px',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.3s',
          }}>
            {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  borderRadius: '20px',
                  background: mode === m 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
                    : 'transparent',
                  boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {m === 'work' ? '🍅' : m === 'shortBreak' ? '☕' : '🌴'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
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
                  width: '140px',
                  height: '140px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 12px 24px rgba(231, 76, 60, 0.25))',
                }}
              />
            </div>
            <div style={{
              marginTop: '24px',
              padding: '10px 24px',
              borderRadius: '24px',
              background: mode === 'work'
                ? 'linear-gradient(135deg, rgba(231, 76, 60, 0.15) 0%, rgba(231, 76, 60, 0.08) 100%)'
                : mode === 'shortBreak'
                ? 'linear-gradient(135deg, rgba(39, 174, 96, 0.15) 0%, rgba(39, 174, 96, 0.08) 100%)'
                : 'linear-gradient(135deg, rgba(46, 204, 113, 0.15) 0%, rgba(46, 204, 113, 0.08) 100%)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${mode === 'work' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(39, 174, 96, 0.2)'}`,
              color: mode === 'work' ? '#c0392b' : '#27ae60',
              fontSize: '15px',
              fontWeight: '600',
            }}>
              {getStatusEmoji()} {getStatusLabel()}
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
            paddingLeft: '16px',
          }}>
            <span style={{
              fontSize: '88px',
              fontWeight: '200',
              color: '#1a1a1a',
              lineHeight: 1,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '-3px',
            }}>
              {String(minutes).padStart(2, '0')}
            </span>
            <span style={{
              fontSize: '88px',
              fontWeight: '200',
              color: '#1a1a1a',
              lineHeight: 1,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '-3px',
            }}>
              {String(seconds).padStart(2, '0')}
            </span>
            <div style={{ marginTop: '20px', fontSize: '13px', color: '#888' }}>
              🔄 {pomodorosInCycle}/{longBreakInterval} • 🍅 {totalPomodoros}
            </div>
          </div>
        )}

        {/* Bottom Control */}
        <div style={{
          paddingTop: '20px',
        }}>
          {!isRunning ? (
            <button
              onClick={isFullTime ? onStart : onResume}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '32px',
                border: 'none',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              ▶
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onPause}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '28px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '18px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                }}
              >
                ⏸
              </button>
              <button
                onClick={onSkip}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '28px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ⏭
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Compact view - True Liquid Glass Style
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        background: 'linear-gradient(180deg, #f8f8fc 0%, #f0f0f5 100%)',
        minHeight: '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Paused/Stopped State - Only Tomato */}
      {!isRunning ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Bouncing Tomato */}
          <div 
            style={{
              animation: 'bounce 1s ease-in-out infinite',
              cursor: 'pointer',
            }}
            onClick={isFullTime ? onStart : onResume}
          >
            <img 
              src="/tomato-mascot.png" 
              alt="Cool Tomato"
              style={{
                width: '160px',
                height: '160px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 16px 32px rgba(231, 76, 60, 0.25))',
              }}
            />
          </div>

          {/* Play Button */}
          <button
            onClick={isFullTime ? onStart : onResume}
            style={{
              marginTop: '32px',
              width: '64px',
              height: '64px',
              borderRadius: '32px',
              fontSize: '24px',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ▶
          </button>

          {/* Mode Pills - Always visible when paused */}
          <div style={{
            display: 'flex',
            gap: '6px',
            padding: '6px',
            marginTop: '24px',
            borderRadius: '28px',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}>
            {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  borderRadius: '20px',
                  background: mode === m 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)'
                    : 'transparent',
                  boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
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
        </div>
      ) : (
        /* Running State - Only Timer */
        <>
          {/* Liquid Glass Timer Container */}
          <div
            style={{
              ...liquidGlassStyle,
              padding: '28px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            {/* Status Badge - Liquid Glass Pill */}
            <div style={{
              position: 'absolute',
              top: '-14px',
              right: '16px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: mode === 'work'
                ? 'linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(231, 76, 60, 0.1) 100%)'
                : mode === 'shortBreak'
                ? 'linear-gradient(135deg, rgba(39, 174, 96, 0.2) 0%, rgba(39, 174, 96, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${mode === 'work' ? 'rgba(231, 76, 60, 0.3)' : 'rgba(39, 174, 96, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}>
              <span style={{ fontSize: '13px' }}>{getStatusEmoji()}</span>
              <span style={{ 
                color: mode === 'work' ? '#c0392b' : '#1e8449', 
                fontSize: '12px', 
                fontWeight: '600',
                letterSpacing: '0.3px',
              }}>
                {getStatusLabel()}
              </span>
            </div>

            {/* Progress bar - Liquid style */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '16px',
              right: '16px',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${((mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 20 * 60) - timeLeft) / (mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 20 * 60) * 100}%`,
                background: `linear-gradient(90deg, rgba(${modeColor.r}, ${modeColor.g}, ${modeColor.b}, 0.8), rgba(${modeColor.r}, ${modeColor.g}, ${modeColor.b}, 0.5))`,
                borderRadius: '2px',
                transition: 'width 1s linear',
              }} />
            </div>

            {/* Time Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontSize: '52px',
                  fontWeight: '300',
                  color: '#1a1a1a',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  letterSpacing: '-2px',
                  lineHeight: 1,
                }}>
                  {String(minutes).padStart(2, '0')}
                </span>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(0,0,0,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginTop: '6px',
                }}>
                  {t.minutes}
                </div>
              </div>

              {/* Divider - Liquid Glass */}
              <div style={{
                width: '2px',
                height: '40px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                borderRadius: '1px',
              }} />

              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontSize: '52px',
                  fontWeight: '300',
                  color: '#1a1a1a',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  letterSpacing: '-2px',
                  lineHeight: 1,
                }}>
                  {String(seconds).padStart(2, '0')}
                </span>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(0,0,0,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginTop: '6px',
                }}>
                  {t.seconds}
                </div>
              </div>
            </div>

            {/* Hover Controls - Liquid Glass Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: isHovered ? 'auto' : 'none',
              borderRadius: '32px',
            }}>
              <button
                onClick={onPause}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '26px',
                  fontSize: '18px',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
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
                  borderRadius: '22px',
                  fontSize: '14px',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  border: '1px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ⏭
              </button>
            </div>
          </div>

          {/* Bottom Controls - Liquid Glass Pills (hover only) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px',
            marginTop: '28px',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.3s ease',
            pointerEvents: isHovered ? 'auto' : 'none',
          }}>
            {/* Mode Pills */}
            <div style={{
              display: 'flex',
              gap: '6px',
              padding: '6px',
              borderRadius: '28px',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}>
              {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => onModeChange(m)}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: 'none',
                    borderRadius: '20px',
                    background: mode === m 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)'
                      : 'transparent',
                    boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
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

            {/* Expand Button */}
            <button
              onClick={() => setIsExpanded(true)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.8)',
                color: '#666',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}
              title="Expand"
            >
              ⤢
            </button>
          </div>

          {/* Stats Row - Liquid Glass */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: isHovered ? '20px' : '28px',
            padding: '12px 20px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            transition: 'margin-top 0.3s ease',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ fontSize: '14px' }}>🔄</span>
              <span style={{ color: 'rgba(0,0,0,0.4)', fontSize: '12px' }}>{t.round}</span>
              <span style={{ 
                color: '#1a1a1a', 
                fontWeight: '600',
                fontSize: '13px',
              }}>
                {pomodorosInCycle}/{longBreakInterval}
              </span>
            </div>
            
            <div style={{
              width: '1px',
              height: '16px',
              background: 'rgba(0,0,0,0.1)',
            }} />
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ fontSize: '14px' }}>🍅</span>
              <span style={{ color: 'rgba(0,0,0,0.4)', fontSize: '12px' }}>{t.totalPomodoros}</span>
              <span style={{ 
                color: '#1a1a1a', 
                fontWeight: '600',
                fontSize: '13px',
              }}>
                {totalPomodoros}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
