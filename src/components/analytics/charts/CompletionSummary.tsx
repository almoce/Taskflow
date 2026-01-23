import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@/types/task";

interface CompletionSummaryProps {
  tasks: Task[];
}

export function CompletionSummary({ tasks }: CompletionSummaryProps) {
  const totalCompleted = tasks.filter((t) => t.status === "done").length;
  const completionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Overall Completion Rate</p>
            <p className="text-3xl font-bold">{completionRate}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="text-3xl font-bold">{tasks.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-emerald-500">{totalCompleted}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
