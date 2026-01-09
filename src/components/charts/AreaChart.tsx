import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createPortal } from 'react-dom';

interface DataPoint {
    date: string;
    fullDate: string;
    completed: number;
    created: number;
}

interface AreaChartProps {
    data: DataPoint[];
    height?: number;
}

export function AreaChart({ data, height = 200 }: AreaChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data.length) return;

        const svg = d3.select(svgRef.current);
        const tooltip = d3.select(tooltipRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = svgRef.current.clientWidth;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3
            .scalePoint()
            .domain(data.map((d) => d.date))
            .range([0, innerWidth])
            .padding(0.5);

        const maxY = Math.max(
            d3.max(data, (d) => d.completed) || 0,
            d3.max(data, (d) => d.created) || 0
        );

        const y = d3
            .scaleLinear()
            .domain([0, maxY + 2])
            .range([innerHeight, 0])
            .nice();

        // Grid lines (subtle)
        g.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.1)
            .call(
                d3
                    .axisLeft(y)
                    .tickSize(-innerWidth)
                    .tickFormat(() => '')
            )
            .call((g) => g.select('.domain').remove());

        // Axes
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x))
            .call((g) => g.select('.domain').attr('stroke', 'hsl(var(--border))'))
            .call((g) =>
                g.selectAll('.tick line').attr('stroke', 'hsl(var(--border))')
            )
            .call((g) =>
                g
                    .selectAll('.tick text')
                    .attr('fill', 'hsl(var(--muted-foreground))')
                    .attr('font-size', '12px')
            );

        g.append('g')
            .call(d3.axisLeft(y).ticks(5))
            .call((g) => g.select('.domain').attr('stroke', 'hsl(var(--border))'))
            .call((g) =>
                g.selectAll('.tick line').attr('stroke', 'hsl(var(--border))')
            )
            .call((g) =>
                g
                    .selectAll('.tick text')
                    .attr('fill', 'hsl(var(--muted-foreground))')
                    .attr('font-size', '12px')
            );

        // Define gradients
        const defs = svg.append('defs');

        const completedGradient = defs
            .append('linearGradient')
            .attr('id', 'completedGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

        completedGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'hsl(142 76% 36%)')
            .attr('stop-opacity', 0.4);

        completedGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'hsl(142 76% 36%)')
            .attr('stop-opacity', 0.05);

        const createdGradient = defs
            .append('linearGradient')
            .attr('id', 'createdGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

        createdGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'hsl(var(--primary))')
            .attr('stop-opacity', 0.4);

        createdGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'hsl(var(--primary))')
            .attr('stop-opacity', 0.05);

        // Area generators with smooth curves
        const areaCompleted = d3
            .area<DataPoint>()
            .x((d) => x(d.date) || 0)
            .y0(innerHeight)
            .y1((d) => y(d.completed))
            .curve(d3.curveCatmullRom.alpha(0.5));

        const areaCreated = d3
            .area<DataPoint>()
            .x((d) => x(d.date) || 0)
            .y0(innerHeight)
            .y1((d) => y(d.created))
            .curve(d3.curveCatmullRom.alpha(0.5));

        // Line generators
        const lineCompleted = d3
            .line<DataPoint>()
            .x((d) => x(d.date) || 0)
            .y((d) => y(d.completed))
            .curve(d3.curveCatmullRom.alpha(0.5));

        const lineCreated = d3
            .line<DataPoint>()
            .x((d) => x(d.date) || 0)
            .y((d) => y(d.created))
            .curve(d3.curveCatmullRom.alpha(0.5));

        // Draw areas with animation
        const completedPath = g
            .append('path')
            .datum(data)
            .attr('fill', 'url(#completedGradient)')
            .attr('d', areaCompleted);

        const createdPath = g
            .append('path')
            .datum(data)
            .attr('fill', 'url(#createdGradient)')
            .attr('d', areaCreated);

        // Draw lines
        const completedLine = g
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'hsl(142 76% 36%)')
            .attr('stroke-width', 2)
            .attr('d', lineCompleted);

        const createdLine = g
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'hsl(var(--primary))')
            .attr('stroke-width', 2)
            .attr('d', lineCreated);

        // Animate paths
        const pathLength = completedLine.node()?.getTotalLength() || 0;
        [completedLine, createdLine].forEach((line) => {
            line
                .attr('stroke-dasharray', pathLength)
                .attr('stroke-dashoffset', pathLength)
                .transition()
                .duration(1000)
                .ease(d3.easeCubicOut)
                .attr('stroke-dashoffset', 0);
        });

        [completedPath, createdPath].forEach((path) => {
            path
                .attr('opacity', 0)
                .transition()
                .duration(1000)
                .ease(d3.easeCubicOut)
                .attr('opacity', 1);
        });

        // Interactive dots
        const dotsCompleted = g
            .selectAll('.dot-completed')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot-completed')
            .attr('cx', (d) => x(d.date) || 0)
            .attr('cy', (d) => y(d.completed))
            .attr('r', 0)
            .attr('fill', 'hsl(142 76% 36%)')
            .attr('stroke', 'hsl(var(--background))')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .transition()
            .delay((_, i) => i * 50)
            .duration(300)
            .attr('r', 4);

        const dotsCreated = g
            .selectAll('.dot-created')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot-created')
            .attr('cx', (d) => x(d.date) || 0)
            .attr('cy', (d) => y(d.created))
            .attr('r', 0)
            .attr('fill', 'hsl(var(--primary))')
            .attr('stroke', 'hsl(var(--background))')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .transition()
            .delay((_, i) => i * 50)
            .duration(300)
            .attr('r', 4);

        // Hover interactions
        const hoverLine = g
            .append('line')
            .attr('class', 'hover-line')
            .attr('stroke', 'hsl(var(--muted-foreground))')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4 4')
            .attr('opacity', 0);

        const overlay = g
            .append('rect')
            .attr('width', innerWidth)
            .attr('height', innerHeight)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mousemove', function (event) {
                const [mouseX] = d3.pointer(event);
                const xValues = data.map((d) => x(d.date) || 0);
                const closestIndex = d3.leastIndex(xValues, (a) =>
                    Math.abs(a - mouseX)
                );

                if (closestIndex !== undefined) {
                    const d = data[closestIndex];
                    const xPos = x(d.date) || 0;

                    hoverLine
                        .attr('x1', xPos)
                        .attr('x2', xPos)
                        .attr('y1', 0)
                        .attr('y2', innerHeight)
                        .attr('opacity', 0.5);

                    if (svgRef.current) {
                        tooltip
                            .style('opacity', '1')
                            .style('left', `${event.clientX + 16}px`)
                            .style('top', `${event.clientY - 16}px`)
                            .style('transform', 'translateY(-100%)')
                            .html(
                                `
              <div class="text-xs font-medium mb-1">${d.fullDate}</div>
              <div class="flex items-center gap-2 text-xs">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Completed: ${d.completed}</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="w-2 h-2 rounded-full" style="background: hsl(var(--primary))"></span>
                <span>Created: ${d.created}</span>
              </div>
            `
                            );
                    }

                    // Highlight dots
                    g.selectAll('.dot-completed')
                        .attr('r', (_, i) => (i === closestIndex ? 6 : 4))
                        .attr('opacity', (_, i) => (i === closestIndex ? 1 : 0.6));

                    g.selectAll('.dot-created')
                        .attr('r', (_, i) => (i === closestIndex ? 6 : 4))
                        .attr('opacity', (_, i) => (i === closestIndex ? 1 : 0.6));
                }
            })
            .on('mouseleave', function () {
                hoverLine.attr('opacity', 0);
                tooltip.style('opacity', '0');
                g.selectAll('.dot-completed').attr('r', 4).attr('opacity', 1);
                g.selectAll('.dot-created').attr('r', 4).attr('opacity', 1);
            });
    }, [data, height]);

    return (
        <div className="relative w-full">
            <svg ref={svgRef} width="100%" height={height} />
            {createPortal(
                <div
                    ref={tooltipRef}
                    className="fixed pointer-events-none opacity-0 bg-card border border-border rounded-lg p-2 shadow-lg transition-opacity duration-200 z-50 whitespace-nowrap"
                    style={{ transition: 'opacity 0.2s' }}
                />,
                document.body
            )}
        </div>
    );
}
