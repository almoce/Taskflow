import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/task";
import { ProjectCard } from "./ProjectCard";

interface ProjectOverviewProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
  onExport: (id: string) => void;
  getProgress: (id: string) => number;
  getTaskCounts: (id: string) => {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

export function ProjectOverview({
  projects,
  selectedProjectId,
  onSelectProject,
  onEditProject,
  onDeleteProject,
  onNewProject,
  onExport,
  getProgress,
  getTaskCounts,
}: ProjectOverviewProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Projects</h2>
        <Button variant="outline" size="sm" onClick={onNewProject}>
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <div key={project.id}>
            <ProjectCard
              project={project}
              progress={getProgress(project.id)}
              taskCounts={getTaskCounts(project.id)}
              isSelected={selectedProjectId === project.id}
              onClick={() => onSelectProject(project.id)}
              onEdit={() => onEditProject(project)}
              onDelete={() => onDeleteProject(project.id)}
              onExport={() => onExport(project.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
