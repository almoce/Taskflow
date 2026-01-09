import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import { Task, Project } from '@/types/task';
import { cn } from '@/lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';

interface CalendarViewProps {
  project: Project;
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
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
        cursor: 'grab',
      }
    : { cursor: 'grab' };

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
    id: format(day, 'yyyy-MM-dd'),
    data: { day },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        isOver && 'bg-primary/10 ring-2 ring-primary/50',
        isActive && !isOver && 'bg-muted/50'
      )}
    >
      {children}
    </div>
  );
}

export function CalendarView({ project, tasks, onUpdateTask, onDeleteTask, onAddTask }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), day);
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
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
    if (!isNaN(dropDate.getTime())) {
      onUpdateTask(taskId, { dueDate: dropId });
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {project.icon ? (
              <span className="text-lg">{project.icon}</span>
            ) : (
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: project.color }}
              />
            )}
            <h2 className="text-xl font-semibold">{project.name}</h2>
          </div>
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
              {format(currentMonth, 'MMMM yyyy')}
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
            {weekDays.map(day => (
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
                    'min-h-[120px] border-b border-r border-border p-2 transition-colors',
                    !isCurrentMonth && 'bg-muted/30',
                    index % 7 === 6 && 'border-r-0',
                    index >= days.length - 7 && 'border-b-0'
                  )}
                >
                  <div
                    className={cn(
                      'text-sm font-medium mb-2 w-7 h-7 flex items-center justify-center rounded-full',
                      !isCurrentMonth && 'text-muted-foreground',
                      isCurrentDay && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => (
                      <DraggableTask key={task.id} task={task}>
                        <div
                          className={cn(
                            'text-xs px-2 py-1 rounded truncate transition-all',
                            task.status === 'done' && 'opacity-50 line-through',
                            task.priority === 'high' && 'bg-[hsl(var(--priority-high)/0.2)] text-[hsl(var(--priority-high))]',
                            task.priority === 'medium' && 'bg-[hsl(var(--priority-medium)/0.2)] text-[hsl(var(--priority-medium))]',
                            task.priority === 'low' && 'bg-[hsl(var(--priority-low)/0.2)] text-[hsl(var(--priority-low))]'
                          )}
                          onClick={() => onUpdateTask(task.id, { 
                            status: task.status === 'done' ? 'todo' : 'done' 
                          })}
                          title={`${task.title} - Drag to reschedule`}
                        >
                          {task.title}
                        </div>
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

        {/* Tasks without due dates */}
        {tasks.filter(t => !t.dueDate).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Tasks without due date - drag to calendar to schedule ({tasks.filter(t => !t.dueDate).length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tasks.filter(t => !t.dueDate).map(task => (
                <DraggableTask key={task.id} task={task}>
                  <TaskCard
                    task={task}
                    onUpdate={(updates) => onUpdateTask(task.id, updates)}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                </DraggableTask>
              ))}
            </div>
          </div>
        )}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 rotate-2 scale-105 shadow-lg">
            <div
              className={cn(
                'text-xs px-3 py-2 rounded bg-card border border-border',
                activeTask.priority === 'high' && 'border-[hsl(var(--priority-high))]',
                activeTask.priority === 'medium' && 'border-[hsl(var(--priority-medium))]',
                activeTask.priority === 'low' && 'border-[hsl(var(--priority-low))]'
              )}
            >
              {activeTask.title}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
