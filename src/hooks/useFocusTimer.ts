import { useEffect, useState } from "react";

interface UseFocusTimerProps {
  isFocusModeActive: boolean;
  task: { id: string; description?: string } | undefined;
  cancelFocusSession: () => void;
}

export function useFocusTimer({
  isFocusModeActive,
  task,
  cancelFocusSession,
}: UseFocusTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryNote, setSummaryNote] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && isFocusModeActive) {
      interval = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isFocusModeActive]);

  const handleCloseAttempt = () => {
    if (elapsedTime > 0) {
      setIsRunning(false);
      setShowCancelDialog(true);
    } else {
      cancelFocusSession();
    }
  };

  const handleConfirmCancel = () => {
    cancelFocusSession();
    setShowCancelDialog(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocusModeActive) return;

      if (e.key === "Escape") {
        if (showSummary) {
          setShowSummary(false);
        } else if (showCancelDialog) {
          setShowCancelDialog(false);
        } else {
          handleCloseAttempt();
        }
      }

      if (e.code === "Space" && !showSummary && !showCancelDialog) {
        // Only toggle if not typing in an input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusModeActive, showSummary, showCancelDialog, elapsedTime]);

  // Auto-start timer when focus mode starts
  useEffect(() => {
    if (isFocusModeActive && task) {
      setIsRunning(true);
      setElapsedTime(0);
      setShowSummary(false);
      setSummaryNote(task.description || "");
      setShowCancelDialog(false);
    }
  }, [isFocusModeActive, task]);

  // Browser navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFocusModeActive && !showSummary) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFocusModeActive, showSummary]);

  return {
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
  };
}
