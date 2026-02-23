import { format, isValid, parseISO } from "date-fns";
import { Bug, Calendar as CalendarIcon, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUmami } from "@/hooks/useUmami";
import { cn } from "@/lib/utils";
import type { Priority, Task, TaskTag } from "@/types/task";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    title: string,
    description?: string,
    priority?: Priority,
    dueDate?: string,
    tag?: TaskTag,
    startFocus?: boolean,
  ) => void;
  editTask?: Task | null;
  onEditSubmit?: (id: string, updates: Partial<Task>) => void;
}

export function NewTaskDialog({
  open,
  onOpenChange,
  onSubmit,
  editTask,
  onEditSubmit,
}: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [tag, setTag] = useState<TaskTag | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const { track } = useUmami();

  const isEditMode = !!editTask;

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset form when dialog opens
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setPriority(editTask.priority);
      setTag(editTask.tag);
      if (editTask.dueDate) {
        const parsedDate = parseISO(editTask.dueDate);
        setDueDate(isValid(parsedDate) ? parsedDate : undefined);
      } else {
        setDueDate(undefined);
      }
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setTag(undefined);
      setDueDate(undefined);
    }
  }, [editTask, open]);

  const handleSubmit = (e: React.FormEvent, startFocus = false) => {
    e.preventDefault();
    if (title.trim()) {
      if (isEditMode && onEditSubmit && editTask) {
        onEditSubmit(editTask.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          tag,
          dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
        });
      } else {
        onSubmit(
          title.trim(),
          description.trim() || undefined,
          priority,
          dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
          tag,
          startFocus,
        );
        track("task_create", { priority, tag });
      }
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate(undefined);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description (optional)</Label>
            <Textarea
              id="desc"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tag (optional)</Label>
            <div className="flex gap-2">
              {(["Bug", "Feature", "Improvement"] as TaskTag[]).map((t) => {
                const Icon = t === "Bug" ? Bug : t === "Feature" ? Zap : TrendingUp;
                return (
                  <Button
                    key={t}
                    type="button"
                    variant={tag === t ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTag(tag === t ? undefined : t)}
                    className={cn(
                      "flex-1 gap-2",
                      tag === t && t === "Bug" && "bg-rose-500 hover:bg-rose-600 text-white",
                      tag === t &&
                        t === "Feature" &&
                        "bg-indigo-500 hover:bg-indigo-600 text-white",
                      tag === t &&
                        t === "Improvement" &&
                        "bg-cyan-500 hover:bg-cyan-600 text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t}
                  </Button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {!isEditMode && (
              <Button
                type="button"
                variant="secondary"
                disabled={!title.trim()}
                onClick={(e) => handleSubmit(e as any, true)}
                className="gap-2"
              >
                <Zap className="h-4 w-4 fill-current" />
                Add & Focus
              </Button>
            )}
            <Button type="submit" disabled={!title.trim()} className="gradient-primary">
              {isEditMode ? "Save Changes" : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
