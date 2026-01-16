import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as idb from 'idb-keyval';
import { migrateArchivedTasks } from '@/lib/migrateTasks';
import { useStore } from '@/store/useStore';

// Mock idb-keyval
vi.mock('idb-keyval', () => {
  const store = new Map();
  return {
    get: vi.fn((key) => Promise.resolve(store.get(key))),
    set: vi.fn((key, val) => Promise.resolve(store.set(key, val))),
  };
});

describe('migrateArchivedTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStore.setState({ tasks: [], archivedTasks: [], pendingDeleteTaskIds: [] });
  });

  it('should move archived tasks from tasks to archivedTasks slice', async () => {
    const mockActiveTask = { id: 't1', isArchived: false, title: 'Active' };
    const mockArchivedTask = { id: 't2', isArchived: true, title: 'Archived' };
    
    useStore.setState({ 
      tasks: [mockActiveTask, mockArchivedTask] as any,
      archivedTasks: []
    });

    (idb.get as any).mockResolvedValue(undefined); // Not migrated yet

    await migrateArchivedTasks();

    const state = useStore.getState();
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].id).toBe('t1');
    expect(state.archivedTasks).toHaveLength(1);
    expect(state.archivedTasks[0].id).toBe('t2');
    expect(state.pendingDeleteTaskIds).toContain('t2');
  });

  it('should not run if already migrated', async () => {
    (idb.get as any).mockResolvedValue('true');

    await migrateArchivedTasks();

    expect(useStore.getState().tasks).toEqual([]);
  });
});
