import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { formatDurationDetailed } from "@/utils/time";

interface ProjectBreakdown {
  id: string;
  name: string;
  color: string;
  timeSpent: number;
}

interface DataPoint {
  date: string;
  fullDate: string;
  completed: number;
  created: number;
  timeSpent?: number;
  projectBreakdown?: ProjectBreakdown[];
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, innerWidth])
      .padding(0.3);

    const x1 = d3
      .scaleBand()
      .domain(["timeSpent"])
      .range([0, x0.bandwidth()])
      .padding(0.1);

    const maxTimeMs = d3.max(data, (d) => d.timeSpent || 0) || 0;
    const maxTimeHours = maxTimeMs / (1000 * 60 * 60);

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(maxTimeHours, 1) + 1])
      .range([innerHeight, 0])
      .nice();

    // Grid lines (subtle)
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.1)
      .call(
        d3
          .axisLeft(y)
          .tickSize(-innerWidth)
          .tickFormat(() => ""),
      )
      .call((g) => g.select(".domain").remove());

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0))
      .call((g) => g.select(".domain").attr("stroke", "var(--border)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "var(--border)"))
      .call((g) =>
        g.selectAll(".tick text").attr("fill", "var(--muted-foreground)").attr("font-size", "12px"),
      );

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat((v) => `${v}h`))
      .call((g) => g.select(".domain").attr("stroke", "var(--border)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "var(--border)"))
      .call((g) =>
        g.selectAll(".tick text").attr("fill", "var(--muted-foreground)").attr("font-size", "12px"),
      );

    // Create bar groups
    const barGroups = g
      .selectAll(".bar-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (d) => `translate(${x0(d.date)},0)`);

    // Helper to render bars (single or stacked)
    barGroups.each(function (d) {
      const group = d3.select(this);
      const breakdown = d.projectBreakdown || [];

      if (breakdown.length > 0) {
        let currentY = innerHeight;
        
        breakdown.forEach((p, i) => {
          const barHeight = innerHeight - y(p.timeSpent / (1000 * 60 * 60));
          const targetY = currentY - barHeight;

          group
            .append("rect")
            .attr("class", `bar-project-${p.id}`)
            .attr("x", x1("timeSpent") || 0)
            .attr("width", x1.bandwidth())
            .attr("y", innerHeight)
            .attr("height", 0)
            .attr("fill", p.color || "#f59e0b")
            .attr("opacity", 1)
            // Removed rx for consistency in stacked bars
            .style("cursor", "pointer")
            .on("mouseenter", function (event) {
              d3.select(this).transition("hover").duration(200).attr("opacity", 0.8);

              tooltip
                .style("opacity", "1")
                .style("left", `${event.clientX + 16}px`)
                .style("top", `${event.clientY - 16}px`)
                .style("transform", "translateY(-100%)")
                .html(
                  `
                  <div class="text-xs font-medium mb-1">${d.fullDate}</div>
                  <div class="flex items-center gap-2 text-xs">
                    <span class="w-2 h-2 rounded-full" style="background-color: ${p.color}"></span>
                    <span>${p.name}: ${formatDurationDetailed(p.timeSpent)}</span>
                  </div>
                  <div class="mt-1 pt-1 border-t border-border/50 text-[10px] text-muted-foreground">
                    Total: ${formatDurationDetailed(d.timeSpent || 0)}
                  </div>
                `,
                );
            })
            .on("mouseleave", function () {
              d3.select(this).transition("hover").duration(200).attr("opacity", 1);
              tooltip.style("opacity", "0");
            })
            .transition()
            .delay((_, i) => i * 50)
            .duration(600)
            .ease(d3.easeCubicOut)
            .attr("y", targetY)
            .attr("height", barHeight);
          
          currentY = targetY;
        });
      } else {
        // Fallback for single project or no breakdown
        group
          .append("rect")
          .attr("class", "bar-time")
          .attr("x", x1("timeSpent") || 0)
          .attr("width", x1.bandwidth())
          .attr("y", innerHeight)
          .attr("height", 0)
          .attr("fill", "#f59e0b")
          .attr("opacity", 1)
          .style("cursor", "pointer")
          .on("mouseenter", function (event) {
            d3.select(this).transition("hover").duration(200).attr("opacity", 0.8);

            tooltip
              .style("opacity", "1")
              .style("left", `${event.clientX + 16}px`)
              .style("top", `${event.clientY - 16}px`)
              .style("transform", "translateY(-100%)")
              .html(
                `
                <div class="text-xs font-medium mb-1">${d.fullDate}</div>
                <div class="flex items-center gap-2 text-xs">
                  <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Time Spent: ${formatDurationDetailed(d.timeSpent || 0)}</span>
                </div>
              `,
              );
          })
          .on("mouseleave", function () {
            d3.select(this).transition("hover").duration(200).attr("opacity", 1);
            tooltip.style("opacity", "0");
          })
          .transition()
          .delay((_, i) => i * 50)
          .duration(600)
          .ease(d3.easeCubicOut)
          .attr("y", y((d.timeSpent || 0) / (1000 * 60 * 60)))
          .attr("height", innerHeight - y((d.timeSpent || 0) / (1000 * 60 * 60)));
      }
    });
  }, [data, height]);

  return (
    <div className="relative w-full">
      <svg ref={svgRef} width="100%" height={height} />
      {createPortal(
        <div
          ref={tooltipRef}
          className="fixed pointer-events-none opacity-0 bg-card border border-border rounded-lg p-2 shadow-lg transition-opacity duration-200 z-50 whitespace-nowrap"
          style={{ transition: "opacity 0.2s" }}
        />,
        document.body,
      )}
    </div>
  );
}
