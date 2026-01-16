import { useAuth } from "@/store/useStore";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, any>) => void;
    };
  }
}

export const useUmami = () => {
  const { session, profile } = useAuth();

  const track = (event: string, data?: Record<string, any>) => {
    // Check if user is Pro based on profile data
    const isPro = profile?.is_pro || false;
    const isAuthenticated = !!session;

    const payload = {
      ...data,
      is_pro: isPro,
      is_authenticated: isAuthenticated,
    };

    if (window.umami) {
      window.umami.track(event, payload);
    } else if (import.meta.env.DEV) {
      console.log(`[Umami Dev] Track: ${event}`, payload);
    }
  };

  return { track };
};
