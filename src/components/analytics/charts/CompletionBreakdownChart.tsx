import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { BarChart } from "@/components/charts/BarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompletionBreakdownChartProps {
  data: any[];
  timeRange: "week" | "month";
}

export function CompletionBreakdownChart({ data, timeRange }: CompletionBreakdownChartProps) {
  const allProjects = useMemo(() => {
    const projectMap = new Map();
    data.forEach(d => {
      d.projectBreakdown?.forEach((p: any) => {
        if (!projectMap.has(p.id)) {
          projectMap.set(p.id, { name: p.name, color: p.color });
        }
      });
    });
    return Array.from(projectMap.values());
  }, [data]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          {timeRange === "week" ? "Daily" : "Weekly"} Time Spent Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart data={data} height={200} />
        <div className="relative mt-4">
          <div className="text-sm overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 [mask-image:linear-gradient(to_right,black_calc(100%-48px),transparent)]">
            <div className="flex items-center gap-6 w-fit mx-auto px-12">
              {allProjects.length > 0 ? (
                allProjects.map((project, i) => (
                  <div key={i} className="flex items-center gap-2 flex-shrink-0">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: project.color || "#f59e0b" }} 
                    />
                    <span className="text-muted-foreground whitespace-nowrap">{project.name}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground whitespace-nowrap">Time Spent</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}