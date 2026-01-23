import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFocus, useProjects, useTasks } from "@/store/useStore";
import type { Task } from "@/types/task";

interface CalendarViewProps {
  onAddTask?: () => void;
}

interface DraggableTaskProps {
  task: Task;
  children: React.ReactNode;
}

function DraggableTask({ task, children }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }
    : { cursor: "grab" };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

interface DroppableDayProps {
  day: Date;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

function DroppableDay({ day, children, className, isActive }: DroppableDayProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: format(day, "yyyy-MM-dd"),
    data: { day },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        isOver && "bg-primary/10 ring-2 ring-primary/50",
        isActive && !isOver && "bg-muted/50",
      )}
    >
      {children}
    </div>
  );
}

export function CalendarView({ onAddTask }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Store Hooks
  const { selectedProjectId } = useProjects();
  const { tasks: allTasks, updateTask, deleteTask, archiveTask } = useTasks();
  const { startFocusSession } = useFocus();

  const tasks = useMemo(
    () => (selectedProjectId ? allTasks.filter((t) => t.projectId === selectedProjectId) : []),
    [allTasks, selectedProjectId],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), day);
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const dropId = over.id as string;

    // Parse the drop target date
    const dropDate = new Date(dropId);
    if (!Number.isNaN(dropDate.getTime())) {
      updateTask(taskId, { dueDate: dropId });
    } else if (dropId === "unscheduled") {
      updateTask(taskId, { dueDate: undefined });
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Droppable Unscheduled Area
  function UnscheduledDropZone({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    const { setNodeRef, isOver } = useDroppable({
      id: "unscheduled",
    });

    return (
      <div
        ref={setNodeRef}
        className={cn(
          "rounded-xl transition-all duration-200 border-2 border-transparent",
          className,
          isOver && "border-primary/30 bg-primary/5 shadow-inner",
        )}
      >
        <div
          className={cn(
            "h-full w-full transition-transform duration-200",
            isOver && "scale-[0.98]",
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </Button>
              {onAddTask && (
                <Button onClick={onAddTask} size="sm" className="h-8">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Task
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Week day headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                const dayTasks = getTasksForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isCurrentDay = isToday(day);

                return (
                  <DroppableDay
                    key={day.toISOString()}
                    day={day}
                    isActive={!!activeTask}
                    className={cn(
                      "min-h-[120px] border-b border-r border-border p-2 transition-colors",
                      !isCurrentMonth && "bg-muted/30",
                      index % 7 === 6 && "border-r-0",
                      index >= days.length - 7 && "border-b-0",
                    )}
                  >
                    <div
                      className={cn(
                        "text-sm font-medium mb-2 w-7 h-7 flex items-center justify-center rounded-full",
                        !isCurrentMonth && "text-muted-foreground",
                        isCurrentDay && "bg-primary text-primary-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <DraggableTask key={task.id} task={task}>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className={cn(
                                  "w-full text-left text-xs px-2 py-1 rounded truncate transition-all",
                                  task.status === "done" && "opacity-50 line-through",
                                  task.priority === "high" &&
                                    "bg-priority-high/20 text-priority-high",
                                  task.priority === "medium" &&
                                    "bg-priority-medium/20 text-priority-medium",
                                  task.priority === "low" && "bg-priority-low/20 text-priority-low",
                                )}
                                onClick={() =>
                                  updateTask(task.id, {
                                    status: task.status === "done" ? "todo" : "done",
                                  })
                                }
                              >
                                {task.title}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="origin-bottom max-w-[300px] data-[state=delayed-open]:animate-fade-in data-[state=closed]:animate-fade-out animation-duration-500"
                            >
                              <p className="font-medium">{task.title}</p>
                              {task.description && (
                                <p className="text-xs text-muted-foreground mt-1 whitespace-normal">
                                  {task.description}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </DraggableTask>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-muted-foreground px-2">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </DroppableDay>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tasks without due dates */}
        <div className="lg:col-span-1 lg:border-l lg:border-border/50 lg:pl-6">
          <div className="flex flex-col h-full space-y-3 sticky top-6">
            <h3 className="text-sm font-medium text-muted-foreground px-2">
              Unscheduled ({tasks.filter((t) => !t.dueDate).length})
            </h3>
            <UnscheduledDropZone className="flex-1 min-h-[300px]">
              <div className="p-2 space-y-3">
                {tasks.filter((t) => !t.dueDate).length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {tasks
                      .filter((t) => !t.dueDate)
                      .map((task) => (
                        <DraggableTask key={task.id} task={task}>
                          <TaskCard
                            task={task}
                            onUpdate={(updates) => updateTask(task.id, updates)}
                            onDelete={() => deleteTask(task.id)}
                            onArchive={() => archiveTask(task.id)}
                            onStartFocus={
                              startFocusSession ? () => startFocusSession(task.id) : undefined
                            }
                          />
                        </DraggableTask>
                      ))}
                  </div>
                ) : (
                  <div className="h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-lg p-6 text-center text-muted-foreground text-sm">
                    <Plus className="h-8 w-8 mb-2 opacity-20" />
                    <p>Drag tasks here to unschedule</p>
                  </div>
                )}
              </div>
            </UnscheduledDropZone>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="cursor-grabbing">
            {activeTask.dueDate ? (
              <div className="opacity-90 rotate-2 scale-105 shadow-lg">
                <div
                  className={cn(
                    "text-xs px-2 py-1 rounded truncate w-[140px]",
                    activeTask.status === "done" && "opacity-50 line-through",
                    activeTask.priority === "high" && "bg-priority-high/20 text-priority-high",
                    activeTask.priority === "medium" &&
                      "bg-priority-medium/20 text-priority-medium",
                    activeTask.priority === "low" && "bg-priority-low/20 text-priority-low",
                  )}
                >
                  {activeTask.title}
                </div>
              </div>
            ) : (
              <div className="opacity-90 rotate-1 scale-105 shadow-xl w-[280px]">
                <TaskCard task={activeTask} onUpdate={() => {}} onDelete={() => {}} />
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
