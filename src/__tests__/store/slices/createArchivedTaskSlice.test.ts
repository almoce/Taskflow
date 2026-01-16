import { describe, it, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { createArchivedTaskSlice } from '@/store/slices/createArchivedTaskSlice';
import type { StoreState } from '@/store/types';
import type { Task } from '@/types/task';

// Create a mock store for testing the slice in isolation
const useMockStore = create<StoreState>((set, get, api) => ({
  ...createArchivedTaskSlice(set, get, api),
  // Add enough of StoreState to satisfy types if needed, 
  // but we only care about archivedTask fields here.
} as StoreState));

describe('createArchivedTaskSlice', () => {
  beforeEach(() => {
    // Reset state manually if needed, but since we create a new store or reset it:
    useMockStore.setState({ archivedTasks: [] });
  });

  const mockTask: Task = {
    id: 't1',
    projectId: 'p1',
    title: 'Archived Task',
    status: 'done',
    priority: 'medium',
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: true,
  };

  it('should start with empty archivedTasks', () => {
    expect(useMockStore.getState().archivedTasks).toEqual([]);
  });

  it('should upsert an archived task', () => {
    useMockStore.getState().upsertArchivedTask(mockTask);
    expect(useMockStore.getState().archivedTasks).toHaveLength(1);
    expect(useMockStore.getState().archivedTasks[0]).toEqual(mockTask);
  });

  it('should update an existing archived task on upsert', () => {
    useMockStore.getState().upsertArchivedTask(mockTask);
    const updates = { ...mockTask, title: 'Updated Title' };
    useMockStore.getState().upsertArchivedTask(updates);
    
    expect(useMockStore.getState().archivedTasks).toHaveLength(1);
    expect(useMockStore.getState().archivedTasks[0].title).toBe('Updated Title');
  });

  it('should delete an archived task', () => {
    useMockStore.getState().upsertArchivedTask(mockTask);
    useMockStore.getState().deleteArchivedTask(mockTask.id);
    expect(useMockStore.getState().archivedTasks).toEqual([]);
  });
});
