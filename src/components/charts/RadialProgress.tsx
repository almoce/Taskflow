import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

interface RadialProgressProps {
  data: DistributionItem[];
  height?: number;
}

export function RadialProgress({ data, height = 200 }: RadialProgressProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const radius = Math.min(width, height) / 2 - 20;
    const centerX = width / 2;
    const centerY = height / 2;

    const g = svg.append("g").attr("transform", `translate(${centerX},${centerY})`);

    const total = d3.sum(data, (d) => d.value);
    const ringWidth = 16;
    const gap = 8;

    // Create radial progress rings
    data.forEach((item, index) => {
      const currentRadius = radius - index * (ringWidth + gap);
      const percentage = item.value / total;

      // Background ring
      g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", currentRadius)
        .attr("fill", "none")
        .attr("stroke", "var(--muted)")
        .attr("stroke-width", ringWidth)
        .attr("opacity", 0.2);

      // Progress arc
      const arc = d3
        .arc()
        .innerRadius(currentRadius - ringWidth / 2)
        .outerRadius(currentRadius + ringWidth / 2)
        .startAngle(-Math.PI / 2)
        .endAngle(-Math.PI / 2);

      const progressArc = g
        .append("path")
        .datum({ endAngle: -Math.PI / 2 + percentage * 2 * Math.PI })
        .attr("fill", item.color)
        // biome-ignore lint/suspicious/noExplicitAny: d3 types are complex
        .attr("d", arc as any)
        .style("cursor", "pointer")
        .on("mouseenter", function (event) {
          d3.select(this).transition().duration(200).attr("opacity", 0.8);

          tooltip
            .style("opacity", "1")
            .style("left", `${event.clientX + 16}px`)
            .style("top", `${event.clientY - 16}px`)
            .style("transform", "translateY(-100%)")
            .html(
              `
            <div class="text-xs font-medium mb-1">${item.name}</div>
            <div class="flex items-center gap-2 text-xs">
              <span class="w-2 h-2 rounded-full" style="background: ${item.color}"></span>
              <span>${item.value} (${Math.round(percentage * 100)}%)</span>
            </div>
          `,
            );
        })
        .on("mouseleave", function () {
          d3.select(this).transition().duration(200).attr("opacity", 1);
          tooltip.style("opacity", "0");
        });

      // Animate the arc
      progressArc
        .transition()
        .delay(index * 150)
        .duration(800)
        .ease(d3.easeCubicOut)
        // biome-ignore lint/suspicious/noExplicitAny: d3 types are complex
        .attrTween("d", (d: any) => {
          const interpolate = d3.interpolate(-Math.PI / 2, d.endAngle);
          return (t) => {
            const currentArc = d3
              .arc()
              .innerRadius(currentRadius - ringWidth / 2)
              .outerRadius(currentRadius + ringWidth / 2)
              .startAngle(-Math.PI / 2)
              .endAngle(interpolate(t));
            // biome-ignore lint/suspicious/noExplicitAny: d3 types are complex
            return currentArc(d as any) || "";
          };
        });

      // Add percentage label
      const labelRadius = currentRadius;
      const labelAngle = -Math.PI / 2 + (percentage * 2 * Math.PI) / 2;
      const labelX = labelRadius * Math.cos(labelAngle);
      const labelY = labelRadius * Math.sin(labelAngle);

      g.append("text")
        .attr("x", labelX)
        .attr("y", labelY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "var(--foreground)")
        .attr("font-size", "11px")
        .attr("font-weight", "600")
        .attr("opacity", 0)
        .text(`${Math.round(percentage * 100)}%`)
        .transition()
        .delay(index * 150 + 400)
        .duration(400)
        .attr("opacity", percentage > 0.1 ? 1 : 0);
    });

    // Center total
    g.append("text")
      .attr("x", 0)
      .attr("y", -8)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--foreground)")
      .attr("font-size", "24px")
      .attr("font-weight", "700")
      .attr("opacity", 0)
      .text(total)
      .transition()
      .delay(600)
      .duration(400)
      .attr("opacity", 1);

    g.append("text")
      .attr("x", 0)
      .attr("y", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--muted-foreground)")
      .attr("font-size", "12px")
      .attr("opacity", 0)
      .text("Total")
      .transition()
      .delay(600)
      .duration(400)
      .attr("opacity", 1);
  }, [data, height]);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">No data</div>
    );
  }

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
