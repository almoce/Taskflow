import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStore } from "@/store/useStore";

describe("createAuthSlice", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("should have initial auth state", () => {
    const state = useStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.loading).toBe(true);
  });

  it("should update session and user via setSession", () => {
    const mockSession = { user: { id: "123", email: "test@example.com" } } as any;

    useStore.getState().setSession(mockSession);

    const state = useStore.getState();
    expect(state.session).toBe(mockSession);
    expect(state.user).toBe(mockSession.user);
    expect(state.loading).toBe(false);
  });

  it("should clear session and user via signOut", async () => {
    // Setup initial state
    const mockSession = { user: { id: "123", email: "test@example.com" } } as any;
    useStore.getState().setSession(mockSession);

    // Perform sign out
    await useStore.getState().signOut();

    const state = useStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
  });
});
