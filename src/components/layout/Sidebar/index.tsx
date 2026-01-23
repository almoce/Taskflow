import { BarChart3, Home } from "lucide-react";
import { useState } from "react";
import { useUmami } from "@/hooks/useUmami";
import { cn } from "@/lib/utils";
import { useProjects, useUI } from "@/store/useStore";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarProjectList } from "./SidebarProjectList";

export const ProjectSidebar = () => {
  const { selectedProjectId, selectProject } = useProjects();
  const { activeView, setActiveView } = useUI();

  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored ? JSON.parse(stored) : false;
  });
  const { track } = useUmami();

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  return (
    <aside
      className={cn(
        "h-dvh bg-background border-r border-border flex flex-col transition-all duration-200",
        collapsed ? "w-14" : "w-56",
      )}
    >
      <div className="h-12 px-3 flex items-center border-b border-border">
        <div
          className={cn(
            "flex items-center overflow-hidden transition-all duration-300",
            collapsed ? "w-6" : "w-32",
          )}
        >
          <img
            src={`${import.meta.env.BASE_URL}logo_taskflow_text_white.png`}
            alt="TaskFlow"
            className="min-w-[110px] max-w-[110px]"
          />
        </div>
      </div>

      <nav className="p-2 space-y-0.5">
        <SidebarNavItem
          icon={Home}
          label="Dashboard"
          isActive={activeView === "tasks" && selectedProjectId === null}
          collapsed={collapsed}
          onClick={() => {
            selectProject(null);
            setActiveView("tasks");
            track("dashboard_view");
          }}
        />

        <SidebarNavItem
          icon={BarChart3}
          label="Analytics"
          isActive={activeView === "analytics"}
          collapsed={collapsed}
          onClick={() => {
            setActiveView("analytics");
            track("analytics_view");
          }}
        />
      </nav>

      <SidebarProjectList collapsed={collapsed} />

      <SidebarFooter collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
    </aside>
  );
};
