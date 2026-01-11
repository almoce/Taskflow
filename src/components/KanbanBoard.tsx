import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, Filter, Plus, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { Priority, Project, Task, TaskStatus, TaskTag } from "@/types/task";
import { TaskCard } from "./TaskCard";

interface KanbanBoardProps {
  project: Project;
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (taskId: string, status: TaskStatus) => void;
  onEditTask?: (task: Task) => void;
  onArchiveTask?: (id: string) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

interface SortableTaskProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
}

function SortableTask({ task, onUpdate, onDelete, onEdit, onArchive }: SortableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEdit={onEdit}
        onArchive={onArchive}
      />
    </div>
  );
}

interface DroppableColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (task: Task) => void;
  onArchiveTask?: (id: string) => void;
  isHighlighted: boolean;
}

function DroppableColumn({
  id,
  title,
  tasks,
  onUpdateTask,
  onDeleteTask,
  onEditTask,
  onArchiveTask,
  isHighlighted,
}: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </div>

      <SortableContext
        id={id}
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            "space-y-2 min-h-[120px] p-2 rounded-lg bg-secondary/30 border border-border/50 transition-colors",
            isHighlighted && "bg-primary/10 border-primary/50",
          )}
        >
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
              {isHighlighted ? "Drop here" : "No tasks"}
            </div>
          ) : (
            tasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                onUpdate={(updates) => onUpdateTask(task.id, updates)}
                onDelete={() => onDeleteTask(task.id)}
                onEdit={onEditTask ? () => onEditTask(task) : undefined}
                onArchive={onArchiveTask ? () => onArchiveTask(task.id) : undefined}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({
  project,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onEditTask,
  onArchiveTask,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<TaskStatus | null>(null);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedTags, setSelectedTags] = useState<TaskTag[]>([]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesPriority =
        selectedPriorities.length === 0 || selectedPriorities.includes(task.priority);
      const matchesTag = selectedTags.length === 0 || (task.tag && selectedTags.includes(task.tag));
      return matchesPriority && matchesTag;
    });
  }, [tasks, selectedPriorities, selectedTags]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const togglePriority = (priority: Priority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority],
    );
  };

  const toggleTag = (tag: TaskTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = filteredTasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setActiveColumn(null);
      return;
    }

    const overId = over.id as string;

    // Check if over a column
    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn) {
      setActiveColumn(targetColumn.id);
      return;
    }

    // Check if over a task - find which column the task belongs to
    const overTask = filteredTasks.find((t) => t.id === overId);
    if (overTask) {
      setActiveColumn(overTask.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setActiveColumn(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn) {
      onMoveTask(taskId, targetColumn.id);
      return;
    }

    // Check if dropped on another task
    const overTask = filteredTasks.find((t) => t.id === overId);
    if (overTask) {
      onMoveTask(taskId, overTask.status);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Priority
                  {selectedPriorities.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      {selectedPriorities.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(["high", "medium", "low"] as Priority[]).map((p) => (
                  <DropdownMenuCheckboxItem
                    key={p}
                    checked={selectedPriorities.includes(p)}
                    onCheckedChange={() => togglePriority(p)}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          p === "high" && "bg-priority-high",
                          p === "medium" && "bg-priority-medium",
                          p === "low" && "bg-priority-low",
                        )}
                      />
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Tag
                  {selectedTags.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(["Bug", "Feature", "Improvement"] as TaskTag[]).map((t) => (
                  <DropdownMenuCheckboxItem
                    key={t}
                    checked={selectedTags.includes(t)}
                    onCheckedChange={() => toggleTag(t)}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          t === "Bug" && "bg-rose-500",
                          t === "Feature" && "bg-indigo-500",
                          t === "Improvement" && "bg-cyan-500",
                        )}
                      />
                      {t}
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {(selectedPriorities.length > 0 || selectedTags.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-muted-foreground"
                onClick={() => {
                  setSelectedPriorities([]);
                  setSelectedTags([]);
                }}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <Button onClick={onAddTask} size="sm" className="h-8">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Task
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={filteredTasks.filter((t) => t.status === column.id)}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              isHighlighted={activeColumn === column.id}
              onEditTask={onEditTask}
              onArchiveTask={onArchiveTask}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 rotate-3 scale-105">
            <TaskCard task={activeTask} onUpdate={() => {}} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
