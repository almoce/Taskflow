import { TrendingUp } from "lucide-react";
import { AreaChart } from "@/components/charts/AreaChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompletionTrendChartProps {
  data: any[];
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          Task Completion Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AreaChart data={data} height={200} />
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Created</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
