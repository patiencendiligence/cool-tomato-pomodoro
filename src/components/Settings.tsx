import React from 'react';
import type { TimerSettings, Theme, Language } from '../types';
import type { Translations } from '../hooks/useLanguage';

interface SettingsProps {
  settings: TimerSettings;
  theme: Theme;
  language: Language;
  onUpdateSettings: (settings: Partial<TimerSettings>) => void;
  onSetTheme: (theme: Theme) => void;
  onSetLanguage: (language: Language) => void;
  colors: Record<string, string>;
  t: Translations;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  theme,
  language,
  onUpdateSettings,
  onSetTheme,
  onSetLanguage,
  colors,
  t,
}) => {
  const SettingRow: React.FC<{
    label: string;
    children: React.ReactNode;
  }> = ({ label, children }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderBottom: `1px solid ${colors.border}`,
    }}>
      <span style={{ color: colors.text, fontSize: '14px' }}>{label}</span>
      {children}
    </div>
  );

  const Toggle: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
  }> = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: '48px',
        height: '26px',
        borderRadius: '13px',
        backgroundColor: checked ? colors.primary : colors.buttonBg,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s',
      }}
    >
      <div style={{
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        position: 'absolute',
        top: '2px',
        left: checked ? '24px' : '2px',
        transition: 'left 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ 
        fontSize: '18px', 
        marginBottom: '20px',
        color: colors.text,
      }}>
        ⚙️ {t.settings}
      </h2>

      <div style={{
        backgroundColor: colors.cardBg,
        borderRadius: '12px',
        padding: '0 16px',
        marginBottom: '20px',
        border: `1px solid ${colors.border}`,
      }}>
        <h3 style={{ 
          fontSize: '13px', 
          color: colors.textSecondary,
          padding: '12px 0',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          ⏱️ {t.timerSettings}
        </h3>
        
        <SettingRow label={`${t.workDuration} (${t.minutes})`}>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.workDuration}
            onChange={(e) => onUpdateSettings({ workDuration: parseInt(e.target.value) || 25 })}
            style={{
              width: '60px',
              padding: '8px',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              textAlign: 'center',
              backgroundColor: colors.surface,
              color: colors.text,
            }}
          />
        </SettingRow>
        
        <SettingRow label={`${t.shortBreakDuration} (${t.minutes})`}>
          <input
            type="number"
            min="1"
            max="30"
            value={settings.shortBreakDuration}
            onChange={(e) => onUpdateSettings({ shortBreakDuration: parseInt(e.target.value) || 5 })}
            style={{
              width: '60px',
              padding: '8px',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              textAlign: 'center',
              backgroundColor: colors.surface,
              color: colors.text,
            }}
          />
        </SettingRow>
        
        <SettingRow label={`${t.longBreakDuration} (${t.minutes})`}>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.longBreakDuration}
            onChange={(e) => onUpdateSettings({ longBreakDuration: parseInt(e.target.value) || 20 })}
            style={{
              width: '60px',
              padding: '8px',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              textAlign: 'center',
              backgroundColor: colors.surface,
              color: colors.text,
            }}
          />
        </SettingRow>
        
        <SettingRow label={t.longBreakInterval}>
          <input
            type="number"
            min="2"
            max="10"
            value={settings.longBreakInterval}
            onChange={(e) => onUpdateSettings({ longBreakInterval: parseInt(e.target.value) || 4 })}
            style={{
              width: '60px',
              padding: '8px',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              textAlign: 'center',
              backgroundColor: colors.surface,
              color: colors.text,
            }}
          />
        </SettingRow>
        
        <SettingRow label={t.autoStartBreaks}>
          <Toggle
            checked={settings.autoStartBreaks}
            onChange={(checked) => onUpdateSettings({ autoStartBreaks: checked })}
          />
        </SettingRow>
        
        <SettingRow label={t.autoStartPomodoros}>
          <Toggle
            checked={settings.autoStartPomodoros}
            onChange={(checked) => onUpdateSettings({ autoStartPomodoros: checked })}
          />
        </SettingRow>
      </div>

      <div style={{
        backgroundColor: colors.cardBg,
        borderRadius: '12px',
        padding: '0 16px',
        marginBottom: '20px',
        border: `1px solid ${colors.border}`,
      }}>
        <h3 style={{ 
          fontSize: '13px', 
          color: colors.textSecondary,
          padding: '12px 0',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          🔔 {t.notifications}
        </h3>
        
        <SettingRow label={t.notificationEnabled}>
          <Toggle
            checked={settings.notificationEnabled}
            onChange={(checked) => onUpdateSettings({ notificationEnabled: checked })}
          />
        </SettingRow>
        
        <SettingRow label={t.soundEnabled}>
          <Toggle
            checked={settings.soundEnabled}
            onChange={(checked) => onUpdateSettings({ soundEnabled: checked })}
          />
        </SettingRow>
      </div>

      <div style={{
        backgroundColor: colors.cardBg,
        borderRadius: '12px',
        padding: '0 16px',
        border: `1px solid ${colors.border}`,
      }}>
        <h3 style={{ 
          fontSize: '13px', 
          color: colors.textSecondary,
          padding: '12px 0',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          🎨 {t.theme} & {t.language}
        </h3>
        
        <SettingRow label={t.theme}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['light', 'dark', 'tomato'] as Theme[]).map((th) => (
              <button
                key={th}
                onClick={() => onSetTheme(th)}
                style={{
                  padding: '6px 12px',
                  border: theme === th ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: th === 'light' ? '#f5f5f5' : th === 'dark' ? '#1a1a2e' : '#ff6347',
                  color: th === 'light' ? '#333' : '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {th === 'light' ? t.lightTheme : th === 'dark' ? t.darkTheme : t.tomatoTheme}
              </button>
            ))}
          </div>
        </SettingRow>
        
        <SettingRow label={t.language}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['ko', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onSetLanguage(lang)}
                style={{
                  padding: '6px 12px',
                  border: language === lang ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: language === lang ? colors.primary : colors.buttonBg,
                  color: language === lang ? '#fff' : colors.text,
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {lang === 'ko' ? '한국어' : 'English'}
              </button>
            ))}
          </div>
        </SettingRow>
      </div>
    </div>
  );
};
