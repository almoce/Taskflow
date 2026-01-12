import { ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Priority, Project, Task, TaskStatus, TaskTag } from "@/types/task";
import { TaskCard } from "./TaskCard";

interface TaskSearchProps {
  tasks: Task[];
  projects: Project[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onSelectProject: (id: string) => void;
}

const priorities: Priority[] = ["high", "medium", "low"];
const statuses: TaskStatus[] = ["todo", "in-progress", "done"];
const tags: TaskTag[] = ["Bug", "Feature", "Improvement"];

export function TaskSearch({
  tasks,
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

  const togglePriority = (priority: Priority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority],
    );
  };

  const toggleStatus = (status: TaskStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  const toggleTag = (tag: TaskTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((p) => p !== projectId) : [...prev, projectId],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPriorities([]);
    setSelectedStatuses([]);
    setSelectedTags([]);
    setSelectedProjects([]);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Text search
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Priority filter
      const matchesPriority =
        selectedPriorities.length === 0 || selectedPriorities.includes(task.priority);

      // Status filter
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(task.status);

      // Project filter
      const matchesProject =
        selectedProjects.length === 0 || selectedProjects.includes(task.projectId);

      // Tag filter
      const matchesTag = selectedTags.length === 0 || (task.tag && selectedTags.includes(task.tag));

      return matchesSearch && matchesPriority && matchesStatus && matchesProject && matchesTag;
    });
  }, [tasks, searchQuery, selectedPriorities, selectedStatuses, selectedProjects, selectedTags]);

  const hasActiveFilters =
    searchQuery ||
    selectedPriorities.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedTags.length > 0 ||
    selectedProjects.length > 0;
  const _activeFilterCount =
    selectedPriorities.length +
    selectedStatuses.length +
    selectedTags.length +
    selectedProjects.length;

  const getProjectById = (projectId: string) => projects.find((p) => p.id === projectId);

  const priorityLabels: Record<Priority, string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  const statusLabels: Record<TaskStatus, string> = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

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

        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Priority
              {selectedPriorities.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {selectedPriorities.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {priorities.map((priority) => (
              <DropdownMenuCheckboxItem
                key={priority}
                checked={selectedPriorities.includes(priority)}
                onCheckedChange={() => togglePriority(priority)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      priority === "high" && "bg-priority-high",
                      priority === "medium" && "bg-priority-medium",
                      priority === "low" && "bg-priority-low",
                    )}
                  />
                  {priorityLabels[priority]}
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Status
              {selectedStatuses.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {selectedStatuses.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={() => toggleStatus(status)}
              >
                {statusLabels[status]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tag Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Tag
              {selectedTags.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {selectedTags.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      tag === "Bug" && "bg-rose-500",
                      tag === "Feature" && "bg-indigo-500",
                      tag === "Improvement" && "bg-cyan-500",
                    )}
                  />
                  {tag}
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Project Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Project
              {selectedProjects.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {selectedProjects.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projects.map((project) => (
              <DropdownMenuCheckboxItem
                key={project.id}
                checked={selectedProjects.includes(project.id)}
                onCheckedChange={() => toggleProject(project.id)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {selectedPriorities.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1">
              {priorityLabels[priority]}
              <X className="h-3 w-3 cursor-pointer" onClick={() => togglePriority(priority)} />
            </Badge>
          ))}
          {selectedStatuses.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {statusLabels[status]}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleStatus(status)} />
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
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag)} />
            </Badge>
          ))}
          {selectedProjects.map((projectId) => {
            const project = getProjectById(projectId);
            return project ? (
              <Badge key={projectId} variant="secondary" className="gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                {project.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleProject(projectId)} />
              </Badge>
            ) : null;
          })}
        </div>
      )}

      {/* Search Results */}
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
                className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
                filteredTasks.map((task) => {
                  const project = getProjectById(task.projectId);
                  return (
                    <div
                      key={task.id}
                      className="relative"
                      onClick={() => onSelectProject(task.projectId)}
                    >
                      <TaskCard
                        task={task}
                        onUpdate={(updates) => onUpdateTask(task.id, updates)}
                        onDelete={() => onDeleteTask(task.id)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
