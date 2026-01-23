import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Coffee, FileText, Play, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { normalizeTime, parseTime } from "@/utils/time";

interface FocusTimerViewProps {
  taskTitle: string;
  taskDescription?: string;
  elapsedTime: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onEndSession: () => void;
  onBreak: () => void;
  onClose: () => void;

  // Editing props
  isEditing?: boolean;
  editedTime?: number;
  onTimeEdit?: (newTime: number) => void;
  showConfirmResume?: boolean;
  onConfirmResume?: () => void;
  onCancelResume?: () => void;
}

function TimerDigit({ value, isEditable }: { value: string; isEditable?: boolean }) {
  const isNumber = /^[0-9]$/.test(value);

  return (
    <div
      className={cn(
        "relative h-[1em] flex justify-center overflow-hidden transition-colors rounded-sm",
        isNumber ? "w-[0.65em]" : "w-[0.2em]",
        isEditable && isNumber && "hover:bg-muted/20 cursor-text",
      )}
    >
      {isNumber ? (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: "100%", opacity: 0, filter: "blur(5px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-100%", opacity: 0, filter: "blur(5px)" }}
            transition={{
              y: { type: "spring", stiffness: 200, damping: 25, mass: 0.8 },
              opacity: { duration: 0.2 },
              filter: { duration: 0.2 },
            }}
            className="absolute inset-0 flex items-center justify-center text-foreground/80"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="flex items-center justify-center text-foreground/80 pb-[0.1em]">
          {value}
        </span>
      )}
    </div>
  );
}

interface EditableGroupProps {
  value: number;
  onChange: (value: number) => void;
  isEditable: boolean;
  activeIndex: number | null;
  onActiveIndexChange: (index: number | null) => void;
  onExitNext?: () => void;
  onExitPrev?: () => void;
}

function EditableGroup({
  value,
  onChange,
  isEditable,
  activeIndex,
  onActiveIndexChange,
  onExitNext,
  onExitPrev,
}: EditableGroupProps) {
  const [digits, setDigits] = useState(value.toString().padStart(2, "0").split(""));

  // Sync with prop value if not editing active digit in THIS group
  useEffect(() => {
    if (activeIndex === null) {
      setDigits(value.toString().padStart(2, "0").split(""));
    }
  }, [value, activeIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;

      if (
        (e.key >= "0" && e.key <= "9") ||
        e.key === "Backspace" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key >= "0" && e.key <= "9") {
        const newDigits = [...digits];
        newDigits[activeIndex] = e.key;

        const newValue = parseInt(newDigits.join(""), 10);
        onChange(newValue);
        setDigits(newDigits);

        // Auto-advance
        if (activeIndex < digits.length - 1) {
          onActiveIndexChange(activeIndex + 1);
        } else {
          onActiveIndexChange(null);
          onExitNext?.();
        }
      } else if (e.key === "Backspace") {
        if (activeIndex > 0) {
          onActiveIndexChange(activeIndex - 1);
        } else {
          onActiveIndexChange(null);
          onExitPrev?.();
        }
      } else if (e.key === "ArrowLeft") {
        if (activeIndex > 0) {
          onActiveIndexChange(activeIndex - 1);
        } else {
          onActiveIndexChange(null);
          onExitPrev?.();
        }
      } else if (e.key === "ArrowRight") {
        if (activeIndex < digits.length - 1) {
          onActiveIndexChange(activeIndex + 1);
        } else {
          onActiveIndexChange(null);
          onExitNext?.();
        }
      } else if (e.key === "Escape" || e.key === "Enter") {
        onActiveIndexChange(null);
      }
    };

    if (activeIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, digits, onChange, onActiveIndexChange, onExitNext, onExitPrev]);

  return (
    <div className="flex items-center justify-center cursor-default">
      {digits.map((d, i) => (
        <div
          key={i}
          onClick={(e) => {
            if (isEditable) {
              e.stopPropagation();
              onActiveIndexChange(i);
            }
          }}
          className={cn(
            "relative transition-colors rounded-sm",
            activeIndex === i && "bg-muted/30",
          )}
        >
          <TimerDigit value={d} isEditable={isEditable} />
          {isEditable && activeIndex === i && (
            <motion.div
              layoutId="active-digit-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </div>
      ))}
    </div>
  );
}

type TimeUnit = "hours" | "minutes" | "seconds";
type FocusPath = { unit: TimeUnit; index: number } | null;

export function FocusTimerView({
  taskTitle,
  taskDescription,
  elapsedTime,
  isRunning,
  onToggleTimer,
  onEndSession,
  onBreak,
  onClose,

  isEditing = false,
  editedTime = 0,
  onTimeEdit,
  showConfirmResume = false,
  onConfirmResume,
  onCancelResume,
}: FocusTimerViewProps) {
  const displayTime = !isRunning && typeof editedTime === "number" ? editedTime : elapsedTime;
  const { hours, minutes, seconds } = parseTime(displayTime);

  const [activeFocus, setActiveFocus] = useState<FocusPath>(null);

  // Reset focus when edit mode disabled
  useEffect(() => {
    if (isRunning) {
      setActiveFocus(null);
    }
  }, [isRunning]);

  const handleGroupChange = (unit: TimeUnit, val: number) => {
    if (!onTimeEdit) return;

    let newH = hours;
    let newM = minutes;
    let newS = seconds;

    if (unit === "hours") newH = val;
    if (unit === "minutes") newM = val;
    if (unit === "seconds") newS = val;

    onTimeEdit(normalizeTime(newH, newM, newS));
  };

  return (
    <div
      className="relative w-full h-full flex flex-col animate-in fade-in zoom-in duration-500"
      onClick={() => setActiveFocus(null)}
    >
      <div className="absolute top-0 left-0 max-w-md text-left z-20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-start gap-2 cursor-help group">
                <FileText className="h-5 w-5 shrink-0 text-muted-foreground/50 group-hover:text-foreground transition-colors mt-1" />
                <h2 className="text-xl font-medium tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
                  {taskTitle}
                </h2>
              </div>
            </TooltipTrigger>
            {taskDescription && (
              <TooltipContent side="bottom" align="start" className="max-w-xs">
                <p>{taskDescription}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="absolute top-0 right-0 z-20 flex flex-col items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
                aria-label="Discard session"
              >
                <X className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Discard session</p>
            </TooltipContent>
          </Tooltip>

          <Popover
            open={showConfirmResume}
            onOpenChange={(open) => {
              if (!open && onCancelResume) onCancelResume();
            }}
          >
            <PopoverTrigger asChild>
              <div className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onToggleTimer}
                      className={cn(
                        "rounded-full transition-all duration-300 hover:bg-white/10 text-muted-foreground hover:text-foreground",
                      )}
                      aria-label={isRunning ? "Pause timer" : "Start timer"}
                    >
                      {isRunning ? (
                        <Square className="h-4 w-4 fill-current" />
                      ) : (
                        <Play className="h-5 w-5 fill-current ml-1" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  {!showConfirmResume && (
                    <TooltipContent side="left">
                      <p>{isRunning ? "Pause timer" : "Start timer"}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </PopoverTrigger>
            <PopoverContent
              side="left"
              sideOffset={10}
              className="w-auto p-2 z-[150] bg-background/95 backdrop-blur-sm border-border/50 shadow-xl"
            >
              <div className="flex items-center gap-3 px-1">
                <p className="text-[11px] font-medium text-muted-foreground whitespace-nowrap uppercase tracking-wider">
                  Update time?
                </p>
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[11px] hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    onClick={onCancelResume}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 px-2 text-[11px] bg-primary/90 hover:bg-primary shadow-none"
                    onClick={onConfirmResume}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={onBreak}
                className="rounded-full hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
                aria-label="Take a break"
              >
                <Coffee className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Take a break</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={onEndSession}
                className="rounded-full hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
                aria-label="Complete task"
              >
                <CheckCircle2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Complete task</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative group flex items-center justify-center text-[140px] leading-none font-bold tracking-tighter tabular-nums font-sans">
          <EditableGroup
            value={hours}
            onChange={(v) => handleGroupChange("hours", v)}
            isEditable={!isRunning}
            activeIndex={activeFocus?.unit === "hours" ? activeFocus.index : null}
            onActiveIndexChange={(i) =>
              setActiveFocus(i !== null ? { unit: "hours", index: i } : null)
            }
            onExitNext={() => setActiveFocus({ unit: "minutes", index: 0 })}
          />

          <div className="relative h-[1em] flex justify-center overflow-hidden w-[0.2em]">
            <span className="flex items-center justify-center text-foreground/80 pb-[0.1em]">
              :
            </span>
          </div>

          <EditableGroup
            value={minutes}
            onChange={(v) => handleGroupChange("minutes", v)}
            isEditable={!isRunning}
            activeIndex={activeFocus?.unit === "minutes" ? activeFocus.index : null}
            onActiveIndexChange={(i) =>
              setActiveFocus(i !== null ? { unit: "minutes", index: i } : null)
            }
            onExitNext={() => setActiveFocus({ unit: "seconds", index: 0 })}
            onExitPrev={() => setActiveFocus({ unit: "hours", index: 1 })}
          />

          <div className="relative h-[1em] flex justify-center overflow-hidden w-[0.2em]">
            <span className="flex items-center justify-center text-foreground/80 pb-[0.1em]">
              :
            </span>
          </div>

          <EditableGroup
            value={seconds}
            onChange={(v) => handleGroupChange("seconds", v)}
            isEditable={!isRunning}
            activeIndex={activeFocus?.unit === "seconds" ? activeFocus.index : null}
            onActiveIndexChange={(i) =>
              setActiveFocus(i !== null ? { unit: "seconds", index: i } : null)
            }
            onExitPrev={() => setActiveFocus({ unit: "minutes", index: 1 })}
          />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center w-full z-20">
        <p className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-widest">
          {!isRunning && <span className="mr-2">Click digits to edit •</span>}
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-border/50 bg-background/20">
            Space
          </kbd>{" "}
          to
          {isRunning ? " pause" : " resume"} •{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-border/50 bg-background/20">Esc</kbd>{" "}
          to {isRunning ? "end" : "discard"}
        </p>
      </div>
    </div>
  );
}
