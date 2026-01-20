import { beforeEach, describe, expect, it, vi } from "vitest";
import { supabase } from "@/lib/supabase";
import { syncTasks } from "@/lib/syncEngine";
import { useStore } from "@/store/useStore";

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      upsert: vi.fn(),
      eq: vi.fn().mockReturnThis(),
    })),
  },
}));

// Mock useStore
vi.mock("@/store/useStore", () => ({
  useStore: {
    getState: vi.fn(),
  },
}));

describe("Sync Engine - syncTasks (Time Tracking)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should merge local timeSpentPerDay when remote is empty but newer", async () => {
    const mockSession = { user: { id: "user1" } };
    const mockUpsertTask = vi.fn();
    
    // Local task has time data
    const mockLocalTasks = [{ 
      id: "t1", 
      updatedAt: "2023-01-01T00:00:00Z", 
      title: "Local Task",
      timeSpentPerDay: { "2023-01-01": 3600 } 
    }];
    
    // Remote task is newer but has empty time data (simulating migration gap)
    const mockRemoteTasks = [
      {
        id: "t1",
        updated_at: "2023-01-02T00:00:00Z",
        title: "Remote Task Updated",
        created_at: "2023-01-01",
        time_spent_per_day: null // or {}
      },
    ];

    (useStore.getState as any).mockReturnValue({
      session: mockSession,
      isPro: true,
      tasks: mockLocalTasks,
      projects: [{ id: "p1" }], // Mock project to pass safety check
      upsertTask: mockUpsertTask,
      pendingDeleteTaskIds: [],
    });

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: mockRemoteTasks, error: null })
      }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    });

    await syncTasks();

    // Expect upsertTask to be called with merged data
    expect(mockUpsertTask).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "t1",
        title: "Remote Task Updated", // Should take remote title
        timeSpentPerDay: { "2023-01-01": 3600 }, // Should PRESERVE local time
      }),
    );
  });
});
