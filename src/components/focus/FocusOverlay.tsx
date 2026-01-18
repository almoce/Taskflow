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
import { Card } from "@/components/ui/card";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useFocus, useTasks } from "@/store/useStore";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { FocusSessionSummary } from "./FocusSessionSummary";
import { FocusTimerView } from "./FocusTimerView";

export function FocusOverlay() {
  const {
    isFocusModeActive,
    activeFocusTaskId,
    endFocusSession,
    cancelFocusSession,
    updateTaskTime,
  } = useFocus();

  const { tasks, updateTask } = useTasks();
  const task = tasks.find((t) => t.id === activeFocusTaskId);

  const {
    elapsedTime,
    isRunning,
    setIsRunning,
    showSummary,
    setShowSummary,
    summaryNote,
    setSummaryNote,
    showCancelDialog,
    setShowCancelDialog,
    handleCloseAttempt,
    handleConfirmCancel,
  } = useFocusTimer({
    isFocusModeActive,
    task,
    cancelFocusSession,
  });

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const handleFinish = () => {
    if (activeFocusTaskId) {
      // Record time
      updateTaskTime(activeFocusTaskId, elapsedTime);

      // Update status and description
      const updates: any = { status: "done" };
      if (summaryNote.trim()) {
        updates.description = summaryNote.trim();
      }
      updateTask(activeFocusTaskId, updates);

      toast.success("Task completed!", {
        description: `Focused for ${formatTime(elapsedTime)}`,
      });
    }
    endFocusSession();
  };

  if (!isFocusModeActive || !task) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl p-6 overflow-hidden"
      >
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <Card className="relative w-full max-w-2xl bg-card/40 border-border/40 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col items-center p-12 text-center">
          {!showSummary ? (
            <FocusTimerView
              taskTitle={task.title}
              taskDescription={task.description}
              elapsedTime={elapsedTime}
              isRunning={isRunning}
              onToggleTimer={() => setIsRunning(!isRunning)}
              onEndSession={() => {
                setIsRunning(false);
                setShowSummary(true);
              }}
              onClose={handleCloseAttempt}
            />
          ) : (
            <FocusSessionSummary
              elapsedTime={elapsedTime}
              summaryNote={summaryNote}
              setSummaryNote={setSummaryNote}
              onBack={() => setShowSummary(false)}
              onFinish={handleFinish}
              onClose={handleCloseAttempt}
            />
          )}
        </Card>

        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End Focus Session?</AlertDialogTitle>
              <AlertDialogDescription>
                The elapsed time for this session will be discarded, and the task status will revert to its previous state.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsRunning(true)}>Continue Session</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive hover:bg-destructive/90">
                Discard Session
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AnimatePresence>
  );
}
