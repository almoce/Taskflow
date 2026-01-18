import { ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { FilterDropdown, type FilterOption } from "@/components/FilterDropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Priority, Project, Task, TaskStatus, TaskTag } from "@/types/task";
import { TaskCard } from "./TaskCard";

interface TaskSearchProps {
  tasks: Task[];
  archivedTasks: Task[];
  projects: Project[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onSelectProject: (id: string) => void;
  onStartFocus?: (taskId: string) => void;
}

const PRIORITIES: Priority[] = ["high", "medium", "low"];
const STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];
const TAGS: TaskTag[] = ["Bug", "Feature", "Improvement"];

const PRIORITY_LABELS: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  high: "bg-priority-high",
  medium: "bg-priority-medium",
  low: "bg-priority-low",
};

const TAG_COLORS: Record<TaskTag, string> = {
  Bug: "bg-rose-500",
  Feature: "bg-indigo-500",
  Improvement: "bg-cyan-500",
};

export function TaskSearch({
  tasks,
  archivedTasks,
  projects,
  onUpdateTask,
  onDeleteTask,
  onSelectProject,
  onStartFocus,
}: TaskSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
...
                    <TaskCard
                      task={task}
                      onUpdate={(updates) => onUpdateTask(task.id, updates)}
                      onDelete={() => onDeleteTask(task.id)}
                      onStartFocus={onStartFocus ? () => onStartFocus(task.id) : undefined}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
