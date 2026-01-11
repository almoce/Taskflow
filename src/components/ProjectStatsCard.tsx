import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useProjectStats } from "@/hooks/useProjectStats";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface ProjectStatsCardProps {
  projectId: string;
  projectName: string;
  projectIcon?: string;
  projectColor: string;
}

export function ProjectStatsCard({
  projectId,
  projectName,
  projectIcon,
  projectColor,
}: ProjectStatsCardProps) {
  const stats = useProjectStats(projectId);

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/50 overflow-hidden relative group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div 
        className="absolute top-0 left-0 w-1 h-full" 
        style={{ backgroundColor: projectColor }}
      />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {projectIcon && (
              <span className="text-2xl" role="img" aria-label="Project icon">
                {projectIcon}
              </span>
            )}
            <CardTitle className="text-xl font-bold tracking-tight">
              {projectName}
            </CardTitle>
          </div>
          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
            {stats.progress}% Complete
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Overall Progress</span>
            <span>{stats.done} / {stats.total} Tasks</span>
          </div>
          <Progress 
            value={stats.progress} 
            className="h-2" 
            style={{ "--progress-foreground": projectColor } as React.CSSProperties}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 rounded-xl bg-background/40 border border-border/40 transition-colors hover:bg-background/60">
            <Circle className="w-4 h-4 text-muted-foreground mb-2" />
            <span className="text-lg font-bold">{stats.todo}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">To Do</span>
          </div>
          
          <div className="flex flex-col items-center p-3 rounded-xl bg-background/40 border border-border/40 transition-colors hover:bg-background/60">
            <Clock className="w-4 h-4 text-primary mb-2" />
            <span className="text-lg font-bold">{stats.inProgress}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Doing</span>
          </div>
          
          <div className="flex flex-col items-center p-3 rounded-xl bg-background/40 border border-border/40 transition-colors hover:bg-background/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-2" />
            <span className="text-lg font-bold">{stats.done}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Done</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
