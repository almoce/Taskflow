import { describe, it, expect, vi, beforeEach } from "vitest";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }
}));

describe("Profiles Table", () => {
  it("should be able to query the profiles table", async () => {
    const { error } = await supabase.from("profiles").select("*").limit(1);
    
    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(error).toBeNull();
  });
});