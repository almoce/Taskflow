import * as d3 from "d3";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Calendar, Clock, History, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useProjectChartData } from "@/hooks/useProjectChartData";
import { cn } from "@/lib/utils";

interface ProjectMiniChartProps {
  projectId: string;
}

type ViewMode = "current_week" | "last_week" | "last_7_days";

const VIEW_MODES: { id: ViewMode; icon: any; label: string }[] = [
  { id: "current_week", icon: Calendar, label: "Current Week" },
  { id: "last_week", icon: History, label: "Last Week" },
  { id: "last_7_days", icon: Clock, label: "Last 7 Days" },
];

export function ProjectMiniChart({ projectId }: ProjectMiniChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("current_week");

  const chartParams = useMemo(() => {
    switch (viewMode) {
      case "last_week":
        return { timeRange: "week" as const, offset: 1 };
      case "last_7_days":
        return { timeRange: "last_7_days" as const, offset: 0 };
      case "current_week":
      default:
        return { timeRange: "week" as const, offset: 0 };
    }
  }, [viewMode]);

  const data = useProjectChartData(projectId, chartParams.timeRange, chartParams.offset);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const { totalTime, avgTime } = useMemo(() => {
    if (!data.length) return { totalTime: 0, avgTime: 0 };
    const total = data.reduce((acc, d) => acc + (d.timeSpent || 0), 0);
    const avg = total / data.length;
    return {
      totalTime: Number(total.toFixed(1)),
      avgTime: Number(avg.toFixed(1)),
    };
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const tooltipSelection = d3.select(tooltipRef.current);

    // Do not clear SVG to allow transitions
    // svg.selectAll("*").remove();

    const height = 80;
    const width = svgRef.current.clientWidth;
    const margin = { top: 5, right: 0, bottom: 0, left: 0 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Ensure groups exist
    // Layer Areas: Bottom, Clipped (Reveal Gradient)
    let gAreas = svg.select<SVGGElement>(".layer-areas");
    if (gAreas.empty()) {
      gAreas = svg
        .append("g")
        .attr("class", "layer-areas")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }
    // Always update clip-path to match current project
    gAreas.attr("clip-path", `url(#clip-${projectId})`);

    // Layer Lines: Top, Always Visible (Colored Lines)
    let gLines = svg.select<SVGGElement>(".layer-lines");
    if (gLines.empty()) {
      gLines = svg
        .append("g")
        .attr("class", "layer-lines")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    // Defs & ClipPath
    let defs = svg.select<SVGDefsElement>("defs");
    if (defs.empty()) {
      defs = svg.append("defs");

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
        .attr("stop-opacity", 0.3);
    }

    // Ensure Clip Path exists and has correct ID
    let clipPath = defs.select<SVGClipPathElement>("clipPath");
    if (clipPath.empty()) {
      clipPath = defs.append("clipPath");
      clipPath.append("rect").attr("class", "clip-rect");
    }

    clipPath.attr("id", `clip-${projectId}`);
    clipPath.select(".clip-rect").attr("width", innerWidth).attr("height", innerHeight);

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

    // Generators
    const area = d3
      .area<any>()
      .x((d) => x(d.date) || 0)
      .y0(innerHeight)
      .y1((d) => y(d.completed))
      .curve(d3.curveMonotoneX);

    const timeArea = d3
      .area<any>()
      .x((d) => x(d.date) || 0)
      .y0(innerHeight)
      .y1((d) => yTime(d.timeSpent || 0))
      .curve(d3.curveMonotoneX);

    const line = d3
      .line<any>()
      .x((d) => x(d.date) || 0)
      .y((d) => y(d.completed))
      .curve(d3.curveMonotoneX);

    const timeLine = d3
      .line<any>()
      .x((d) => x(d.date) || 0)
      .y((d) => yTime(d.timeSpent || 0))
      .curve(d3.curveMonotoneX);

    const t = svg.transition().duration(500).ease(d3.easeCubicOut);

    // Update Paths
    // Draw Areas into gAreas (Clipped)
    gAreas
      .selectAll(".area-tasks")
      .data([data])
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", "area-tasks")
            .attr("fill", "url(#miniGradient)")
            .attr("d", area),
        (update) => update.call((u) => u.transition(t).attr("d", area)),
      );

    gAreas
      .selectAll(".area-time")
      .data([data])
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", "area-time")
            .attr("fill", "url(#timeGradient)")
            .attr("d", timeArea),
        (update) => update.call((u) => u.transition(t).attr("d", timeArea)),
      );

    // Draw Lines into gLines (Unclipped, always visible)
    gLines
      .selectAll(".line-time")
      .data([data])
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", "line-time")
            .attr("fill", "none")
            .attr("stroke", "#f59e0b")
            .attr("stroke-width", 2)
            .attr("d", timeLine),
        (update) => update.call((u) => u.transition(t).attr("d", timeLine)),
      );

    gLines
      .selectAll(".line-tasks")
      .data([data])
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", "line-tasks")
            .attr("fill", "none")
            .attr("stroke", "hsl(142 76% 36%)")
            .attr("stroke-width", 2)
            .attr("d", line),
        (update) => update.call((u) => u.transition(t).attr("d", line)),
      );

    // Interactive Overlay (Ensure it's always on top)

    let overlayGroup = svg.select(".overlay-group");
    if (overlayGroup.empty()) {
      overlayGroup = svg
        .append("g")
        .attr("class", "overlay-group")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    overlayGroup.selectAll(".overlay-rect").remove();
    const _overlay = overlayGroup
      .append("rect")
      .attr("class", "overlay-rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent") // Transparent but interactive
      .attr("pointer-events", "all")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);
        const xValues = data.map((d) => x(d.date) || 0);
        const closestIndex = d3.leastIndex(xValues, (a) => Math.abs(a - mouseX));

        if (closestIndex !== undefined) {
          const d = data[closestIndex];
          const snappedX = xValues[closestIndex];

          // Update Clip Path width to snap to the nearest data point with transition
          defs
            .select(`#clip-${projectId} .clip-rect`)
            .transition()
            .duration(200)
            .ease(d3.easeCubicOut)
            .attr("width", snappedX);

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
        // Reset clip path to full width on leave with transition
        defs
          .select(`#clip-${projectId} .clip-rect`)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr("width", innerWidth);
      });
  }, [data, projectId]); // Added projectId dependency

  return (
    <Card className="bg-card/40 backdrop-blur-md border-border/40 overflow-hidden relative group">
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 text-muted-foreground/70">
            <TrendingUp className="w-3 h-3 text-emerald-500/70" />
            Week Activity
          </CardTitle>
          <div className="flex items-center gap-0.5">
            <TooltipProvider>
              {VIEW_MODES.map(({ id, icon: Icon, label }) => {
                const isActive = viewMode === id;
                return (
                  <Tooltip key={id} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-6 w-6 rounded-full transition-colors",
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground/50 hover:text-foreground",
                        )}
                        onClick={() => setViewMode(id)}
                        aria-label={label}
                      >
                        <Icon className="h-3! w-3!" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-[10px] px-2 py-1">
                      {label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-full transition-colors",
                  showOverlay
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground/50 hover:text-foreground",
                )}
                onClick={() => setShowOverlay(!showOverlay)}
                aria-label="Toggle Stats"
              >
                <Calculator className="h-3! w-3!" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-[10px] px-2 py-1">
              Toggle Stats
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="space-y-0.5"
                >
                  <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground/80">
                    Total Time
                  </p>
                  <p className="text-lg font-bold tabular-nums text-foreground">{totalTime}h</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="space-y-0.5"
                >
                  <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground/80">
                    Avg Focus
                  </p>
                  <p className="text-lg font-bold tabular-nums text-amber-500">{avgTime}h</p>
                </motion.div>
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
        document.body,
      )}
    </Card>
  );
}
