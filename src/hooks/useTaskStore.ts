import { useState, useEffect, useCallback } from 'react';
import { AppState, Project, Task, PROJECT_COLORS } from '@/types/task';

const STORAGE_KEY = 'task-manager-data';

const defaultState: AppState = {
  projects: [],
  tasks: [],
  selectedProjectId: null,
  activeView: 'tasks',
};

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return defaultState;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function useTaskStore() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Project actions
  const addProject = useCallback((name: string, description?: string, color?: string, icon?: string) => {
    const usedColors = state.projects.map(p => p.color);
    const defaultAvailableColor = PROJECT_COLORS.find(c => !usedColors.includes(c)) || PROJECT_COLORS[0];

    const project: Project = {
      id: generateId(),
      name,
      description,
      color: color || defaultAvailableColor,
      icon,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, project],
      selectedProjectId: project.id,
    }));
    return project;
  }, [state.projects]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      tasks: prev.tasks.filter(t => t.projectId !== id),
      selectedProjectId: prev.selectedProjectId === id ? null : prev.selectedProjectId,
    }));
  }, []);

  const selectProject = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedProjectId: id, activeView: 'tasks' }));
  }, []);

  const setActiveView = useCallback((view: 'tasks' | 'analytics') => {
    setState(prev => ({
      ...prev,
      activeView: view,
      selectedProjectId: view === 'analytics' ? prev.selectedProjectId : prev.selectedProjectId
    }));
  }, []);

  // Task actions
  const addTask = useCallback((projectId: string, title: string, priority: Task['priority'] = 'medium', tag?: Task['tag']) => {
    const task: Task = {
      id: generateId(),
      projectId,
      title,
      status: 'todo',
      priority,
      tag,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));
    return task;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id !== id) return t;
        const updated = { ...t, ...updates };
        if (updates.status === 'done' && t.status !== 'done') {
          updated.completedAt = new Date().toISOString();
        }
        return updated;
      }),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  const archiveTask = useCallback((id: string) => {
    updateTask(id, { isArchived: true });
  }, [updateTask]);

  const unarchiveTask = useCallback((id: string) => {
    updateTask(id, { isArchived: false });
  }, [updateTask]);

  const checkAutoArchive = useCallback(() => {
    setState(prev => {
      const now = new Date();
      let hasChanges = false;
      const updatedTasks = prev.tasks.map(t => {
        if (!t.isArchived && t.status === 'done' && t.dueDate && new Date(t.dueDate) < now) {
          hasChanges = true;
          return { ...t, isArchived: true };
        }
        return t;
      });

      if (!hasChanges) return prev;
      return { ...prev, tasks: updatedTasks };
    });
  }, []);

  // Computed values
  const selectedProject = state.projects.find(p => p.id === state.selectedProjectId) || null;
  const projectTasks = state.tasks.filter(t => t.projectId === state.selectedProjectId && !t.isArchived);
  const archivedTasks = state.tasks.filter(t => t.isArchived);

  const getProjectProgress = useCallback((projectId: string) => {
    const tasks = state.tasks.filter(t => t.projectId === projectId);
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'done').length;
    return Math.round((completed / tasks.length) * 100);
  }, [state.tasks]);

  const getProjectTaskCounts = useCallback((projectId: string) => {
    const tasks = state.tasks.filter(t => t.projectId === projectId);
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
  }, [state.tasks]);

  const stats = {
    totalProjects: state.projects.length,
    totalTasks: state.tasks.length,
    completedToday: state.tasks.filter(t => {
      if (!t.completedAt) return false;
      const today = new Date().toDateString();
      return new Date(t.completedAt).toDateString() === today;
    }).length,
    overdue: state.tasks.filter(t => {
      if (!t.dueDate || t.status === 'done') return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };

  return {
    ...state,
    selectedProject,
    projectTasks,
    stats,
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    archiveTask,
    unarchiveTask,
    checkAutoArchive,
    getProjectProgress,
    getProjectTaskCounts,
    archivedTasks,
    setActiveView,
  };
}
