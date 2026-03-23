import React from 'react';
import type { Translations } from '../hooks/useLanguage';

type Tab = 'timer' | 'tasks' | 'stats' | 'settings';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  colors: Record<string, string>;
  t: Translations;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  colors,
  t,
}) => {
  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'timer', icon: '⏱️', label: t.timer },
    { id: 'tasks', icon: '✅', label: t.tasks },
    { id: 'stats', icon: '📊', label: t.stats },
    { id: 'settings', icon: '⚙️', label: t.settings },
  ];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0',
      backgroundColor: colors.surface,
      borderTop: `1px solid ${colors.border}`,
      position: 'sticky',
      bottom: 0,
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === tab.id ? colors.primary : colors.textSecondary,
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
        >
          <span style={{ fontSize: '20px' }}>{tab.icon}</span>
          <span style={{ fontSize: '11px', fontWeight: activeTab === tab.id ? 'bold' : 'normal' }}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
};
