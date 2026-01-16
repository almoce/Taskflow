import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "@/store/useStore";

describe("createSyncSlice", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("should initialize with empty pending delete arrays", () => {
    const state = useStore.getState();
    expect(state.pendingDeleteProjectIds).toEqual([]);
    expect(state.pendingDeleteTaskIds).toEqual([]);
  });

  it("should add to pending delete arrays", () => {
    const state = useStore.getState();

    state.addToPendingDelete("project", "p1");
    state.addToPendingDelete("task", "t1");

    const updatedState = useStore.getState();
    expect(updatedState.pendingDeleteProjectIds).toContain("p1");
    expect(updatedState.pendingDeleteTaskIds).toContain("t1");
  });

  it("should not add duplicates to pending delete arrays", () => {
    const state = useStore.getState();

    state.addToPendingDelete("project", "p1");
    state.addToPendingDelete("project", "p1");

    const updatedState = useStore.getState();
    expect(updatedState.pendingDeleteProjectIds.length).toBe(1);
  });

  it("should remove from pending delete arrays", () => {
    const state = useStore.getState();

    state.addToPendingDelete("project", "p1");
    state.removeFromPendingDelete("project", "p1");

    const updatedState = useStore.getState();
    expect(updatedState.pendingDeleteProjectIds).not.toContain("p1");
  });
});
