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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-6 overflow-hidden"
      >
        <main className="relative w-full h-full p-6 z-10">
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
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
              <FocusSessionSummary
                elapsedTime={elapsedTime}
                summaryNote={summaryNote}
                setSummaryNote={setSummaryNote}
                onBack={() => setShowSummary(false)}
                onFinish={handleFinish}
                onClose={handleCloseAttempt}
              />
            </div>
          )}
        </main>

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
