import { describe, it, expect, vi, beforeEach } from "vitest";
import { useStore } from "@/store/useStore";
import { syncProjects, syncTasks } from "@/lib/syncEngine";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn()
    }))
  }
}));

describe("syncDown Filtering", () => {
  beforeEach(() => {
    useStore.getState().reset();
    vi.clearAllMocks();
  });

  it("should ignore remote projects that are in the pending delete queue", async () => {
    const { addToPendingDelete, setSession } = useStore.getState();
    setSession({ user: { id: "u1" } } as any);
    
    const pendingId = "p-deleted-locally";
    addToPendingDelete("project", pendingId);
    
    // Mock remote data containing the deleted project
    vi.mocked(supabase.from).mockReturnValue({
      select: () => Promise.resolve({
        data: [{ id: pendingId, name: "Deleted Project", color: "red", updated_at: new Date().toISOString() }],
        error: null
      })
    } as any);
    
    await syncProjects();
    
    const state = useStore.getState();
    expect(state.projects.find(p => p.id === pendingId)).toBeUndefined();
  });

  it("should ignore remote tasks that are in the pending delete queue", async () => {
    const { addToPendingDelete, setSession } = useStore.getState();
    setSession({ user: { id: "u1" } } as any);
    
    const pendingId = "t-deleted-locally";
    addToPendingDelete("task", pendingId);
    
    // Mock remote data containing the deleted task
    vi.mocked(supabase.from).mockReturnValue({
      select: () => Promise.resolve({
        data: [{ 
            id: pendingId, 
            project_id: "p1", 
            title: "Deleted Task", 
            status: "todo", 
            priority: "medium", 
            updated_at: new Date().toISOString(),
            is_archived: false
        }],
        error: null
      })
    } as any);
    
    await syncTasks();
    
    const state = useStore.getState();
    expect(state.tasks.find(t => t.id === pendingId)).toBeUndefined();
  });
});
