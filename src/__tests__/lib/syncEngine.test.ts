import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncProjects } from '@/lib/syncEngine';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      upsert: vi.fn(),
    })),
  },
}));

// Mock useStore
vi.mock('@/store/useStore', () => ({
  useStore: {
    getState: vi.fn(),
  },
}));

describe('Sync Engine - syncProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should download newer remote projects', async () => {
    const mockSession = { user: { id: 'user1' } };
    const mockUpsertProject = vi.fn();
    const mockLocalProjects = [
      { id: 'p1', updatedAt: '2023-01-01T00:00:00Z', name: 'Old Local' },
    ];
    const mockRemoteProjects = [
      { id: 'p1', updated_at: '2023-01-02T00:00:00Z', name: 'New Remote', created_at: '2023-01-01' },
    ];

    (useStore.getState as any).mockReturnValue({
      session: mockSession,
      projects: mockLocalProjects,
      upsertProject: mockUpsertProject,
    });

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: mockRemoteProjects, error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    });

    await syncProjects();

    expect(mockUpsertProject).toHaveBeenCalledWith(expect.objectContaining({
      id: 'p1',
      name: 'New Remote',
    }));
  });

  it('should upload newer local projects', async () => {
    const mockSession = { user: { id: 'user1' } };
    const mockUpsertProject = vi.fn();
    const mockLocalProjects = [
      { id: 'p1', updatedAt: '2023-01-02T00:00:00Z', name: 'New Local' },
    ];
    const mockRemoteProjects = [
      { id: 'p1', updated_at: '2023-01-01T00:00:00Z', name: 'Old Remote', created_at: '2023-01-01' },
    ];

    (useStore.getState as any).mockReturnValue({
      session: mockSession,
      projects: mockLocalProjects,
      upsertProject: mockUpsertProject,
    });

    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: mockRemoteProjects, error: null }),
      upsert: mockUpsert,
    });

    await syncProjects();

    expect(mockUpsertProject).not.toHaveBeenCalled(); // Local is newer, don't overwrite local
    expect(mockUpsert).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'New Local' })
    ]));
  });
});
