import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Task } from "@/types/task";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Archive } from "lucide-react";
import { useEffect, useState } from "react";

interface ArchiveOldTasksDialogProps {
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selectedIds: string[]) => void;
}

export function ArchiveOldTasksDialog({
  tasks,
  open,
  onOpenChange,
  onConfirm,
}: ArchiveOldTasksDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Initialize selection when dialog opens or tasks change
  useEffect(() => {
    if (open) {
      setSelectedIds(tasks.map((t) => t.id));
    }
  }, [open, tasks]);

  const toggleSelection = (taskId: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, taskId] : prev.filter((id) => id !== taskId),
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedIds);
  };

  const checkVariants = {
    initial: { pathLength: 0, opacity: 0 },
    checked: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        delay: 0.2,
        duration: 0.3, 
        ease: "easeOut" 
      }
    },
    unchecked: { 
      pathLength: 0, 
      opacity: 0,
      transition: { 
        duration: 0.2 
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Archive className="h-5 w-5 text-primary" />
            </div>
            Archive Old Tasks
          </AlertDialogTitle>
          <AlertDialogDescription>
            The following tasks were completed before this week. Select the tasks you would like to archive.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 flex items-center justify-between px-1">
          <span className="text-xs font-medium text-muted-foreground">
            {selectedIds.length} of {tasks.length} selected
          </span>
          <button
            onClick={() => {
              if (selectedIds.length === tasks.length) {
                setSelectedIds([]);
              } else {
                setSelectedIds(tasks.map((t) => t.id));
              }
            }}
            className="text-[10px] uppercase tracking-wider font-bold text-primary hover:underline"
          >
            {selectedIds.length === tasks.length ? "Deselect All" : "Select All"}
          </button>
        </div>

        <div className="h-[280px] w-full rounded-lg border bg-muted/30 my-2 relative overflow-hidden">
          <ScrollArea className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,black_40px,black_calc(100%-40px),transparent)]">
            <div className="px-4 pb-4 space-y-2 pt-4">
              {tasks.map((task) => {
                const isSelected = selectedIds.includes(task.id);
                return (
                  <motion.div 
                    key={task.id} 
                    layout
                    initial={false}
                    animate={{
                      opacity: isSelected ? 1 : 0.3,
                      scale: isSelected ? 1 : 0.98,
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 p-2.5 rounded-md border bg-card shadow-sm transition-colors hover:bg-accent/50 cursor-pointer group relative overflow-hidden"
                    onClick={() => toggleSelection(task.id, !isSelected)}
                  >
                    <div className={`
                      h-4 w-4 shrink-0 rounded-full border flex items-center justify-center transition-colors relative overflow-hidden
                      ${isSelected ? "border-primary" : "border-muted-foreground/40"}
                    `}>
                      {/* Expanding Circle Background */}
                      <motion.div
                        className="absolute inset-0 bg-primary"
                        initial={false}
                        animate={{
                          scale: isSelected ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ borderRadius: "50%" }}
                      />
                      
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                        <motion.path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary-foreground"
                          initial="initial"
                          animate={isSelected ? "checked" : "unchecked"}
                          variants={checkVariants}
                        />
                      </svg>
                    </div>
                    
                    <div className="flex-1 flex items-center gap-3 min-w-0 pointer-events-none">
                      <span className="text-sm font-medium truncate flex-1">
                        {task.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                        {task.completedAt
                          ? format(new Date(task.completedAt), "MMM d")
                          : ""}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-primary hover:bg-primary/90"
            disabled={selectedIds.length === 0}
          >
            Archive Tasks
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
