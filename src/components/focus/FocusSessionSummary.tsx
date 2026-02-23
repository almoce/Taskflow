import { m } from "framer-motion";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

      <m.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-8 w-full py-4 animate-in fade-in duration-300"
      >
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <Clock className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-2xl font-medium tracking-tight">Session Complete</h3>
          <p className="text-muted-foreground text-lg">
            Time focused:{" "}
            <span className="text-foreground font-semibold">{formatTime(elapsedTime)}</span>
          </p>
        </div>

        <div className="space-y-3 text-left w-full max-w-md mx-auto">
          <Textarea
            id="task-description-summary"
            placeholder="Add a note about what you accomplished..."
            value={summaryNote}
            onChange={(e) => setSummaryNote(e.target.value)}
            className="bg-transparent border-border/50 min-h-[100px] rounded-xl focus:ring-0 focus:border-foreground/30 resize-none text-base p-4"
          />
        </div>

        <div className="flex gap-4 pt-8 w-full max-w-sm mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex-1 h-12 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
          >
            Back
          </Button>
          <Button
            onClick={onFinish}
            className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-none hover:-translate-y-px transition-all"
          >
            Finish
          </Button>
        </div>
      </m.div>
    </>
  );
}
