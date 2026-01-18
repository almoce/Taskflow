import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Clock, MessageSquare, X } from "lucide-react";

interface FocusSessionSummaryProps {
  elapsedTime: number;
  summaryNote: string;
  setSummaryNote: (note: string) => void;
  onBack: () => void;
  onFinish: () => void;
  onClose: () => void;
}

export function FocusSessionSummary({
  elapsedTime,
  summaryNote,
  setSummaryNote,
  onBack,
  onFinish,
  onClose,
}: FocusSessionSummaryProps) {
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
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

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
            You spent{" "}
            <span className="text-foreground font-semibold">{formatTime(elapsedTime)}</span>{" "}
            on this task.
          </p>
        </div>

        <div className="space-y-3 text-left">
          <label
            htmlFor="task-description-summary"
            className="text-sm font-semibold flex items-center gap-2 text-muted-foreground px-1"
          >
            <MessageSquare className="h-4 w-4" />
            Task Description
          </label>
          <Textarea
            id="task-description-summary"
            placeholder="Update your task description..."
            value={summaryNote}
            onChange={(e) => setSummaryNote(e.target.value)}
            className="bg-white/5 border-white/10 min-h-[120px] rounded-2xl focus:ring-primary/40 resize-none text-base p-4"
            autoFocus
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-white/5 transition-all"
          >
            Back to Timer
          </Button>
          <Button
            onClick={onFinish}
            className="flex-1 h-14 rounded-2xl bg-success hover:bg-success/90 text-white font-bold shadow-lg shadow-success/20 transition-all"
          >
            Finish & Mark Done
          </Button>
        </div>
      </motion.div>
    </>
  );
}
