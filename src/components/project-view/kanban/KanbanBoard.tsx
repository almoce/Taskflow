import { TaskCard } from "@/components/tasks/TaskCard";
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
import { useTaskSorter } from "@/hooks/useTaskSorter";
import { cn } from "@/lib/utils";
import { useFocus, useProjects, useStore, useTasks } from "@/store/useStore";
import type { Priority, Task, TaskStatus, TaskTag } from "@/types/task";
import { isTaskFromPreviousWeeks } from "@/utils/time";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Filter, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ArchiveOldTasksDialog } from "./ArchiveOldTasksDialog";
import { ColumnSortControls } from "./ColumnSortControls";

interface KanbanBoardProps {
  onAddTask: () => void;
  onEditTask?: (task: Task) => void;
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
  onStartFocus?: () => void;
}

function SortableTask({
  task,
  onUpdate,
  onDelete,
  onEdit,
  onArchive,
  onStartFocus,
}: SortableTaskProps) {
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
        onStartFocus={onStartFocus}
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
  onStartFocus?: (taskId: string) => void;
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
  onStartFocus,
  isHighlighted,
}: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  const columnSort = useStore((state) => state.columnSorts[id]);
  const sortedTasks = useTaskSorter(tasks, columnSort?.criteria, columnSort?.direction);
  const isSortingActive = !!columnSort;

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        <span className="text-xs text-muted-foreground mr-auto">{tasks.length}</span>

        <ColumnSortControls columnId={id} />
      </div>

      <SortableContext
        id={id}
        items={isSortingActive ? [] : sortedTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            "flex-1 space-y-2 min-h-[120px] p-2 rounded-lg bg-secondary/30 border border-border/50 transition-colors",
            isHighlighted && "bg-primary/10 border-primary/50",
          )}
        >
          {sortedTasks.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-24 text-xs text-muted-foreground">
              {isHighlighted ? "Drop here" : "No tasks"}
            </div>
          ) : (
            sortedTasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                onUpdate={(updates) => onUpdateTask(task.id, updates)}
                onDelete={() => onDeleteTask(task.id)}
                onEdit={onEditTask ? () => onEditTask(task) : undefined}
                onArchive={onArchiveTask ? () => onArchiveTask(task.id) : undefined}
                onStartFocus={onStartFocus ? () => onStartFocus(task.id) : undefined}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ onAddTask, onEditTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<TaskStatus | null>(null);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedTags, setSelectedTags] = useState<TaskTag[]>([]);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isArchiveHovered, setIsArchiveHovered] = useState(false);

  // Store Hooks
  const { selectedProjectId } = useProjects();
  const { tasks, updateTask, deleteTask, moveTask, archiveTask, bulkArchiveTasks } = useTasks();
  const { startFocusSession } = useFocus();

  const projectTasks = useMemo(
    () => (selectedProjectId ? tasks.filter((t) => t.projectId === selectedProjectId) : []),
    [tasks, selectedProjectId],
  );

  const oldDoneTasks = useMemo(
    () => projectTasks.filter((t) => t.status === "done" && isTaskFromPreviousWeeks(t)),
    [projectTasks],
  );

  const filteredTasks = useMemo(() => {
    return projectTasks.filter((task) => {
      const matchesPriority =
        selectedPriorities.length === 0 || selectedPriorities.includes(task.priority);
      const matchesTag = selectedTags.length === 0 || (task.tag && selectedTags.includes(task.tag));
      return matchesPriority && matchesTag;
    });
  }, [projectTasks, selectedPriorities, selectedTags]);

  const handleArchiveOldTasks = (selectedIds: string[]) => {
    bulkArchiveTasks(selectedIds);
    setIsArchiveDialogOpen(false);
  };

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
      moveTask(taskId, targetColumn.id);
      return;
    }

    // Check if dropped on another task
    const overTask = filteredTasks.find((t) => t.id === overId);
    if (overTask) {
      moveTask(taskId, overTask.status);
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

          <div className="flex items-center gap-2">
            {oldDoneTasks.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:border-primary transition-all duration-400 relative"
                onClick={() => setIsArchiveDialogOpen(true)}
                onMouseEnter={() => setIsArchiveHovered(true)}
                onMouseLeave={() => setIsArchiveHovered(false)}
              >
                <Archive className="h-4 w-4" />
                <AnimatePresence>
                  {isArchiveHovered && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      // transition={{ duration: 0.2 }}
                      transition={{ type: "spring", stiffness: 460, damping: 20 }}
                      className="absolute -top-1.5 -right-1.5"
                    >
                      <Badge className="h-4 min-w-4 px-1 flex items-center justify-center text-[9px] font-bold bg-primary text-primary-foreground border-2 border-background pointer-events-none">
                        {oldDoneTasks.length}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            )}

            <Button onClick={onAddTask} size="sm" className="h-8">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={filteredTasks.filter((t) => t.status === column.id)}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              isHighlighted={activeColumn === column.id}
              onEditTask={onEditTask}
              onArchiveTask={archiveTask}
              onStartFocus={startFocusSession}
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

      <ArchiveOldTasksDialog
        open={isArchiveDialogOpen}
        onOpenChange={setIsArchiveDialogOpen}
        tasks={oldDoneTasks}
        onConfirm={handleArchiveOldTasks}
      />
    </DndContext>
  );
}
