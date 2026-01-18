import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, MessageSquare, Play, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFocus, useTasks } from "@/store/useStore";
import { cn } from "@/lib/utils";

export function FocusOverlay() {
  const { 
    isFocusModeActive, 
    activeFocusTaskId, 
    endFocusSession, 
    updateTaskTime 
  } = useFocus();
  
  const { tasks, updateTask } = useTasks();
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryNote, setSummaryNote] = useState("");

  const task = tasks.find((t) => t.id === activeFocusTaskId);

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

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocusModeActive) return;

      if (e.key === "Escape") {
        if (showSummary) {
          setShowSummary(false);
        } else {
          handleEndSession();
        }
      }
      
      if (e.code === "Space" && !showSummary) {
        e.preventDefault();
        setIsRunning(!isRunning);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusModeActive, isRunning, showSummary]);

  // Auto-start timer when focus mode starts
  useEffect(() => {
    if (isFocusModeActive) {
      setIsRunning(true);
      setElapsedTime(0);
      setShowSummary(false);
      setSummaryNote("");
    }
  }, [isFocusModeActive]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const handleEndSession = () => {
    setIsRunning(false);
    setShowSummary(true);
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
          
          <div className="absolute top-6 right-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => endFocusSession()}
              className="rounded-full hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {!showSummary ? (
            <div className="space-y-12 w-full animate-in fade-in zoom-in duration-500">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                  Focus Session
                </span>
                <h2 className="text-4xl font-bold tracking-tight text-balance">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed italic">
                    "{task.description}"
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
                  onClick={() => setIsRunning(!isRunning)}
                  className={cn(
                    "h-20 w-20 rounded-full shadow-lg transition-all duration-300",
                    !isRunning && "bg-primary hover:scale-110",
                    isRunning && "border-primary/50 text-primary hover:bg-primary/10"
                  )}
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
                  onClick={handleEndSession}
                  className="h-14 px-8 rounded-2xl font-semibold shadow-md hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Complete Task
                </Button>
              </div>
              
              <p className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-widest">
                Press <kbd className="px-1.5 py-0.5 rounded border border-border/50">Space</kbd> to pause • <kbd className="px-1.5 py-0.5 rounded border border-border/50">Esc</kbd> to end
              </p>
            </div>
          ) : (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-8 w-full py-4 animate-in fade-in duration-300"
            >
              <div className="space-y-2">
                <div className="h-16 w-16 bg-success/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-success/20">
                  <Clock className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight">Focus session ended</h3>
                <p className="text-muted-foreground">
                  You spent <span className="text-foreground font-semibold">{formatTime(elapsedTime)}</span> on this task.
                </p>
              </div>

              <div className="space-y-3 text-left">
                <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground px-1">
                  <MessageSquare className="h-4 w-4" />
                  Summary Notes (Optional)
                </label>
                <Textarea
                  placeholder="What did you accomplish during this focus session?"
                  value={summaryNote}
                  onChange={(e) => setSummaryNote(e.target.value)}
                  className="bg-white/5 border-white/10 min-h-[120px] rounded-2xl focus:ring-primary/40 resize-none text-base p-4"
                  autoFocus
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSummary(false)} 
                  className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5 transition-all"
                >
                  Back to Timer
                </Button>
                <Button 
                  onClick={handleFinish} 
                  className="flex-1 h-14 rounded-2xl bg-success hover:bg-success/90 text-white font-bold shadow-lg shadow-success/20 transition-all"
                >
                  Finish & Mark Done
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
