import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DataPoint {
  date: string;
  fullDate: string;
  completed: number;
  created: number;
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
      .domain(["completed", "created"])
      .range([0, x0.bandwidth()])
      .padding(0.1);

    const maxY = Math.max(
      d3.max(data, (d) => d.completed) || 0,
      d3.max(data, (d) => d.created) || 0,
    );

    const y = d3
      .scaleLinear()
      .domain([0, maxY + 2])
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

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0))
      .call((g) => g.select(".domain").attr("stroke", "var(--border)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "var(--border)"))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "var(--muted-foreground)")
          .attr("font-size", "12px"),
      );

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .call((g) => g.select(".domain").attr("stroke", "var(--border)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "var(--border)"))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "var(--muted-foreground)")
          .attr("font-size", "12px"),
      );

    // Create bar groups
    const barGroups = g
      .selectAll(".bar-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (d) => `translate(${x0(d.date)},0)`);

    // Completed bars
    barGroups
      .append("rect")
      .attr("class", "bar-completed")
      .attr("x", x1("completed") || 0)
      .attr("width", x1.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", "hsl(142 76% 36%)")
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(200).attr("fill", "hsl(142 76% 42%)");

        tooltip
          .style("opacity", "1")
          .style("left", `${event.clientX + 16}px`)
          .style("top", `${event.clientY - 16}px`)
          .style("transform", "translateY(-100%)")
          .html(
            `
            <div class="text-xs font-medium mb-1">${d.fullDate}</div>
            <div class="flex items-center gap-2 text-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Completed: ${d.completed}</span>
            </div>
          `,
          );
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(200).attr("fill", "hsl(142 76% 36%)");
        tooltip.style("opacity", "0");
      })
      .transition()
      .delay((_, i) => i * 50)
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.completed))
      .attr("height", (d) => innerHeight - y(d.completed));

    // Created bars
    barGroups
      .append("rect")
      .attr("class", "bar-created")
      .attr("x", x1("created") || 0)
      .attr("width", x1.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", "var(--primary)")
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(200).attr("opacity", 0.8);

        tooltip
          .style("opacity", "1")
          .style("left", `${event.clientX + 16}px`)
          .style("top", `${event.clientY - 16}px`)
          .style("transform", "translateY(-100%)")
          .html(
            `
            <div class="text-xs font-medium mb-1">${d.fullDate}</div>
            <div class="flex items-center gap-2 text-xs">
              <span class="w-2 h-2 rounded-full" style="background: var(--primary)"></span>
              <span>Created: ${d.created}</span>
            </div>
          `,
          );
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(200).attr("opacity", 1);
        tooltip.style("opacity", "0");
      })
      .transition()
      .delay((_, i) => i * 50)
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.created))
      .attr("height", (d) => innerHeight - y(d.created));
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
