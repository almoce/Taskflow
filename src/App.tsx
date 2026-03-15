import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, domAnimation } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { RouteTracker } from "./components/analytics/RouteTracker";
import { DevTools } from "./components/DevTools";
import { supabase } from "./lib/supabase";
import { useAuth } from "./store/useStore";

// Components
import AuthCallback from "./pages/AuthCallback";
import DashboardPage from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import ResetPassword from "./pages/ResetPassword";
import { TermsOfService } from "./pages/TermsOfService";

// Lazy-loaded landing page to trigger separate chunking
const Index = lazy(() => import("./pages/Index"));

const queryClient = new QueryClient();

const App = () => {
  const { setSession } = useAuth();

  useEffect(() => {
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={domAnimation}>
        <TooltipProvider>
          <Sonner richColors theme="dark" />
          <HashRouter>
            <RouteTracker />
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>}>
                    <Index />
                  </Suspense>
                }
              />
              <Route path="/app" element={<DashboardPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<TermsOfService />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <DevTools />
          </HashRouter>
        </TooltipProvider>
      </LazyMotion>
    </QueryClientProvider>
  );
};

export default App;
