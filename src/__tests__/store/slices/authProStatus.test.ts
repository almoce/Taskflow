import { beforeEach, describe, expect, it, vi } from "vitest";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn(),
  },
}));

describe("AuthSlice Pro Status", () => {
  beforeEach(() => {
    useStore.getState().reset();
    vi.clearAllMocks();
  });

  it("should update isPro status when fetchProfile is called", async () => {
    // 1. Mock successful profile fetch FIRST
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: "u1", is_pro: true }, error: null }),
        }),
      }),
    } as any);

    // 2. Set user in session (this triggers fetchProfile)
    const mockUser = { id: "u1", email: "test@example.com" };
    await useStore.getState().setSession({ user: mockUser } as any);

    const state = useStore.getState();
    expect(state.isPro).toBe(true);
    expect(state.profile?.is_pro).toBe(true);
  });
});
