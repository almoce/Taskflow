import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnalyticsView } from "@/components/dashboard/AnalyticsView";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { ProjectDetailView } from "@/components/dashboard/ProjectDetailView";
import { FocusOverlay } from "@/components/focus/FocusOverlay";
import { ProjectSidebar } from "@/components/layout/Sidebar";
import { PricingModal } from "@/components/modals/PricingModal";
import { ProjectDialog } from "@/components/project-view/ProjectDialog";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { syncArchivedTasks, syncTasks } from "@/lib/syncEngine";
import { useAuth, useProjects, useUI } from "@/store/useStore";

const DashboardPage = () => {
  useRealtimeSync();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchProfile: refreshProfile } = useAuth();

  const { selectedProjectId } = useProjects();

  const { activeView, isPricingModalOpen, setIsPricingModalOpen } = useUI();

  // Handle Stripe Checkout Return
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      toast.promise(refreshProfile(), {
        loading: "Verifying subscription...",
        success: () => {
          navigate("/app", { replace: true });
          return "Welcome to Pro! You now have access to premium features.";
        },
        error: "Failed to verify subscription status. Please refresh.",
      });
    }
  }, [location.search, navigate, refreshProfile]);

  // Sync tasks for the selected project immediately
  useEffect(() => {
    if (selectedProjectId) {
      syncTasks(selectedProjectId);
      syncArchivedTasks(selectedProjectId);
    }
  }, [selectedProjectId]);

  return (
    <div className="flex h-screen bg-background">
      <ProjectSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">
          {activeView === "analytics" ? (
            <AnalyticsView />
          ) : selectedProjectId ? (
            <ProjectDetailView />
          ) : (
            <DashboardHome />
          )}
        </div>
      </main>

      <ProjectDialog />

      <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />
      <FocusOverlay />
    </div>
  );
};

export default DashboardPage;
