import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CheckCircle2, FileText, Play, Square, X } from "lucide-react";

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
    <div className="relative w-full h-full flex flex-col animate-in fade-in zoom-in duration-500">
      {/* Top Left: Title & Description */}
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

      {/* Top Right: Controls */}
      <div className="absolute top-0 right-0 z-20 flex flex-col items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-white/10"
          aria-label="Close timer"
        >
          <X className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleTimer}
          className={cn(
            "rounded-full transition-all duration-300 hover:bg-white/10",
            !isRunning && "text-primary",
            isRunning && "text-muted-foreground opacity-50 hover:opacity-100",
          )}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? (
            <Square className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-1" />
          )}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={onEndSession}
          className="rounded-full hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground"
          aria-label="Complete task"
        >
          <CheckCircle2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Center: Timer */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative group">
          <div className="text-[140px] leading-none font-bold tracking-tighter tabular-nums font-sans text-foreground/80">
            {formatTime(elapsedTime)}
          </div>
        </div>
      </div>

      {/* Bottom Center: Keyboard Hints */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center w-full z-20">
        <p className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-widest">
          Press <kbd className="px-1.5 py-0.5 rounded border border-border/50 bg-background/20">Space</kbd> to
          pause • <kbd className="px-1.5 py-0.5 rounded border border-border/50 bg-background/20">Esc</kbd> to end
        </p>
      </div>
    </div>
  );
}
