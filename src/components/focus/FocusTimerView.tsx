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
        <div className="space-y-6">
          <h2 className="text-3xl font-medium tracking-tight text-balance text-foreground/90">{taskTitle}</h2>
          {taskDescription && (
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              {taskDescription}
            </p>
          )}
        </div>

        <div className="relative group">
          <div className="text-[120px] leading-none font-bold tracking-tighter tabular-nums font-sans text-foreground/80">
            {formatTime(elapsedTime)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 pt-4">
          <Button
            size="xl"
            variant="ghost"
            onClick={onToggleTimer}
            className={cn(
              "h-24 w-24 rounded-full transition-all duration-300 hover:bg-muted/50",
              !isRunning && "text-primary",
              isRunning && "text-muted-foreground opacity-50 hover:opacity-100",
            )}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
          >
            {isRunning ? (
              <Square className="h-10 w-10 fill-current" />
            ) : (
              <Play className="h-12 w-12 fill-current ml-2" />
            )}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onEndSession}
            className="h-12 px-6 rounded-full border-border/50 hover:border-border hover:bg-muted/50 font-normal transition-all"
            aria-label="Complete task"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Complete
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
