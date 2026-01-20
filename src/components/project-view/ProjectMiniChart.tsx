import * as d3 from "d3";
import { Info, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectChartData } from "@/hooks/useProjectChartData";
import { AnimatePresence, motion } from "framer-motion";

interface ProjectMiniChartProps {
  projectId: string;
}

export function ProjectMiniChart({ projectId }: ProjectMiniChartProps) {
  const data = useProjectChartData(projectId, "week");
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const { totalTime, avgTime } = useMemo(() => {
    if (!data.length) return { totalTime: 0, avgTime: 0 };
    const total = data.reduce((acc, d) => acc + (d.timeSpent || 0), 0);
    const avg = total / data.length;
    return { 
      totalTime: Number(total.toFixed(1)), 
      avgTime: Number(avg.toFixed(1)) 
    };
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const tooltipSelection = d3.select(tooltipRef.current);
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

    const maxTime = d3.max(data, (d) => d.timeSpent || 0) || 0;
    const yTime = d3
      .scaleLinear()
      .domain([0, maxTime + 1])
      .range([innerHeight, 0]);

    // Area generator (Tasks)
    const area = d3
      .area<any>()
      .x((d) => x(d.date) || 0)
      .y0(innerHeight)
      .y1((d) => y(d.completed))
      .curve(d3.curveMonotoneX);

    // Area generator (Time)
    const timeArea = d3
      .area<any>()
      .x((d) => x(d.date) || 0)
      .y0(innerHeight)
      .y1((d) => yTime(d.timeSpent || 0))
      .curve(d3.curveMonotoneX);

    // Line generator (Tasks)
    const line = d3
      .line<any>()
      .x((d) => x(d.date) || 0)
      .y((d) => y(d.completed))
      .curve(d3.curveMonotoneX);

    // Line generator (Time)
    const timeLine = d3
      .line<any>()
      .x((d) => x(d.date) || 0)
      .y((d) => yTime(d.timeSpent || 0))
      .curve(d3.curveMonotoneX);

    // Draw
    g.append("path").datum(data).attr("fill", "url(#miniGradient)").attr("d", area);
    g.append("path").datum(data).attr("fill", "url(#timeGradient)").attr("d", timeArea);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f59e0b") // Amber
      .attr("stroke-width", 2)
      .attr("d", timeLine);

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

    const timeGradient = defs
      .append("linearGradient")
      .attr("id", "timeGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    timeGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f59e0b")
      .attr("stop-opacity", 0.3);

    timeGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f59e0b")
      .attr("stop-opacity", 0);

    // Interactive Overlay
    const overlay = g
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);
        const xValues = data.map((d) => x(d.date) || 0);
        const closestIndex = d3.leastIndex(xValues, (a) => Math.abs(a - mouseX));

        if (closestIndex !== undefined) {
          const d = data[closestIndex];
          if (svgRef.current) {
            tooltipSelection
              .style("opacity", "1")
              .style("left", `${event.clientX - 10}px`)
              .style("top", `${event.clientY - 10}px`)
              .style("transform", "translate(-100%, -100%)")
              .html(
                `
              <div class="text-[10px] font-bold mb-1">${d.fullDate}</div>
              <div class="flex items-center gap-2 text-[10px]">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Tasks: ${d.completed}</span>
              </div>
              <div class="flex items-center gap-2 text-[10px]">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Time: ${d.timeSpent || 0}h</span>
              </div>
            `,
              );
          }
        }
      })
      .on("mouseleave", () => {
        tooltipSelection.style("opacity", "0");
      });
  }, [data]);

  return (
    <Card className="bg-card/40 backdrop-blur-md border-border/40 overflow-hidden relative group">
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 text-muted-foreground/70">
          <TrendingUp className="w-3 h-3 text-emerald-500/70" />
          Week Activity
        </CardTitle>
        <div 
          onMouseEnter={() => setShowOverlay(true)}
          onMouseLeave={() => setShowOverlay(false)}
          className="cursor-help"
        >
          <Info className="w-3 h-3 text-muted-foreground/50 hover:text-foreground transition-colors" />
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-1 relative">
        <div className="h-[80px] w-full">
          <svg ref={svgRef} width="100%" height="80" data-testid="mini-chart-svg" />
        </div>
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center p-4 z-10"
            >
              <div className="grid grid-cols-2 gap-6 w-full max-w-[200px]">
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground/80">
                    Total Time
                  </p>
                  <p className="text-lg font-bold tabular-nums text-foreground">
                    {totalTime}h
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground/80">
                    Avg Focus
                  </p>
                  <p className="text-lg font-bold tabular-nums text-amber-500">
                    {avgTime}h
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      {createPortal(
        <div
          ref={tooltipRef}
          className="fixed pointer-events-none opacity-0 bg-popover text-popover-foreground border border-border rounded shadow-md p-2 z-50 transition-opacity duration-200 whitespace-nowrap"
        />,
        document.body
      )}
    </Card>
  );
}
