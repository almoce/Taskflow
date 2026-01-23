import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUmami } from "@/hooks/useUmami";
import { cn } from "@/lib/utils";
import { useProjects, useUI } from "@/store/useStore";
import { downloadJson } from "@/utils/exportUtils";
import { SidebarProjectItem } from "./SidebarProjectItem";

interface SidebarProjectListProps {
  collapsed: boolean;
}

export const SidebarProjectList = ({ collapsed }: SidebarProjectListProps) => {
  const { projects, selectedProjectId, selectProject, deleteProject, getProjectExportData } =
    useProjects();

  const { activeView, setEditingProject, setIsProjectDialogOpen } = useUI();
  const { track } = useUmami();

  const handleExport = (projectId: string) => {
    try {
      const data = getProjectExportData(projectId);
      if (data) {
        downloadJson(data, `TaskFlow-${data.project.name.toLowerCase().replace(/\s+/g, "-")}.json`);
        track("project_export");
        toast.success("Project exported successfully");
      } else {
        toast.error("Failed to export project");
      }
    } catch (error) {
      console.error("Failed to export project:", error);
      toast.error("Failed to export project");
    }
  };

  return (
    <>
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
            onClick={() => {
              setEditingProject(null);
              setIsProjectDialogOpen(true);
            }}
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
                selectProject(project.id);
                track("project_select");
              }}
              onEdit={() => setEditingProject(project)}
              onExport={() => {
                handleExport(project.id);
                track("project_export");
              }}
              onDelete={() => deleteProject(project.id)}
            />
          ))}

          {projects.length === 0 && !collapsed && (
            <div className="text-center py-6 text-xs text-muted-foreground">No projects yet</div>
          )}
        </div>
      </ScrollArea>
    </>
  );
};
