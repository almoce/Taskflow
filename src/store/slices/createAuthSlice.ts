import type { StateCreator } from "zustand";
import { supabase } from "@/lib/supabase";
import type { AuthSlice, StoreState } from "../types";

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (set, get) => ({
  session: null,
  user: null,
  profile: null,
  isPro: false,
  loading: true,

  setSession: (session) => {
    const currentUser = get().user;
    const newUser = session?.user ?? null;

    if (currentUser?.id === newUser?.id && get().profile) {
      // Session refreshed but user is same and profile loaded.
      // Update session/user but skip profile fetch unless explicit refresh needed?
      // But maybe profile changed?
      // Usually setSession is called on token refresh. Profile doesn't change on token refresh.
      set({
        session,
        user: newUser,
        loading: false,
      });
      return;
    }

    set({
      session,
      user: newUser,
      loading: false,
    });

    if (newUser) {
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
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      set({
        profile: data,
        isPro: data.is_pro,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null, isPro: false });
  },
});
