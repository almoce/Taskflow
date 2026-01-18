import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project, Task } from "@/types/task";

interface BubbleChartProps {
  tasks: Task[];
  projects?: Project[];
  groupBy: "overview" | "status" | "priority" | "tag";
  height?: number;
}

interface TaskNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  category: string;
  displayValue: string;
  color: string;
  radius: number;
  type?: string;
  projectName?: string;
  status?: string;
  priority?: string;
  tag?: string;
  icon?: string;
}

const COLORS = {
  status: {
    todo: "var(--muted-foreground)",
    "in-progress": "var(--primary)",
    done: "hsl(142 76% 36%)",
  },
  priority: {
    high: "hsl(0 84% 60%)",
    medium: "hsl(38 92% 50%)",
    low: "hsl(142 76% 36%)",
  },
  tag: {
    Bug: "#f43f5e",
    Feature: "#6366f1",
    Improvement: "#06b6d4",
    Other: "#94a3b8",
  },
} as const;

export function BubbleChart({ tasks, projects, groupBy, height = 400 }: BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const _tooltipRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<TaskNode, undefined> | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    visible: boolean;
    task?: TaskNode;
  }>({ x: 0, y: 0, visible: false });

  const nodes = useMemo(() => {
    if (groupBy === "overview") {
      return tasks.map((task) => {
        const project = projects?.find((p) => p.id === task.projectId);

        return {
          id: task.id,
          title: task.title,
          category: "Overview",
          displayValue: project ? project.name : "Task",
          color: project ? project.color : "#94a3b8",
          radius: project?.icon ? 12 : 8,
          type: "Project",
          projectName: project?.name,
          status: task.status,
          priority: task.priority,
          tag: task.tag,
          icon: project?.icon,
        };
      });
    }

    return tasks.map((task) => {
      let category = "Other";
      let color = "#94a3b8";

      if (groupBy === "status") {
        category = task.status;
        color = COLORS.status[task.status as keyof typeof COLORS.status] || color;
      } else if (groupBy === "priority") {
        category = task.priority;
        color = COLORS.priority[task.priority as keyof typeof COLORS.priority] || color;
      } else if (groupBy === "tag") {
        category = task.tag || "Uncategorized";
        color = COLORS.tag[task.tag as keyof typeof COLORS.tag] || color;
      }

      return {
        id: task.id,
        title: task.title,
        category,
        displayValue: category,
        color,
        radius: 8,
      } as TaskNode;
    });
  }, [tasks, groupBy]);

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const width = svgRef.current.clientWidth;
    const svg = d3.select(svgRef.current);
    const g = svg.select("g").empty() ? svg.append("g") : svg.select<SVGGElement>("g");

    // Create categories for foci
    const categories = Array.from(new Set(nodes.map((n) => n.category))).sort();
    const padding = 60;

    const fociX = d3
      .scalePoint()
      .domain(categories)
      .range(categories.length > 1 ? [padding, width - padding] : [width / 2, width / 2])
      .padding(0.5);

    // Category Labels - Render these first
    g.selectAll(".category-label").remove();
    g.selectAll(".category-label")
      .data(categories)
      .enter()
      .append("text")
      .attr("class", "category-label")
      .attr("x", (d) => fociX(d) || width / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--muted-foreground)")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("pointer-events", "none")
      .attr("opacity", 0)
      .text((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .transition()
      .duration(300)
      .attr("opacity", 1);

    // Update or create simulation
    if (!simulationRef.current) {
      simulationRef.current = d3
        .forceSimulation<TaskNode>(nodes)
        .force("charge", d3.forceManyBody().strength(-15))
        .force(
          "collide",
          d3.forceCollide<TaskNode>((d) => d.radius + 2),
        )
        .force("y-center", d3.forceY(height / 2).strength(0.05));
    } else {
      simulationRef.current.nodes(nodes);
    }

    const simulation = simulationRef.current;

    // Reset positions for "drop from top" effect on mode change
    nodes.forEach((node) => {
      node.x = fociX(node.category) || width / 2;
      node.y = -50; // Start outside the top
      node.vx = 0;
      node.vy = 0;
    });

    if (groupBy === "overview") {
      // Group by project name to cluster bubbles by project (even if they share colors)
      const projectNames = Array.from(new Set(nodes.map((n) => n.projectName || "Other"))).sort();
      const clusterCount = projectNames.length;

      if (clusterCount <= 1) {
        simulation.force(
          "x",
          d3.forceX<TaskNode>((d) => fociX(d.category) || width / 2).strength(0.35),
        );
        simulation.force("y", d3.forceY<TaskNode>(height / 2).strength(0.15));
      } else {
        // Distribute project centers in a circle
        const radius = Math.min(width, height) * 0.15; // Small radius to keep them "near" but clustered
        const centers: Record<string, { x: number; y: number }> = {};

        projectNames.forEach((name, i) => {
          const angle = (i / clusterCount) * 2 * Math.PI;
          centers[name] = {
            x: width / 2 + Math.cos(angle) * radius,
            y: height / 2 + Math.sin(angle) * radius,
          };
        });

        simulation.force(
          "x",
          d3
            .forceX<TaskNode>((d) => centers[d.projectName || "Other"]?.x || width / 2)
            .strength(0.2),
        );
        simulation.force(
          "y",
          d3
            .forceY<TaskNode>((d) => centers[d.projectName || "Other"]?.y || height / 2)
            .strength(0.2),
        );
      }
    } else {
      simulation.force(
        "x",
        d3.forceX<TaskNode>((d) => fociX(d.category) || width / 2).strength(0.35),
      );
      simulation.force("y", d3.forceY<TaskNode>(height / 2).strength(0.15));
    }

    // Delay the bubble drop slightly to let labels appear
    setTimeout(() => {
      simulation.alpha(1).restart();
    }, 100);

    // Bind data to bubbles
    const bubbles = g.selectAll<SVGGElement, TaskNode>(".task-bubble").data(nodes, (d) => d.id);

    // Exit
    bubbles.exit().remove();

    // Enter
    const bubblesEnter = bubbles.enter().append("g").attr("class", "task-bubble");

    bubblesEnter
      .append("circle")
      .attr("r", (d) => (d.icon ? 12 : d.radius))
      .style("cursor", "pointer");

    bubblesEnter
      .append("text")
      .attr("class", "task-icon")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "12px")
      .attr("pointer-events", "none")
      .style("user-select", "none");

    // Merge and update
    const bubblesMerged = bubblesEnter.merge(bubbles);

    bubblesMerged
      .select("circle")
      .transition()
      .duration(500)
      .attr("r", (d) => (d.icon ? 12 : d.radius))
      .attr("fill", (d) => d.color)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 1)
      .attr("opacity", (d) => (d.icon ? 0.2 : 0.8));

    bubblesMerged.select("text").text((d) => d.icon || "");

    bubblesMerged
      .on("mouseenter", function (event, d) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("opacity", (d) => (d.icon ? 0.4 : 1))
          .attr("r", d.radius + 6);

        d3.select(this).select("text").transition().duration(200).attr("font-size", "14px");

        setTooltipData({
          x: event.clientX,
          y: event.clientY,
          visible: true,
          task: d,
        });
      })
      .on("mousemove", (event) => {
        setTooltipData((prev) => ({ ...prev, x: event.clientX, y: event.clientY }));
      })
      .on("mouseleave", function (event, d) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("opacity", (d) => (d.icon ? 0.2 : 0.8))
          .attr("r", d.radius); // Use the stored radius which is now correct in the datum

        d3.select(this).select("text").transition().duration(200).attr("font-size", "12px");

        setTooltipData((prev) => ({ ...prev, visible: false }));
      });

    simulation.on("tick", () => {
      bubblesMerged.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });
  }, [nodes, height]);

  useEffect(() => {
    return () => {
      if (simulationRef.current) simulationRef.current.stop();
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <svg ref={svgRef} width="100%" height={height} className="overflow-visible" />
      {tooltipData.visible &&
        tooltipData.task &&
        createPortal(
          <div
            className="fixed pointer-events-none bg-card border border-border rounded-lg p-2 shadow-lg z-[100] whitespace-nowrap"
            style={{
              left: tooltipData.x + 16,
              top: tooltipData.y - 16,
              transform: "translateY(-100%)",
            }}
          >
            <div className="text-xs font-medium mb-1">{tooltipData.task.title}</div>
            {tooltipData.task.projectName && (
              <div className="text-[10px] text-muted-foreground mb-1">
                Project: {tooltipData.task.projectName}
              </div>
            )}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: tooltipData.task.color }}
              ></span>
              <span>
                {groupBy === "overview" ? (
                  <>
                    {tooltipData.task.status} • {tooltipData.task.priority}
                    {tooltipData.task.tag ? ` • ${tooltipData.task.tag}` : ""}
                  </>
                ) : tooltipData.task.type ? (
                  `${tooltipData.task.type}: ${tooltipData.task.displayValue}`
                ) : (
                  tooltipData.task.displayValue
                )}
              </span>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
