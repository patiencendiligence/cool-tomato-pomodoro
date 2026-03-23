import React, { useState } from 'react';
import type { Task } from '../types';
import type { Translations } from '../hooks/useLanguage';

interface TaskListProps {
  tasks: Task[];
  currentTaskId: string | null;
  onSelectTask: (id: string | null) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'pomodorosCompleted' | 'completed'>) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  colors: Record<string, string>;
  t: Translations;
}

type Priority = 'low' | 'medium' | 'high';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  currentTaskId,
  onSelectTask,
  onAddTask,
  onDeleteTask,
  onCompleteTask,
  colors,
  t,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    pomodorosEstimated: number;
    priority: Priority;
    projectId: string | null;
    dueDate: string | null;
  }>({
    title: '',
    description: '',
    pomodorosEstimated: 1,
    priority: 'medium',
    projectId: null,
    dueDate: null,
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    onAddTask(newTask);
    setNewTask({
      title: '',
      description: '',
      pomodorosEstimated: 1,
      priority: 'medium',
      projectId: null,
      dueDate: null,
    });
    setShowAddForm(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['active', 'completed', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '16px',
                backgroundColor: filter === f ? colors.primary : colors.buttonBg,
                color: filter === f 
                  ? (colors.primary === '#ffffff' ? '#e74c3c' : '#fff')
                  : colors.text,
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: filter === f ? '600' : '400',
              }}
            >
              {f === 'active' ? t.inProgress : f === 'completed' ? t.completed : t.allTasks}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: colors.primary,
            color: colors.primary === '#ffffff' ? '#e74c3c' : '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          + {t.addTask}
        </button>
      </div>

      {showAddForm && (
        <div style={{
          backgroundColor: colors.cardBg,
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '16px',
          border: `1px solid ${colors.border}`,
        }}>
          <input
            type="text"
            placeholder={t.taskTitle}
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '14px',
              backgroundColor: colors.surface,
              color: colors.text,
            }}
          />
          <textarea
            placeholder={t.taskDescription}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '14px',
              minHeight: '60px',
              resize: 'none',
              backgroundColor: colors.surface,
              color: colors.text,
            }}
          />
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '12px', color: colors.textSecondary, display: 'block', marginBottom: '4px' }}>
                🍅 {t.estimatedPomodoros}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newTask.pomodorosEstimated}
                onChange={(e) => setNewTask({ ...newTask, pomodorosEstimated: parseInt(e.target.value) || 1 })}
                style={{
                  width: '60px',
                  padding: '8px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: colors.textSecondary, display: 'block', marginBottom: '4px' }}>
                {t.priority}
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                style={{
                  padding: '8px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              >
                <option value="low">{t.low}</option>
                <option value="medium">{t.medium}</option>
                <option value="high">{t.high}</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: colors.buttonBg,
                color: colors.text,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {t.cancel}
            </button>
            <button
              onClick={handleAddTask}
              style={{
                padding: '8px 16px',
                backgroundColor: colors.primary,
                color: colors.primary === '#ffffff' ? '#e74c3c' : '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {t.save}
            </button>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: colors.textSecondary,
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <p>{t.noTasks}</p>
          <p style={{ fontSize: '13px' }}>{t.addFirstTask}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => !task.completed && onSelectTask(task.id === currentTaskId ? null : task.id)}
              style={{
                backgroundColor: task.id === currentTaskId ? colors.primary + '15' : colors.cardBg,
                padding: '14px',
                borderRadius: '10px',
                border: task.id === currentTaskId 
                  ? `2px solid ${colors.primary}` 
                  : `1px solid ${colors.border}`,
                cursor: task.completed ? 'default' : 'pointer',
                opacity: task.completed ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!task.completed) onCompleteTask(task.id);
                  }}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${task.completed ? colors.success : getPriorityColor(task.priority)}`,
                    backgroundColor: task.completed ? colors.success : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12px',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {task.completed && '✓'}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '500',
                    color: colors.text,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    marginBottom: '4px',
                  }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{
                      fontSize: '12px',
                      color: colors.textSecondary,
                      marginBottom: '6px',
                    }}>
                      {task.description}
                    </div>
                  )}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    fontSize: '12px',
                    color: colors.textSecondary,
                  }}>
                    <span>🍅 {task.pomodorosCompleted}/{task.pomodorosEstimated}</span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      backgroundColor: getPriorityColor(task.priority) + '20',
                      color: getPriorityColor(task.priority),
                      fontSize: '11px',
                    }}>
                      {task.priority === 'high' ? t.high : task.priority === 'medium' ? t.medium : t.low}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this task?')) {
                      onDeleteTask(task.id);
                    }
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'transparent',
                    color: colors.textSecondary,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
