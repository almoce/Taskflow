import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { createPortal } from 'react-dom';
import { Task } from '@/types/task';

interface BubbleChartProps {
    tasks: Task[];
    groupBy: 'overview' | 'status' | 'priority' | 'tag';
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
}

const COLORS = {
    status: {
        'todo': 'hsl(var(--muted-foreground))',
        'in-progress': 'hsl(var(--primary))',
        'done': 'hsl(142 76% 36%)',
    },
    priority: {
        'high': 'hsl(0 84% 60%)',
        'medium': 'hsl(38 92% 50%)',
        'low': 'hsl(142 76% 36%)',
    },
    tag: {
        'Bug': '#f43f5e',
        'Feature': '#6366f1',
        'Improvement': '#06b6d4',
        'Other': '#94a3b8',
    }
} as const;

export function BubbleChart({ tasks, groupBy, height = 400 }: BubbleChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const simulationRef = useRef<d3.Simulation<TaskNode, undefined> | null>(null);
    const [tooltipData, setTooltipData] = useState<{
        x: number;
        y: number;
        visible: boolean;
        task?: TaskNode;
    }>({ x: 0, y: 0, visible: false });

    const nodes = useMemo(() => {
        if (groupBy === 'overview') {
            const allNodes: TaskNode[] = [];
            tasks.forEach(task => {
                // Status bubble
                allNodes.push({
                    id: `${task.id}-status`,
                    title: task.title,
                    category: 'Overview',
                    displayValue: task.status,
                    color: COLORS.status[task.status as keyof typeof COLORS.status] || '#94a3b8',
                    radius: 7,
                    type: 'Status',
                });
                // Priority bubble
                allNodes.push({
                    id: `${task.id}-priority`,
                    title: task.title,
                    category: 'Overview',
                    displayValue: task.priority,
                    color: COLORS.priority[task.priority as keyof typeof COLORS.priority] || '#94a3b8',
                    radius: 7,
                    type: 'Priority',
                });
                // Tag bubble
                if (task.tag) {
                    allNodes.push({
                        id: `${task.id}-tag`,
                        title: task.title,
                        category: 'Overview',
                        displayValue: task.tag,
                        color: COLORS.tag[task.tag as keyof typeof COLORS.tag] || '#94a3b8',
                        radius: 7,
                        type: 'Tag',
                    });
                }
            });
            return allNodes;
        }

        return tasks.map((task) => {
            let category = 'Other';
            let color = '#94a3b8';

            if (groupBy === 'status') {
                category = task.status;
                color = COLORS.status[task.status as keyof typeof COLORS.status] || color;
            } else if (groupBy === 'priority') {
                category = task.priority;
                color = COLORS.priority[task.priority as keyof typeof COLORS.priority] || color;
            } else if (groupBy === 'tag') {
                category = task.tag || 'Uncategorized';
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
        const g = svg.select('g').empty() ? svg.append('g') : svg.select<SVGGElement>('g');

        // Create categories for foci
        const categories = Array.from(new Set(nodes.map(n => n.category))).sort();
        const padding = 60;

        const fociX = d3.scalePoint()
            .domain(categories)
            .range(categories.length > 1 ? [padding, width - padding] : [width / 2, width / 2])
            .padding(0.5);

        // Category Labels - Render these first
        g.selectAll('.category-label').remove();
        g.selectAll('.category-label')
            .data(categories)
            .enter()
            .append('text')
            .attr('class', 'category-label')
            .attr('x', d => fociX(d) || width / 2)
            .attr('y', height - 20)
            .attr('text-anchor', 'middle')
            .attr('fill', 'hsl(var(--muted-foreground))')
            .attr('font-size', '12px')
            .attr('font-weight', '600')
            .attr('pointer-events', 'none')
            .attr('opacity', 0)
            .text(d => d.charAt(0).toUpperCase() + d.slice(1))
            .transition()
            .duration(300)
            .attr('opacity', 1);

        // Update or create simulation
        if (!simulationRef.current) {
            simulationRef.current = d3.forceSimulation<TaskNode>(nodes)
                .force('charge', d3.forceManyBody().strength(-15))
                .force('collide', d3.forceCollide<TaskNode>(d => d.radius + 2))
                .force('y-center', d3.forceY(height / 2).strength(0.05));
        } else {
            simulationRef.current.nodes(nodes);
        }

        const simulation = simulationRef.current;

        // Reset positions for "drop from top" effect on mode change
        nodes.forEach(node => {
            node.x = fociX(node.category) || width / 2;
            node.y = -50; // Start outside the top
            node.vx = 0;
            node.vy = 0;
        });

        simulation.force('x', d3.forceX<TaskNode>(d => fociX(d.category) || width / 2).strength(0.35));
        simulation.force('y', d3.forceY<TaskNode>(height / 2).strength(0.15));

        // Delay the bubble drop slightly to let labels appear
        setTimeout(() => {
            simulation.alpha(1).restart();
        }, 100);

        // Bind data to bubbles
        const bubbles = g.selectAll<SVGGElement, TaskNode>('.task-bubble')
            .data(nodes, d => d.id);

        // Exit
        bubbles.exit().remove();

        // Enter
        const bubblesEnter = bubbles.enter()
            .append('g')
            .attr('class', 'task-bubble');

        bubblesEnter.append('circle')
            .attr('r', d => d.radius)
            .style('cursor', 'pointer');

        // Merge and update
        const bubblesMerged = bubblesEnter.merge(bubbles);

        bubblesMerged.select('circle')
            .transition()
            .duration(500)
            .attr('fill', d => d.color)
            .attr('stroke', d => d.color)
            .attr('stroke-width', 1)
            .attr('opacity', 0.8);

        bubblesMerged
            .on('mouseenter', function (event, d) {
                d3.select(this).select('circle')
                    .transition().duration(200)
                    .attr('opacity', 1)
                    .attr('r', 12);

                setTooltipData({
                    x: event.clientX,
                    y: event.clientY,
                    visible: true,
                    task: d,
                });
            })
            .on('mousemove', (event) => {
                setTooltipData(prev => ({ ...prev, x: event.clientX, y: event.clientY }));
            })
            .on('mouseleave', function () {
                d3.select(this).select('circle')
                    .transition().duration(200)
                    .attr('opacity', 0.8)
                    .attr('r', 8);

                setTooltipData(prev => ({ ...prev, visible: false }));
            });

        simulation.on('tick', () => {
            bubblesMerged.attr('transform', d => `translate(${d.x},${d.y})`);
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
            {tooltipData.visible && tooltipData.task && createPortal(
                <div
                    className="fixed pointer-events-none bg-card border border-border rounded-lg p-2 shadow-lg z-[100] whitespace-nowrap"
                    style={{
                        left: tooltipData.x + 16,
                        top: tooltipData.y - 16,
                        transform: 'translateY(-100%)',
                    }}
                >
                    <div className="text-xs font-medium mb-1">{tooltipData.task.title}</div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="w-2 h-2 rounded-full" style={{ background: tooltipData.task.color }}></span>
                        <span>{tooltipData.task.type ? `${tooltipData.task.type}: ${tooltipData.task.displayValue}` : tooltipData.task.displayValue}</span>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
