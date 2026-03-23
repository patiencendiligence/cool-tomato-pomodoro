// Pomodoro Timer Widget - Content Script
(function() {
  'use strict';

  // State
  let isVisible = false;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let position = { x: window.innerWidth - 420, y: 20 };
  let isRunning = false;
  let isPaused = false;
  let mode = 'work';
  let timeLeft = 25 * 60;
  let timerId = null;
  let isExpanded = false;
  let activeTab = 'timer';
  let pomodorosCompleted = 0;
  let isHovered = false;

  // Tasks
  let tasks = [];
  let currentTaskId = null;
  let taskFilter = 'active';
  let showAddForm = false;

  // Settings
  let settings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 20,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    notificationEnabled: true,
    soundEnabled: true,
    theme: 'light',
    language: 'ko',
  };

  const TIMES = {
    work: () => settings.workDuration * 60,
    shortBreak: () => settings.shortBreakDuration * 60,
    longBreak: () => settings.longBreakDuration * 60,
  };

  // Translations
  const translations = {
    ko: {
      work: '집중',
      shortBreak: '짧은 휴식',
      longBreak: '긴 휴식',
      tasks: '업무',
      stats: '통계',
      settings: '설정',
      addTask: '추가',
      save: '저장',
      cancel: '취소',
      noTasks: '등록된 업무가 없습니다',
      taskTitle: '업무 제목',
      inProgress: '진행중',
      completed: '완료',
      allTasks: '전체',
      high: '높음',
      medium: '보통',
      low: '낮음',
      todayStats: '오늘 통계',
      weeklyStats: '주간 통계',
      totalPomodoros: '총 포모도로',
      totalFocusTime: '총 집중 시간',
      tasksCompleted: '완료 업무',
      timerSettings: '타이머 설정',
      workDuration: '집중 시간',
      shortBreakDuration: '짧은 휴식',
      longBreakDuration: '긴 휴식',
      longBreakInterval: '긴 휴식 간격',
      minutes: '분',
      notifications: '알림',
      notificationEnabled: '알림 활성화',
      soundEnabled: '소리 활성화',
      autoStartBreaks: '자동 휴식 시작',
      autoStartPomodoros: '자동 집중 시작',
      theme: '테마',
      language: '언어',
      light: '라이트',
      dark: '다크',
      tomato: '토마토',
    },
    en: {
      work: 'Focus',
      shortBreak: 'Short Break',
      longBreak: 'Long Break',
      tasks: 'Tasks',
      stats: 'Stats',
      settings: 'Settings',
      addTask: 'Add',
      save: 'Save',
      cancel: 'Cancel',
      noTasks: 'No tasks yet',
      taskTitle: 'Task title',
      inProgress: 'Active',
      completed: 'Done',
      allTasks: 'All',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      todayStats: 'Today',
      weeklyStats: 'Weekly',
      totalPomodoros: 'Pomodoros',
      totalFocusTime: 'Focus Time',
      tasksCompleted: 'Tasks Done',
      timerSettings: 'Timer',
      workDuration: 'Work',
      shortBreakDuration: 'Short Break',
      longBreakDuration: 'Long Break',
      longBreakInterval: 'Long Break After',
      minutes: 'min',
      notifications: 'Notifications',
      notificationEnabled: 'Notifications',
      soundEnabled: 'Sound',
      autoStartBreaks: 'Auto-start Breaks',
      autoStartPomodoros: 'Auto-start Work',
      theme: 'Theme',
      language: 'Language',
      light: 'Light',
      dark: 'Dark',
      tomato: 'Tomato',
    }
  };

  function t(key) {
    return translations[settings.language]?.[key] || translations.ko[key] || key;
  }

  function getResourceUrl(path) {
    return chrome.runtime.getURL(path);
  }

  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'pomodoro-widget';
    widget.innerHTML = getWidgetHTML();
    document.body.appendChild(widget);
    
    setupEventListeners();
    updatePosition();
    render();
  }

  function getWidgetHTML() {
    return `
      <div class="pomodoro-container ${isExpanded ? 'expanded' : 'compact'}" id="pomodoro-container">
        <div class="pomodoro-main">
          <div class="pomodoro-content" id="pomodoro-content"></div>
        </div>
        <div class="pomodoro-nav" id="pomodoro-nav">
          <button class="nav-btn active" data-tab="timer">⏱️</button>
          <button class="nav-btn" data-tab="tasks">✅</button>
          <button class="nav-btn" data-tab="stats">📊</button>
          <button class="nav-btn" data-tab="settings">⚙️</button>
        </div>
      </div>
    `;
  }

  function render() {
    const content = document.getElementById('pomodoro-content');
    const container = document.getElementById('pomodoro-container');
    if (!content) return;

    // Update container class for compact/expanded mode
    if (container) {
      container.className = `pomodoro-container ${isExpanded ? 'expanded' : 'compact'} theme-${settings.theme}`;
    }

    if (activeTab === 'timer') {
      content.innerHTML = isExpanded ? getExpandedTimerHTML() : getCompactTimerHTML();
      content.className = 'pomodoro-content';
    } else if (activeTab === 'tasks') {
      content.innerHTML = isExpanded ? getExpandedTasksHTML() : getCompactTasksHTML();
      content.className = 'pomodoro-content scrollable';
    } else if (activeTab === 'stats') {
      content.innerHTML = isExpanded ? getExpandedStatsHTML() : getCompactStatsHTML();
      content.className = 'pomodoro-content scrollable';
    } else if (activeTab === 'settings') {
      content.innerHTML = isExpanded ? getExpandedSettingsHTML() : getCompactSettingsHTML();
      content.className = 'pomodoro-content scrollable';
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === activeTab);
    });

    setupTabListeners();
  }

  function setupTabListeners() {
    if (activeTab === 'timer') {
      setupTimerListeners();
    } else if (activeTab === 'tasks') {
      setupTaskListeners();
    } else if (activeTab === 'settings') {
      setupSettingsListeners();
    }
  }

  function getTomatoImage() {
    if (!isRunning) return getResourceUrl('tomato-mascot.png');
    const totalTime = TIMES[mode]();
    const progress = 1 - (timeLeft / totalTime);
    if (progress < 0.25) return getResourceUrl('tomato-stage1.png');
    if (progress < 0.5) return getResourceUrl('tomato-stage2.png');
    if (progress < 0.75) return getResourceUrl('tomato-stage3.png');
    return getResourceUrl('tomato-mascot.png');
  }

  function getModeEmoji() {
    if (mode === 'work') return '🍅';
    if (mode === 'shortBreak') return '☕';
    return '🌴';
  }

  function getModeLabel() {
    return t(mode);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}시간 ${minutes}분`;
    return `${minutes}분`;
  }

  // Timer HTML
  function getCompactTimerHTML() {
    const modeColorClass = mode === 'work' ? 'mode-work' : 'mode-break';
    
    if (!isRunning) {
      return `
        <div class="timer-compact paused">
          <div class="tomato-wrapper">
            <img src="${getTomatoImage()}" class="tomato-img bounce" alt="Tomato">
            <button class="play-btn-small" id="btn-start">▶</button>
          </div>
          <div class="mode-pills hover-show">
            <button class="expand-btn" id="btn-expand">⤢</button>
            <button class="mode-pill ${mode === 'work' ? 'active' : ''}" data-mode="work">🍅</button>
            <button class="mode-pill ${mode === 'shortBreak' ? 'active' : ''}" data-mode="shortBreak">☕</button>
            <button class="mode-pill ${mode === 'longBreak' ? 'active' : ''}" data-mode="longBreak">🌴</button>
          </div>
        </div>
      `;
    } else {
      const progress = ((TIMES[mode]() - timeLeft) / TIMES[mode]()) * 100;
      return `
        <div class="timer-compact running">
          <div class="timer-wrapper">
            <div class="timer-card ${modeColorClass}" id="timer-card">
              <div class="status-badge ${modeColorClass}">
                <span>${getModeEmoji()}</span>
                <span>${getModeLabel()}</span>
              </div>
              <div class="timer-display">${formatTime(timeLeft)}</div>
              <div class="progress-bar">
                <div class="progress-fill ${modeColorClass}" style="width: ${progress}%"></div>
              </div>
              <div class="hover-controls" id="hover-controls">
                <button class="control-btn pause" id="btn-pause">⏸</button>
                <button class="control-btn skip" id="btn-skip">⏭</button>
              </div>
            </div>
            <div class="hover-mode-row" id="hover-mode-row">
              <button class="mode-pill-small ${mode === 'work' ? 'active' : ''}" data-mode="work">🍅</button>
              <button class="mode-pill-small ${mode === 'shortBreak' ? 'active' : ''}" data-mode="shortBreak">☕</button>
              <button class="mode-pill-small ${mode === 'longBreak' ? 'active' : ''}" data-mode="longBreak">🌴</button>
            </div>
          </div>
          <div class="expand-only">
            <button class="expand-btn" id="btn-expand">⤢</button>
          </div>
        </div>
      `;
    }
  }

  function getExpandedTimerHTML() {
    const modeColorClass = mode === 'work' ? 'mode-work' : 'mode-break';
    
    if (!isRunning) {
      return `
        <div class="timer-expanded">
          <div class="expanded-header">
            <button class="close-btn" id="btn-collapse">✕</button>
            <div class="mode-selector">
              <button class="mode-btn ${mode === 'work' ? 'active' : ''}" data-mode="work">🍅</button>
              <button class="mode-btn ${mode === 'shortBreak' ? 'active' : ''}" data-mode="shortBreak">☕</button>
              <button class="mode-btn ${mode === 'longBreak' ? 'active' : ''}" data-mode="longBreak">🌴</button>
            </div>
          </div>
          <div class="expanded-content">
            <img src="${getResourceUrl('tomato-mascot.png')}" class="tomato-large bounce" alt="Tomato">
            <div class="status-badge-large ${modeColorClass}">
              ${getModeEmoji()} ${getModeLabel()}
            </div>
          </div>
          <div class="expanded-footer">
            <button class="play-btn-large" id="btn-start">▶</button>
          </div>
        </div>
      `;
    } else {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      return `
        <div class="timer-expanded">
          <div class="expanded-header">
            <button class="close-btn" id="btn-collapse">✕</button>
            <div class="mode-selector">
              <button class="mode-btn ${mode === 'work' ? 'active' : ''}" data-mode="work">🍅</button>
              <button class="mode-btn ${mode === 'shortBreak' ? 'active' : ''}" data-mode="shortBreak">☕</button>
              <button class="mode-btn ${mode === 'longBreak' ? 'active' : ''}" data-mode="longBreak">🌴</button>
            </div>
          </div>
          <div class="expanded-content time-display">
            <span class="big-time">${String(m).padStart(2, '0')}</span>
            <span class="big-time">${String(s).padStart(2, '0')}</span>
            <div class="pomodoro-count">🔄 ${pomodorosCompleted % settings.longBreakInterval + 1}/${settings.longBreakInterval} • 🍅 ${pomodorosCompleted}</div>
          </div>
          <div class="expanded-footer">
            <button class="control-btn-large pause" id="btn-pause">⏸</button>
            <button class="control-btn-large skip" id="btn-skip">⏭</button>
          </div>
        </div>
      `;
    }
  }

  // Tasks HTML
  function getTasksHTML() {
    const filteredTasks = tasks.filter(task => {
      if (taskFilter === 'active') return !task.completed;
      if (taskFilter === 'completed') return task.completed;
      return true;
    });

    const addFormHTML = showAddForm ? `
      <div class="add-task-form">
        <input type="text" id="new-task-title" placeholder="${t('taskTitle')}" class="task-input">
        <div class="form-row">
          <label>🍅</label>
          <input type="number" id="new-task-pomos" value="1" min="1" max="10" class="pomo-input">
          <select id="new-task-priority" class="priority-select">
            <option value="low">${t('low')}</option>
            <option value="medium" selected>${t('medium')}</option>
            <option value="high">${t('high')}</option>
          </select>
        </div>
        <div class="form-actions">
          <button class="btn-cancel" id="btn-cancel-task">${t('cancel')}</button>
          <button class="btn-save" id="btn-save-task">${t('save')}</button>
        </div>
      </div>
    ` : '';

    const tasksListHTML = filteredTasks.length === 0 
      ? `<div class="empty-state">📝<br>${t('noTasks')}</div>`
      : filteredTasks.map(task => `
        <div class="task-item ${task.id === currentTaskId ? 'selected' : ''} ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
          <button class="task-check ${task.completed ? 'checked' : ''} priority-${task.priority}" data-complete-id="${task.id}">
            ${task.completed ? '✓' : ''}
          </button>
          <div class="task-info">
            <div class="task-title">${task.title}</div>
            <div class="task-meta">
              🍅 ${task.pomodorosCompleted}/${task.pomodorosEstimated}
              <span class="priority-badge priority-${task.priority}">${task.priority === 'high' ? t('high') : task.priority === 'medium' ? t('medium') : t('low')}</span>
            </div>
          </div>
          <button class="task-delete" data-delete-id="${task.id}">🗑</button>
        </div>
      `).join('');

    return `
      <div class="panel tasks-panel">
        <div class="panel-header">
          <div class="filter-btns">
            <button class="filter-btn ${taskFilter === 'active' ? 'active' : ''}" data-filter="active">${t('inProgress')}</button>
            <button class="filter-btn ${taskFilter === 'completed' ? 'active' : ''}" data-filter="completed">${t('completed')}</button>
            <button class="filter-btn ${taskFilter === 'all' ? 'active' : ''}" data-filter="all">${t('allTasks')}</button>
          </div>
          <button class="btn-add-task" id="btn-show-add">+ ${t('addTask')}</button>
        </div>
        ${addFormHTML}
        <div class="tasks-list">
          ${tasksListHTML}
        </div>
      </div>
    `;
  }
  
  function getCompactTasksHTML() { return getTasksHTML(); }
  function getExpandedTasksHTML() { return getTasksHTML(); }

  // Stats HTML
  function getStatsHTML() {
    const todayPomodoros = pomodorosCompleted;
    const todayFocusTime = pomodorosCompleted * settings.workDuration * 60;
    const completedTasksCount = tasks.filter(tk => tk.completed).length;

    return `
      <div class="panel stats-panel">
        <h3>📊 ${t('todayStats')}</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🍅</div>
            <div class="stat-value">${todayPomodoros}</div>
            <div class="stat-label">${t('totalPomodoros')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-value">${formatDuration(todayFocusTime)}</div>
            <div class="stat-label">${t('totalFocusTime')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-value">${completedTasksCount}</div>
            <div class="stat-label">${t('tasksCompleted')}</div>
          </div>
        </div>
      </div>
    `;
  }

  function getCompactStatsHTML() { return getStatsHTML(); }
  function getExpandedStatsHTML() { return getStatsHTML(); }

  // Settings HTML
  function getSettingsHTML() {
    return `
      <div class="panel settings-panel">
        <h3>⏱️ ${t('timerSettings')}</h3>
        <div class="settings-group">
          <div class="setting-row">
            <span>${t('workDuration')} (${t('minutes')})</span>
            <input type="number" id="setting-work" value="${settings.workDuration}" min="1" max="60" class="setting-input">
          </div>
          <div class="setting-row">
            <span>${t('shortBreakDuration')} (${t('minutes')})</span>
            <input type="number" id="setting-short" value="${settings.shortBreakDuration}" min="1" max="30" class="setting-input">
          </div>
          <div class="setting-row">
            <span>${t('longBreakDuration')} (${t('minutes')})</span>
            <input type="number" id="setting-long" value="${settings.longBreakDuration}" min="1" max="60" class="setting-input">
          </div>
          <div class="setting-row">
            <span>${t('longBreakInterval')}</span>
            <input type="number" id="setting-interval" value="${settings.longBreakInterval}" min="2" max="10" class="setting-input">
          </div>
        </div>
        <h3>🔔 ${t('notifications')}</h3>
        <div class="settings-group">
          <div class="setting-row">
            <span>${t('autoStartBreaks')}</span>
            <button class="toggle-btn ${settings.autoStartBreaks ? 'on' : ''}" id="toggle-auto-breaks">
              <div class="toggle-knob"></div>
            </button>
          </div>
          <div class="setting-row">
            <span>${t('autoStartPomodoros')}</span>
            <button class="toggle-btn ${settings.autoStartPomodoros ? 'on' : ''}" id="toggle-auto-pomos">
              <div class="toggle-knob"></div>
            </button>
          </div>
        </div>
        <h3>🎨 ${t('theme')} & ${t('language')}</h3>
        <div class="settings-group">
          <div class="setting-row">
            <span>${t('theme')}</span>
            <div class="theme-btns">
              <button class="theme-btn ${settings.theme === 'light' ? 'active' : ''}" data-theme="light" style="background:#f5f5f5;color:#333">${t('light')}</button>
              <button class="theme-btn ${settings.theme === 'tomato' ? 'active' : ''}" data-theme="tomato" style="background:#e74c3c;color:#fff">${t('tomato')}</button>
              <button class="theme-btn ${settings.theme === 'dark' ? 'active' : ''}" data-theme="dark" style="background:#1a1a2e;color:#fff">${t('dark')}</button>
            </div>
          </div>
          <div class="setting-row">
            <span>${t('language')}</span>
            <div class="lang-btns">
              <button class="lang-btn ${settings.language === 'ko' ? 'active' : ''}" data-lang="ko">한국어</button>
              <button class="lang-btn ${settings.language === 'en' ? 'active' : ''}" data-lang="en">English</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getCompactSettingsHTML() { return getSettingsHTML(); }
  function getExpandedSettingsHTML() { return getSettingsHTML(); }

  // Event Listeners Setup
  function setupEventListeners() {
    const widget = document.getElementById('pomodoro-widget');
    if (!widget) return;

    widget.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('.pomodoro-nav')) return;
      isDragging = true;
      dragOffset.x = e.clientX - position.x;
      dragOffset.y = e.clientY - position.y;
      widget.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      position.x = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x));
      position.y = Math.max(0, Math.min(window.innerHeight - 150, e.clientY - dragOffset.y));
      updatePosition();
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      const widget = document.getElementById('pomodoro-widget');
      if (widget) widget.style.cursor = 'grab';
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        render();
      });
    });

    widget.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    widget.addEventListener('mouseleave', () => {
      isHovered = false;
    });
  }

  function setupTimerListeners() {
    const startBtn = document.getElementById('btn-start');
    if (startBtn) startBtn.addEventListener('click', startTimer);

    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);

    const skipBtn = document.getElementById('btn-skip');
    if (skipBtn) skipBtn.addEventListener('click', skipTimer);

    const expandBtn = document.getElementById('btn-expand');
    if (expandBtn) expandBtn.addEventListener('click', () => { isExpanded = true; render(); });

    const collapseBtn = document.getElementById('btn-collapse');
    if (collapseBtn) collapseBtn.addEventListener('click', () => { isExpanded = false; render(); });

    document.querySelectorAll('.mode-pill, .mode-btn, .mode-pill-small').forEach(btn => {
      btn.addEventListener('click', () => changeMode(btn.dataset.mode));
    });
  }

  function setupTaskListeners() {
    const showAddBtn = document.getElementById('btn-show-add');
    if (showAddBtn) showAddBtn.addEventListener('click', () => { showAddForm = true; render(); });

    const cancelBtn = document.getElementById('btn-cancel-task');
    if (cancelBtn) cancelBtn.addEventListener('click', () => { showAddForm = false; render(); });

    const saveBtn = document.getElementById('btn-save-task');
    if (saveBtn) saveBtn.addEventListener('click', addTask);

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => { taskFilter = btn.dataset.filter; render(); });
    });

    document.querySelectorAll('.task-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const taskId = item.dataset.taskId;
        currentTaskId = currentTaskId === taskId ? null : taskId;
        render();
      });
    });

    document.querySelectorAll('.task-check').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        completeTask(btn.dataset.completeId);
      });
    });

    document.querySelectorAll('.task-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(btn.dataset.deleteId);
      });
    });
  }

  function setupSettingsListeners() {
    const workInput = document.getElementById('setting-work');
    if (workInput) {
      workInput.addEventListener('change', () => {
        settings.workDuration = parseInt(workInput.value) || 25;
        if (!isRunning && mode === 'work') timeLeft = TIMES.work();
        saveSettings();
      });
    }

    const shortInput = document.getElementById('setting-short');
    if (shortInput) {
      shortInput.addEventListener('change', () => {
        settings.shortBreakDuration = parseInt(shortInput.value) || 5;
        if (!isRunning && mode === 'shortBreak') timeLeft = TIMES.shortBreak();
        saveSettings();
      });
    }

    const longInput = document.getElementById('setting-long');
    if (longInput) {
      longInput.addEventListener('change', () => {
        settings.longBreakDuration = parseInt(longInput.value) || 20;
        if (!isRunning && mode === 'longBreak') timeLeft = TIMES.longBreak();
        saveSettings();
      });
    }

    const intervalInput = document.getElementById('setting-interval');
    if (intervalInput) {
      intervalInput.addEventListener('change', () => {
        settings.longBreakInterval = parseInt(intervalInput.value) || 4;
        saveSettings();
      });
    }

    const autoBreaksToggle = document.getElementById('toggle-auto-breaks');
    if (autoBreaksToggle) {
      autoBreaksToggle.addEventListener('click', () => {
        settings.autoStartBreaks = !settings.autoStartBreaks;
        saveSettings();
        render();
      });
    }

    const autoPomosToggle = document.getElementById('toggle-auto-pomos');
    if (autoPomosToggle) {
      autoPomosToggle.addEventListener('click', () => {
        settings.autoStartPomodoros = !settings.autoStartPomodoros;
        saveSettings();
        render();
      });
    }

    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        settings.theme = btn.dataset.theme;
        saveSettings();
        render();
      });
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        settings.language = btn.dataset.lang;
        saveSettings();
        render();
      });
    });
  }

  // Timer Functions
  function startTimer() {
    isRunning = true;
    isPaused = false;
    if (timeLeft === 0) timeLeft = TIMES[mode]();
    
    timerId = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) completeTimer();
      render();
    }, 1000);
    
    render();
  }

  function pauseTimer() {
    isRunning = false;
    isPaused = true;
    if (timerId) { clearInterval(timerId); timerId = null; }
    render();
  }

  function skipTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
    
    if (mode === 'work') {
      pomodorosCompleted++;
      if (currentTaskId) {
        const task = tasks.find(t => t.id === currentTaskId);
        if (task) task.pomodorosCompleted++;
      }
      mode = pomodorosCompleted % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
    } else {
      mode = 'work';
    }
    
    timeLeft = TIMES[mode]();
    isRunning = false;
    isPaused = false;
    saveData();
    render();
  }

  function completeTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }

    if (mode === 'work') {
      pomodorosCompleted++;
      if (currentTaskId) {
        const task = tasks.find(t => t.id === currentTaskId);
        if (task) task.pomodorosCompleted++;
      }
      mode = pomodorosCompleted % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
    } else {
      mode = 'work';
    }

    timeLeft = TIMES[mode]();
    isRunning = false;
    saveData();
    render();

    if (settings.notificationEnabled && Notification.permission === 'granted') {
      new Notification('🍅 멋쟁이 토마토', {
        body: mode === 'work' ? '휴식 끝! 집중 시간이에요!' : '수고했어요! 잠시 쉬어가세요.',
        icon: getResourceUrl('tomato-mascot.png')
      });
    }

    if ((mode !== 'work' && settings.autoStartBreaks) || (mode === 'work' && settings.autoStartPomodoros)) {
      setTimeout(startTimer, 1000);
    }
  }

  function changeMode(newMode) {
    if (isRunning) pauseTimer();
    mode = newMode;
    timeLeft = TIMES[mode]();
    render();
  }

  // Task Functions
  function addTask() {
    const titleInput = document.getElementById('new-task-title');
    const pomosInput = document.getElementById('new-task-pomos');
    const prioritySelect = document.getElementById('new-task-priority');
    
    if (!titleInput || !titleInput.value.trim()) return;

    tasks.push({
      id: Date.now().toString(),
      title: titleInput.value.trim(),
      pomodorosEstimated: parseInt(pomosInput?.value) || 1,
      pomodorosCompleted: 0,
      priority: prioritySelect?.value || 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
    });

    showAddForm = false;
    saveData();
    render();
  }

  function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      saveData();
      render();
    }
  }

  function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    if (currentTaskId === taskId) currentTaskId = null;
    saveData();
    render();
  }

  // Persistence
  function saveData() {
    chrome.storage.local.set({ 
      position, 
      pomodorosCompleted, 
      tasks,
      currentTaskId,
      settings,
    });
  }

  function saveSettings() {
    chrome.storage.local.set({ settings });
  }

  function updatePosition() {
    const widget = document.getElementById('pomodoro-widget');
    if (widget) {
      widget.style.left = position.x + 'px';
      widget.style.top = position.y + 'px';
    }
  }

  function toggleWidget() {
    isVisible = !isVisible;
    const widget = document.getElementById('pomodoro-widget');
    if (widget) widget.style.display = isVisible ? 'block' : 'none';
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggleWidget') toggleWidget();
  });

  function init() {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    chrome.storage.local.get(['position', 'pomodorosCompleted', 'tasks', 'currentTaskId', 'settings'], (data) => {
      if (data.position) position = data.position;
      if (data.pomodorosCompleted) pomodorosCompleted = data.pomodorosCompleted;
      if (data.tasks) tasks = data.tasks;
      if (data.currentTaskId) currentTaskId = data.currentTaskId;
      if (data.settings) settings = { ...settings, ...data.settings };
      timeLeft = TIMES[mode]();
      createWidget();
    });

    window.addEventListener('beforeunload', saveData);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
