import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouteTracker } from "./components/analytics/RouteTracker";
import { DevTools } from "./components/DevTools";
import { supabase } from "./lib/supabase";
import AuthCallback from "./pages/AuthCallback";
import DashboardPage from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import ResetPassword from "./pages/ResetPassword";
import { TermsOfService } from "./pages/TermsOfService";
import { useAuth } from "./store/useStore";

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
      <TooltipProvider>
        <Sonner />
        <HashRouter>
          <RouteTracker />
          <Routes>
            <Route path="/" element={<Index />} />
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
    </QueryClientProvider>
  );
};

export default App;
