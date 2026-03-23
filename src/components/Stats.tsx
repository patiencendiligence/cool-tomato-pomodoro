import React from 'react';
import type { Translations } from '../hooks/useLanguage';

interface StatsProps {
  todayStats: {
    totalPomodoros: number;
    totalFocusTime: number;
  };
  weeklyStats: {
    totalPomodoros: number;
    totalFocusTime: number;
    dailyData: Record<string, { pomodoros: number; focusTime: number }>;
  };
  tasksCompleted: number;
  colors: Record<string, string>;
  t: Translations;
}

export const Stats: React.FC<StatsProps> = ({
  todayStats,
  weeklyStats,
  tasksCompleted,
  colors,
  t,
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}${t.hours} ${minutes}${t.minutes}`;
    }
    return `${minutes}${t.minutes}`;
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyEntries = Object.entries(weeklyStats.dailyData);
  const maxPomodoros = Math.max(...dailyEntries.map(([_, d]) => d.pomodoros), 1);

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ 
        fontSize: '18px', 
        marginBottom: '20px',
        color: colors.text,
      }}>
        📊 {t.todayStats}
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px',
        marginBottom: '28px',
      }}>
        <div style={{
          backgroundColor: colors.cardBg,
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${colors.border}`,
        }}>
          <div style={{ fontSize: '32px', marginBottom: '4px' }}>🍅</div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: colors.primary,
          }}>
            {todayStats.totalPomodoros}
          </div>
          <div style={{ fontSize: '11px', color: colors.textSecondary }}>
            {t.totalPomodoros}
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.cardBg,
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${colors.border}`,
        }}>
          <div style={{ fontSize: '32px', marginBottom: '4px' }}>⏱️</div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: colors.secondary,
          }}>
            {formatTime(todayStats.totalFocusTime)}
          </div>
          <div style={{ fontSize: '11px', color: colors.textSecondary }}>
            {t.totalFocusTime}
          </div>
        </div>
        
        <div style={{
          backgroundColor: colors.cardBg,
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${colors.border}`,
        }}>
          <div style={{ fontSize: '32px', marginBottom: '4px' }}>✅</div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: colors.success,
          }}>
            {tasksCompleted}
          </div>
          <div style={{ fontSize: '11px', color: colors.textSecondary }}>
            {t.tasksCompleted}
          </div>
        </div>
      </div>

      <h2 style={{ 
        fontSize: '18px', 
        marginBottom: '20px',
        color: colors.text,
      }}>
        📈 {t.weeklyStats}
      </h2>
      
      <div style={{
        backgroundColor: colors.cardBg,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}>
          <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
            {t.totalPomodoros}: <strong style={{ color: colors.text }}>{weeklyStats.totalPomodoros}</strong>
          </span>
          <span style={{ color: colors.textSecondary, fontSize: '13px' }}>
            {t.totalFocusTime}: <strong style={{ color: colors.text }}>{formatTime(weeklyStats.totalFocusTime)}</strong>
          </span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          height: '120px',
          paddingBottom: '24px',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          {dailyEntries.map(([date, data]) => (
            <div
              key={date}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: `${Math.max((data.pomodoros / maxPomodoros) * 80, 4)}px`,
                  backgroundColor: data.pomodoros > 0 ? colors.primary : colors.border,
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s',
                }}
              />
              {data.pomodoros > 0 && (
                <span style={{ 
                  fontSize: '10px', 
                  color: colors.primary,
                  marginTop: '4px',
                  fontWeight: 'bold',
                }}>
                  {data.pomodoros}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '8px',
        }}>
          {weekDays.map((day) => (
            <div
              key={day}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '11px',
                color: colors.textSecondary,
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
