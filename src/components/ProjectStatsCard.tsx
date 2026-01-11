import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProjectStats } from "@/hooks/useProjectStats";
import { ListTodo } from "lucide-react";

interface ProjectStatsCardProps {
  projectId: string;
  projectColor: string;
}

export function ProjectStatsCard({
  projectId,
  projectColor,
}: ProjectStatsCardProps) {
  const stats = useProjectStats(projectId);

  return (
    <Card className="bg-card/40 backdrop-blur-md border-border/40 overflow-hidden h-full">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ListTodo className="w-3 h-3" />
            <span>Current Status</span>
          </div>
          <span className="text-foreground">{stats.progress}% Complete</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-2">
        <div className="space-y-3">
          <Progress 
            value={stats.progress} 
            className="h-1.5 bg-muted/30" 
            style={{ "--progress-foreground": projectColor } as React.CSSProperties}
          />

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center p-1.5 rounded-md bg-background/20 border border-border/10">
              <span className="text-sm font-bold">{stats.todo}</span>
              <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">To Do</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-1.5 rounded-md bg-background/20 border border-border/10">
              <span className="text-sm font-bold">{stats.inProgress}</span>
              <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Doing</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-1.5 rounded-md bg-background/20 border border-border/10">
              <span className="text-sm font-bold text-emerald-500/90">{stats.done}</span>
              <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Done</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}