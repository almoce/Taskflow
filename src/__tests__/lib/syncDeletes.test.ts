import { describe, it, expect, vi, beforeEach } from "vitest";
import { useStore } from "@/store/useStore";
import { syncDeletes } from "@/lib/syncEngine";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      delete: vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({ error: null })
      })
    })
  }
}));

describe("syncDeletes", () => {
  beforeEach(() => {
    useStore.getState().reset();
    vi.clearAllMocks();
  });

  it("should send DELETE requests for pending project and task IDs", async () => {
    const { addToPendingDelete, setSession } = useStore.getState();
    
    // Set a dummy session
    setSession({ user: { id: "u1" } } as any);
    
    addToPendingDelete("project", "p1");
    addToPendingDelete("task", "t1");
    
    await syncDeletes();
    
    expect(supabase.from).toHaveBeenCalledWith("projects");
    expect(supabase.from).toHaveBeenCalledWith("tasks");
    
    const state = useStore.getState();
    expect(state.pendingDeleteProjectIds).toEqual([]);
    expect(state.pendingDeleteTaskIds).toEqual([]);
  });

  it("should not clear IDs if delete request fails", async () => {
    const { addToPendingDelete, setSession } = useStore.getState();
    setSession({ user: { id: "u1" } } as any);
    
    addToPendingDelete("project", "p1");
    
    // Mock failure for projects
    vi.mocked(supabase.from).mockReturnValueOnce({
      delete: vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({ error: new Error("Fail") })
      })
    } as any);
    
    await syncDeletes();
    
    const state = useStore.getState();
    expect(state.pendingDeleteProjectIds).toContain("p1");
  });
});