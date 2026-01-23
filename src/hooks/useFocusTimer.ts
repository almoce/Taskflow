import { useEffect, useRef, useState } from "react";

interface UseFocusTimerProps {
  isFocusModeActive: boolean;
  task: { id: string; description?: string } | undefined;
  cancelFocusSession: () => void;
  initialTime?: number;
}

export function useFocusTimer({
  isFocusModeActive,
  task,
  cancelFocusSession,
  initialTime = 0,
}: UseFocusTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryNote, setSummaryNote] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Timer Refs for accurate tracking
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(initialTime);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedTime, setEditedTime] = useState(initialTime);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmResume, setShowConfirmResume] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && isFocusModeActive) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      interval = window.setInterval(() => {
        const now = Date.now();
        const total = accumulatedTimeRef.current + (now - (startTimeRef.current || now));
        setElapsedTime(total);
      }, 1000);
    } else {
      // Pause
      if (startTimeRef.current) {
        const now = Date.now();
        const delta = now - startTimeRef.current;
        accumulatedTimeRef.current += delta;
        startTimeRef.current = null;
      }
    }

    return () => {
      clearInterval(interval);
      // Cleanup handled by pause logic above if unmounting while running?
      // Actually, if we unmount, we lose the ref state anyway.
      // But clearing interval stops updates.
    };
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

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (isDirty) {
        setShowConfirmResume(true);
      } else {
        setIsRunning(true);
      }
    }
  };

  const confirmTimeUpdate = () => {
    // Update accumulated time to the new edited time
    accumulatedTimeRef.current = editedTime;
    setElapsedTime(editedTime);

    // Resume
    startTimeRef.current = Date.now();

    setIsDirty(false);
    setIsEditing(false);
    setShowConfirmResume(false);
    setIsRunning(true);
  };

  const cancelTimeUpdate = () => {
    setShowConfirmResume(false);
    // Keep timer paused
  };

  const handleTimeEdit = (newTime: number) => {
    setEditedTime(newTime);
    setIsDirty(true);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocusModeActive) return;

      // Don't intercept global keys if we are editing text (like inputs)
      // Exception: We might want Escape to cancel editing
      const isInput =
        e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      if (e.key === "Escape") {
        if (showSummary) {
          setShowSummary(false);
        } else if (showCancelDialog) {
          setShowCancelDialog(false);
        } else if (showConfirmResume) {
          setShowConfirmResume(false);
        } else if (isEditing) {
          setIsEditing(false);
          // Optional: Reset edited time?
        } else {
          handleCloseAttempt();
        }
      }

      if (
        e.code === "Space" &&
        !showSummary &&
        !showCancelDialog &&
        !showConfirmResume &&
        !isEditing
      ) {
        if (isInput) return;

        e.preventDefault();
        toggleTimer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isFocusModeActive,
    showSummary,
    showCancelDialog,
    showConfirmResume,
    isEditing,
    handleCloseAttempt,
    toggleTimer,
  ]);

  // Auto-start timer when focus mode starts
  useEffect(() => {
    if (isFocusModeActive && task) {
      setIsRunning(true);
      setElapsedTime(initialTime);
      accumulatedTimeRef.current = initialTime; // Reset accumulator
      startTimeRef.current = null; // Will be set by timer effect

      setEditedTime(initialTime);
      setIsDirty(false);
      setShowSummary(false);
      setSummaryNote(task.description || "");
      setShowCancelDialog(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocusModeActive, task?.id, task, initialTime]);

  // Sync editedTime with elapsedTime when running
  useEffect(() => {
    if (isRunning) {
      setEditedTime(elapsedTime);
      setIsDirty(false);
    }
  }, [elapsedTime, isRunning]);

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
    setIsRunning, // Kept for compatibility but toggleTimer is preferred for UI
    toggleTimer,
    showSummary,
    setShowSummary,
    summaryNote,
    setSummaryNote,
    showCancelDialog,
    setShowCancelDialog,
    handleCloseAttempt,
    handleConfirmCancel,

    // New Editing Props
    isEditing,
    setIsEditing,
    editedTime,
    handleTimeEdit,
    isDirty,
    showConfirmResume,
    confirmTimeUpdate,
    cancelTimeUpdate,
  };
}
