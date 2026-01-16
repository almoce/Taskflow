import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as idb from 'idb-keyval';
import { migrateStorage } from '@/lib/migrateStorage';

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
}));

describe('migrateStorage', () => {
  const storeName = 'taskflow-storage';
  const migrationKey = 'taskflow-migration-v1';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should migrate data from LocalStorage to IndexedDB if not already migrated', async () => {
    const mockData = JSON.stringify({ state: { test: 'data' } });
    localStorage.setItem(storeName, mockData);

    (idb.get as any).mockResolvedValue(undefined); // Migration flag check returns undefined

    await migrateStorage(storeName);

    expect(idb.set).toHaveBeenCalledWith(storeName, mockData);
    expect(idb.set).toHaveBeenCalledWith(migrationKey, 'true');
    // We optionally verify that LS is cleared or kept as backup?
    // Plan doesn't specify, but safer to keep or clear?
    // Usually we clear to save space, but keeping it as backup is safer.
    // Let's assume we keep it for now or check spec.
    // Spec says "migrate existing data", implies moving.
    // Let's assume copy for now.
  });

  it('should not migrate if already migrated', async () => {
    (idb.get as any).mockResolvedValue('true'); // Migration flag exists

    await migrateStorage(storeName);

    expect(idb.set).not.toHaveBeenCalledWith(storeName, expect.any(String));
  });

  it('should do nothing if LocalStorage is empty', async () => {
    (idb.get as any).mockResolvedValue(undefined);

    await migrateStorage(storeName);

    expect(idb.set).not.toHaveBeenCalledWith(storeName, expect.any(String));
  });
});
