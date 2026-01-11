import { Download, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/types/task";

interface ProjectCardProps {
  project: Project;
  progress: number;
  taskCounts: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export function ProjectCard({
  project,
  progress,
  taskCounts,
  isSelected,
  onClick,
  onEdit,
  onDelete,
  onExport,
}: ProjectCardProps) {
  return (
    <div
      className={`w-full text-left p-4 rounded-lg border bg-card cursor-pointer transition-colors group ${isSelected ? "border-primary" : "border-border hover:border-muted-foreground/30"
        }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {project.icon ? (
            <span className="text-base">{project.icon}</span>
          ) : (
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: project.color }} />
          )}
          <h3 className="font-medium text-sm">{project.name}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-sm"
            >
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive focus:text-destructive text-sm"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onExport();
              }}
              className="text-sm"
            >
              <Download className="h-3.5 w-3.5 mr-2" />
              Export
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {project.description && (
        <p
          className="text-xs text-muted-foreground mb-3 line-clamp-2 overflow-hidden"
          title={project.description}
        >
          {project.description}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      <div className="flex gap-3 mt-3 text-[10px] text-muted-foreground">
        <span>{taskCounts.todo} todo</span>
        <span>{taskCounts.inProgress} in progress</span>
        <span>{taskCounts.done} done</span>
      </div>
    </div>
  );
}
