import { Download, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/task";

export interface SidebarProjectItemProps {
  project: Project;
  isSelected: boolean;
  collapsed: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export const SidebarProjectItem = ({
  project,
  isSelected,
  collapsed,
  onSelect,
  onEdit,
  onExport,
  onDelete,
}: SidebarProjectItemProps) => {
  const ProjectButton = (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex-1 h-8 px-2 hover:bg-transparent",
        collapsed ? "justify-center" : "justify-start",
      )}
      onClick={onSelect}
    >
      <div className={cn("flex items-center", !collapsed && "gap-2 w-full")}>
        {project.icon ? (
          <span className="text-sm shrink-0">{project.icon}</span>
        ) : (
          <div
            className="w-2 h-2 rounded-sm shrink-0"
            style={{ backgroundColor: project.color }}
          />
        )}
        {!collapsed && (
          <span
            className={cn(
              "truncate max-w-36 text-sm",
              isSelected ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {project.name}
          </span>
        )}
      </div>
    </Button>
  );

  return (
    <div
      className={cn(
        "group flex items-center rounded-md transition-colors",
        isSelected ? "bg-secondary" : "hover:bg-secondary/50",
      )}
    >
      {collapsed ? (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>{ProjectButton}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="origin-left data-[state=delayed-open]:animate-tooltip-expand data-[state=closed]:animate-tooltip-collapse"
          >
            <p className="whitespace-nowrap">{project.name}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        ProjectButton
      )}
      {!collapsed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Project options"
              className="h-6 w-6 mr-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEdit} className="text-sm">
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport} className="text-sm">
              <Download className="h-3.5 w-3.5 mr-2" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive text-sm"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
