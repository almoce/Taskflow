import { describe, expect, it } from "vitest";
import { supabase } from "@/lib/supabase";

describe("Supabase Client", () => {
  it("should export a defined supabase instance", () => {
    expect(supabase).toBeDefined();
  });

  it("should have auth methods", () => {
    expect(supabase.auth).toBeDefined();
    expect(typeof supabase.auth.signUp).toBe("function");
    expect(typeof supabase.auth.signInWithPassword).toBe("function");
    expect(typeof supabase.auth.signOut).toBe("function");
  });
});
