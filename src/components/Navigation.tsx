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
      justifyContent: 'center',
      padding: '12px 20px 20px',
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '420px',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        borderRadius: '28px',
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.08),
          0 2px 8px rgba(0, 0, 0, 0.04),
          inset 0 1px 1px rgba(255, 255, 255, 0.8)
        `,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: activeTab === tab.id ? '10px 18px' : '10px 14px',
              border: 'none',
              borderRadius: '20px',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)'
                : 'transparent',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ 
              fontSize: '18px',
              filter: activeTab === tab.id ? 'none' : 'grayscale(30%)',
              opacity: activeTab === tab.id ? 1 : 0.7,
            }}>
              {tab.icon}
            </span>
            {activeTab === tab.id && (
              <span style={{ 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#1a1a1a',
                letterSpacing: '0.2px',
              }}>
                {tab.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
