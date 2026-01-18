import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Play, Square, X } from "lucide-react";

interface FocusTimerViewProps {
  taskTitle: string;
  taskDescription?: string;
  elapsedTime: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onEndSession: () => void;
  onClose: () => void;
}

export function FocusTimerView({
  taskTitle,
  taskDescription,
  elapsedTime,
  isRunning,
  onToggleTimer,
  onEndSession,
  onClose,
}: FocusTimerViewProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <>
      <div className="absolute top-6 right-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-white/10"
          aria-label="Close timer"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-12 w-full animate-in fade-in zoom-in duration-500">
        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            Focus Session
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-balance">{taskTitle}</h2>
          {taskDescription && (
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed italic">
              "{taskDescription}"
            </p>
          )}
        </div>

        <div className="relative group">
          <div className="text-8xl font-black tracking-tighter tabular-nums font-mono">
            {formatTime(elapsedTime)}
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-50">
            Time Elapsed
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 pt-8">
          <Button
            size="xl"
            variant={isRunning ? "outline" : "default"}
            onClick={onToggleTimer}
            className={cn(
              "h-20 w-20 rounded-full shadow-lg transition-all duration-300",
              !isRunning && "bg-primary hover:scale-110",
              isRunning && "border-primary/50 text-primary hover:bg-primary/10",
            )}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
          >
            {isRunning ? (
              <Square className="h-8 w-8 fill-current" />
            ) : (
              <Play className="h-8 w-8 fill-current ml-1" />
            )}
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={onEndSession}
            className="h-14 px-8 rounded-2xl font-semibold shadow-md hover:translate-y-[-2px] active:translate-y-0 transition-all"
            aria-label="Complete task"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Complete Task
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-widest">
          Press <kbd className="px-1.5 py-0.5 rounded border border-border/50">Space</kbd> to
          pause • <kbd className="px-1.5 py-0.5 rounded border border-border/50">Esc</kbd> to end
        </p>
      </div>
    </>
  );
}
