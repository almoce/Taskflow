import { format } from "date-fns";
import {
  Archive,
  ArchiveRestore,
  Bug,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUmami } from "@/hooks/useUmami";
import { cn } from "@/lib/utils";
import type { Priority, Task } from "@/types/task";
import { formatDuration } from "@/utils/time";

interface TaskCardProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onStartFocus?: () => void;
}

const priorityStyles: Record<Priority, string> = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

export function TaskCard({
  task,
  onUpdate,
  onDelete,
  onEdit,
  onArchive,
  onStartFocus,
}: TaskCardProps) {
  const isDone = task.status === "done";
  const hasDescription = task.description && task.description.trim().length > 0;
  const { track } = useUmami();

  const handleStatusToggle = () => {
    const newStatus = isDone ? "todo" : "done";
    onUpdate({ status: newStatus });
    if (newStatus === "done") {
      track("task_complete", { priority: task.priority });
    }
  };

  return (
    <div
      className={`p-3 rounded-md border border-border bg-card group transition-colors hover:border-muted-foreground/20 ${isDone ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-sm font-medium leading-snug line-clamp-2 ${isDone ? "line-through text-muted-foreground" : ""}`}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-0.5">
          {!isDone && onStartFocus ? (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onStartFocus}
                  className={cn(
                    "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
                    task.totalTimeSpent && task.totalTimeSpent > 0
                      ? "text-yellow-500 hover:text-yellow-600"
                      : "text-primary hover:text-primary",
                  )}
                >
                  <Zap className="h-3.5 w-3.5 fill-current" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs font-semibold">Start Focus</p>
              </TooltipContent>
            </Tooltip>
          ) : isDone && onArchive ? (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onArchive}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <Archive className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs font-semibold">Archive Task</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground shrink-0"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit} className="text-sm">
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleStatusToggle} className="text-sm">
                {isDone ? (
                  <>
                    <RotateCcw className="h-3.5 w-3.5 mr-2" />
                    Reopen
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                    Complete
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive} className="text-sm">
                {task.isArchived ? (
                  <>
                    <ArchiveRestore className="h-3.5 w-3.5 mr-2" />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive className="h-3.5 w-3.5 mr-2" />
                    Archive
                  </>
                )}
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
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-medium",
            priorityStyles[task.priority],
          )}
        >
          {task.priority}
        </span>

        {task.tag && (
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "w-[18px] h-[18px] rounded-full text-[10px] font-medium flex items-center justify-center border",
                  task.tag === "Bug" && "bg-rose-500/15 text-rose-500 border-rose-500/20",
                  task.tag === "Feature" && "bg-indigo-500/15 text-indigo-500 border-indigo-500/20",
                  task.tag === "Improvement" && "bg-cyan-500/15 text-cyan-500 border-cyan-500/20",
                )}
              >
                {task.tag === "Bug" && <Bug className="h-2.5 w-2.5" />}
                {task.tag === "Feature" && <Zap className="h-2.5 w-2.5" />}
                {task.tag === "Improvement" && <TrendingUp className="h-2.5 w-2.5" />}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{task.tag}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {task.totalTimeSpent && task.totalTimeSpent > 0 ? (
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5">
                <div className="w-[18px] h-[18px] rounded-full bg-muted/30 border border-border/50 flex items-center justify-center">
                  <Clock className="h-2.5 w-2.5 text-muted-foreground/60" />
                </div>
                <span className="text-[10px] text-muted-foreground/80 font-medium tabular-nums">
                  {formatDuration(task.totalTimeSpent)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Total time spent</p>
            </TooltipContent>
          </Tooltip>
        ) : null}

        {hasDescription && (
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="w-[18px] h-[18px] rounded-full bg-muted/30 border border-border/50 flex items-center justify-center cursor-help">
                <FileText className="h-2.5 w-2.5 text-muted-foreground/60" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm font-medium mb-1">{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.description}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {task.dueDate && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
            <Calendar className="h-2.5 w-2.5" />
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}

        {task.subtasks.length > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-10 h-1 bg-muted rounded-full overflow-hidden transition-transform duration-200 hover:scale-y-150 hover:scale-x-105">
              <div
                className="h-full bg-primary/70 rounded-full transition-all"
                style={{
                  width: `${(task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
