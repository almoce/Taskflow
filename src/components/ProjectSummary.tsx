import { ProjectMiniChart } from "./ProjectMiniChart";
import { ProjectStatsCard } from "./ProjectStatsCard";

interface ProjectSummaryProps {
  projectId: string;
  projectColor: string;
}

export function ProjectSummary({ projectId, projectColor }: ProjectSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-border/40 animate-fade-in">
      <div className="md:col-span-2">
        <ProjectStatsCard projectId={projectId} projectColor={projectColor} />
      </div>
      <div>
        <ProjectMiniChart projectId={projectId} />
      </div>
    </div>
  );
}
