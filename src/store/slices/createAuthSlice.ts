import type { StateCreator } from "zustand";
import type { StoreState, AuthSlice } from "../types";
import { supabase } from "@/lib/supabase";

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (set, get) => ({
  session: null,
  user: null,
  profile: null,
  isPro: false,
  loading: true,

  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
      loading: false
    });
    if (session?.user) {
      get().fetchProfile();
    } else {
      set({ isPro: false, profile: null });
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      set({ 
        profile: data,
        isPro: data.is_pro
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null, isPro: false });
  },
});
