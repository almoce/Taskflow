import { BarChart3 } from "lucide-react";
import { BarChart } from "@/components/charts/BarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompletionBreakdownChartProps {
  data: any[];
  timeRange: "week" | "month";
}

export function CompletionBreakdownChart({ data, timeRange }: CompletionBreakdownChartProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          {timeRange === "week" ? "Daily" : "Weekly"} Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart data={data} height={200} />
      </CardContent>
    </Card>
  );
}
