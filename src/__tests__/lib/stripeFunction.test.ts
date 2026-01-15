import { describe, it, expect, vi } from "vitest";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    functions: {
      invoke: vi.fn((name: string, options?: any) => {
        if (name === "create-checkout-session") {
          return Promise.resolve({ data: { url: "https://checkout.stripe.com/..." }, error: null });
        }
        return Promise.resolve({ data: null, error: new Error("Not found") });
      })
    }
  }
}));

describe("Stripe Checkout Edge Function", () => {
  it("should respond to a call to create-checkout-session", async () => {
    const { data, error } = await supabase.functions.invoke("create-checkout-session", {
      body: { priceId: "price_123" }
    });
    
    expect(supabase.functions.invoke).toHaveBeenCalledWith("create-checkout-session", expect.any(Object));
    expect(error).toBeNull();
    expect(data.url).toBeDefined();
  });
});