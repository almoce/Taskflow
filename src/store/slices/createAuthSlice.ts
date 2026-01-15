import type { StateCreator } from "zustand";
import type { StoreState, AuthSlice } from "../types";
import { supabase } from "@/lib/supabase";

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (set) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,

  setSession: (session) => set({
    session,
    user: session?.user ?? null,
    loading: false
  }),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },
});
