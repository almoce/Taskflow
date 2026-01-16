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
}: TaskSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [selectedTags, setSelectedTags] = useState<TaskTag[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSelection = <T,>(
    item: T,
    selectedItems: T[],
    setSelectedItems: (items: T[]) => void,
  ) => {
    setSelectedItems(
      selectedItems.includes(item)
        ? selectedItems.filter((i) => i !== item)
        : [...selectedItems, item],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPriorities([]);
    setSelectedStatuses([]);
    setSelectedTags([]);
    setSelectedProjects([]);
  };

  const allTasks = useMemo(() => [...tasks, ...archivedTasks], [tasks, archivedTasks]);

  const filteredTasks = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    return allTasks.filter((task) => {
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      if (selectedPriorities.length > 0 && !selectedPriorities.includes(task.priority)) {
        return false;
      }

      if (selectedStatuses.length > 0 && !selectedStatuses.includes(task.status)) {
        return false;
      }

      if (selectedProjects.length > 0 && !selectedProjects.includes(task.projectId)) {
        return false;
      }

      if (selectedTags.length > 0 && (!task.tag || !selectedTags.includes(task.tag))) {
        return false;
      }

      return true;
    });
  }, [allTasks, searchQuery, selectedPriorities, selectedStatuses, selectedProjects, selectedTags]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedPriorities.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedTags.length > 0 ||
    selectedProjects.length > 0;

  const getProjectById = (projectId: string) => projects.find((p) => p.id === projectId);

  const priorityOptions: FilterOption<Priority>[] = PRIORITIES.map((p) => ({
    value: p,
    label: PRIORITY_LABELS[p],
    className: PRIORITY_COLORS[p],
  }));

  const statusOptions: FilterOption<TaskStatus>[] = STATUSES.map((s) => ({
    value: s,
    label: STATUS_LABELS[s],
  }));

  const tagOptions: FilterOption<TaskTag>[] = TAGS.map((t) => ({
    value: t,
    label: t,
    className: TAG_COLORS[t],
  }));

  const projectOptions: FilterOption<string>[] = projects.map((p) => ({
    value: p.id,
    label: p.name,
    color: p.color,
  }));

  return (
    <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks across all projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <FilterDropdown
          label="Priority"
          options={priorityOptions}
          selectedValues={selectedPriorities}
          onToggle={(val) => toggleSelection(val, selectedPriorities, setSelectedPriorities)}
        />

        <FilterDropdown
          label="Status"
          options={statusOptions}
          selectedValues={selectedStatuses}
          onToggle={(val) => toggleSelection(val, selectedStatuses, setSelectedStatuses)}
        />

        <FilterDropdown
          label="Tag"
          options={tagOptions}
          selectedValues={selectedTags}
          onToggle={(val) => toggleSelection(val, selectedTags, setSelectedTags)}
        />

        <FilterDropdown
          label="Project"
          options={projectOptions}
          selectedValues={selectedProjects}
          onToggle={(val) => toggleSelection(val, selectedProjects, setSelectedProjects)}
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {selectedPriorities.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1">
              {PRIORITY_LABELS[priority]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleSelection(priority, selectedPriorities, setSelectedPriorities)}
              />
            </Badge>
          ))}
          {selectedStatuses.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {STATUS_LABELS[status]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleSelection(status, selectedStatuses, setSelectedStatuses)}
              />
            </Badge>
          ))}
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn(
                "gap-1",
                tag === "Bug" && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                tag === "Feature" && "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
                tag === "Improvement" && "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
              )}
            >
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleSelection(tag, selectedTags, setSelectedTags)}
              />
            </Badge>
          ))}
          {selectedProjects.map((projectId) => {
            const project = getProjectById(projectId);
            return project ? (
              <Badge key={projectId} variant="secondary" className="gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                {project.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleSelection(projectId, selectedProjects, setSelectedProjects)}
                />
              </Badge>
            ) : null;
          })}
        </div>
      )}

      {hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              {isExpanded ? "Collapse" : "Expand"} results
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
              />
            </Button>
          </div>

          {isExpanded && (
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks match your search criteria
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="relative cursor-pointer"
                    onClick={() => onSelectProject(task.projectId)}
                  >
                    <TaskCard
                      task={task}
                      onUpdate={(updates) => onUpdateTask(task.id, updates)}
                      onDelete={() => onDeleteTask(task.id)}
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
