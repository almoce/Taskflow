import { describe, it, expect, vi, beforeEach } from "vitest";
import { syncTasks } from "@/lib/syncEngine";
import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

// Mock Store
vi.mock("@/store/useStore", () => ({
  useStore: {
    getState: vi.fn(),
  },
}));

describe("Granular Sync Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be able to read tasks from the store even if they were loaded from granular storage", async () => {
    // Setup store state as if it were loaded
    (useStore.getState as any).mockReturnValue({
      session: { user: { id: "u1" } },
      isPro: true,
      tasks: [{ id: "t1", projectId: "p1", updatedAt: new Date().toISOString() }],
      pendingDeleteTaskIds: [],
      projects: [{ id: "p1" }], // Project exists
      upsertTask: vi.fn(),
    });

    await syncTasks();

    // Verification: Sync Engine should have accessed the store state successfully
    // We confirm this by checking if it tried to query supabase (which implies it passed the early return checks)
    expect(supabase.from).toHaveBeenCalledWith("tasks");
  });
});
