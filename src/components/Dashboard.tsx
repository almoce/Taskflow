import { FolderKanban, CheckCircle2, Clock, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  stats: {
    totalProjects: number;
    totalTasks: number;
    completedToday: number;
    overdue: number;
  };
  onNewProject: () => void;
}

export function Dashboard({ stats, onNewProject }: DashboardProps) {
  const statCards = [
    {
      label: 'Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Tasks',
      value: stats.totalTasks,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Completed',
      value: stats.completedToday,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Button onClick={onNewProject} size="sm" className="h-8">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-lg border border-border bg-card"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.totalProjects === 0 && (
        <div className="py-16 text-center border border-border rounded-lg bg-card">
          <FolderKanban className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No projects yet</p>
          <Button onClick={onNewProject} size="sm">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create Project
          </Button>
        </div>
      )}
    </div>
  );
}
