import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectChartData } from "@/hooks/useProjectChartData";
import { TrendingUp } from "lucide-react";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface ProjectMiniChartProps {
  projectId: string;
}

export function ProjectMiniChart({ projectId }: ProjectMiniChartProps) {
  const data = useProjectChartData(projectId, "week");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const height = 80;
    const width = svgRef.current.clientWidth;
    const margin = { top: 5, right: 0, bottom: 0, left: 0 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.date))
      .range([0, innerWidth])
      .padding(0);

    const maxY = Math.max(
      d3.max(data, (d) => d.completed) || 0,
      d3.max(data, (d) => d.created) || 0,
    );

    const y = d3
      .scaleLinear()
      .domain([0, maxY + 1])
      .range([innerHeight, 0]);

    // Area generator
    const area = d3
      .area<any>()
      .x((d) => x(d.date) || 0)
      .y0(innerHeight)
      .y1((d) => y(d.completed))
      .curve(d3.curveMonotoneX);

    // Line generator
    const line = d3
      .line<any>()
      .x((d) => x(d.date) || 0)
      .y((d) => y(d.completed))
      .curve(d3.curveMonotoneX);

    // Draw
    g.append("path")
      .datum(data)
      .attr("fill", "url(#miniGradient)")
      .attr("d", area);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "hsl(142 76% 36%)")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Gradient
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "miniGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "hsl(142 76% 36%)")
      .attr("stop-opacity", 0.3);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "hsl(142 76% 36%)")
      .attr("stop-opacity", 0);

  }, [data]);

  return (
    <Card className="bg-card/40 backdrop-blur-md border-border/40 overflow-hidden">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 text-muted-foreground/70">
          <TrendingUp className="w-3 h-3 text-emerald-500/70" />
          Week Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-1">
        <div className="h-[80px] w-full">
          <svg ref={svgRef} width="100%" height="80" />
        </div>
      </CardContent>
    </Card>
  );
}
