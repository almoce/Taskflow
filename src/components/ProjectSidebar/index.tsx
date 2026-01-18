import { BarChart3, ChevronLeft, ChevronRight, Home, Key, LogOut, Plus, User } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUmami } from "@/hooks/useUmami";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useStore";
import type { Project } from "@/types/task";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarProjectItem } from "./SidebarProjectItem";

interface ProjectSidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  activeView: "tasks" | "analytics";
  onSelectProject: (id: string | null) => void;
  onSetActiveView: (view: "tasks" | "analytics") => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
  onExport: (id: string) => void;
  onUpgrade?: () => void;
  onManageSubscription?: () => void;
}

export const ProjectSidebar = ({
  projects,
  selectedProjectId,
  activeView,
  onSelectProject,
  onSetActiveView,
  onEditProject,
  onDeleteProject,
  onNewProject,
  onExport,
  onUpgrade,
  onManageSubscription,
}: ProjectSidebarProps) => {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored ? JSON.parse(stored) : false;
  });
  const [authOpen, setAuthOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const { user, signOut, isPro } = useAuth();
  const { track } = useUmami();

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || "U";

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
            onSelectProject(null);
            onSetActiveView("tasks");
            track("dashboard_view");
          }}
        />

        <SidebarNavItem
          icon={BarChart3}
          label="Analytics"
          isActive={activeView === "analytics"}
          collapsed={collapsed}
          onClick={() => {
            onSetActiveView("analytics");
            track("analytics_view");
          }}
        />
      </nav>

      <div className="px-3 py-3">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="text-xs font-medium text-muted-foreground">Projects</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Add project"
            className={cn(
              "h-5 w-5 text-muted-foreground hover:text-foreground",
              collapsed && "mx-auto",
            )}
            onClick={onNewProject}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5">
          {projects.map((project) => (
            <SidebarProjectItem
              key={project.id}
              project={project}
              isSelected={activeView === "tasks" && selectedProjectId === project.id}
              collapsed={collapsed}
              onSelect={() => {
                onSelectProject(project.id);
                track("project_select");
              }}
              onEdit={() => onEditProject(project)}
              onExport={() => {
                onExport(project.id);
                track("project_export");
              }}
              onDelete={() => onDeleteProject(project.id)}
            />
          ))}

          {projects.length === 0 && !collapsed && (
            <div className="text-center py-6 text-xs text-muted-foreground">No projects yet</div>
          )}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-border space-y-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-12 px-2 hover:bg-accent flex items-center",
                  collapsed ? "justify-center" : "justify-start gap-3",
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/20 text-primary font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <Badge
                    variant={isPro ? "default" : "secondary"}
                    className={cn(
                      "absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] h-3.5 px-1 py-0 pointer-events-none shadow-sm z-10 whitespace-nowrap",
                      isPro &&
                        "bg-gradient-to-r from-purple-500 to-blue-500 border-none text-white",
                      !isPro && "bg-background border border-border text-muted-foreground",
                    )}
                  >
                    {isPro ? "PRO" : "FREE"}
                  </Badge>
                </div>

                {!collapsed && (
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-xs font-medium truncate w-32 whitespace-nowrap">
                      {user.email}
                    </span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56" side={collapsed ? "right" : "top"}>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-3 cursor-pointer focus:bg-accent"
                onClick={() => {
                  if (isPro) {
                    onManageSubscription?.();
                    track("manage_subscription");
                  } else {
                    onUpgrade?.();
                    track("upgrade_modal_open");
                  }
                }}
              >
                <Badge
                  variant={isPro ? "default" : "secondary"}
                  className="text-[10px] whitespace-nowrap"
                >
                  {isPro ? "Pro Plan" : "Free Plan"}
                </Badge>
                <span className="text-xs font-medium whitespace-nowrap">
                  {isPro ? "Manage Subscription" : "Upgrade to Pro"}
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setChangePasswordOpen(true)}
                className="gap-2 cursor-pointer"
              >
                <Key className="h-4 w-4" />
                Change Password
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-red-500 gap-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className={cn("w-full", collapsed ? "px-0" : "px-4")}
                onClick={() => {
                  setAuthOpen(true);
                  track("auth_modal_open");
                }}
              >
                {collapsed ? <User className="h-4 w-4" /> : "Sign In"}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isPro ? "Data is syncing" : "Sign in to sync your data (Pro)"}</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Button
          variant="ghost"
          size="sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={cn(
            "w-full h-8 px-2 text-muted-foreground hover:text-foreground",
            collapsed ? "justify-center" : "justify-start",
          )}
          onClick={toggleCollapsed}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </Button>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </aside>
  );
};
