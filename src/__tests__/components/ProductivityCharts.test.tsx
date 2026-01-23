import { describe, expect, it, vi } from "vitest";

// Mock the child components to avoid deep rendering issues and D3/SVG errors in JSDOM
vi.mock("@/components/analytics/charts/CompletionSummary", () => ({
  CompletionSummary: vi.fn(() => <div data-testid="completion-summary" />),
}));
vi.mock("@/components/analytics/charts/CompletionTrendChart", () => ({
  CompletionTrendChart: vi.fn(({ data }: any) => (
    <div data-testid="completion-trend-chart">{JSON.stringify(data)}</div>
  )),
}));
vi.mock("@/components/analytics/charts/CompletionBreakdownChart", () => ({
  CompletionBreakdownChart: vi.fn(({ data }: any) => (
    <div data-testid="completion-breakdown-chart">{JSON.stringify(data)}</div>
  )),
}));
vi.mock("@/components/analytics/charts/TaskDistributionChart", () => ({
  TaskDistributionChart: vi.fn(() => <div data-testid="task-distribution-chart" />),
}));

import { render, screen } from "@testing-library/react";
import { format, startOfDay, subDays } from "date-fns";
import { ProductivityCharts } from "@/components/analytics/ProductivityCharts";
import type { Task } from "@/types/task";

describe("ProductivityCharts", () => {
  const today = startOfDay(new Date());
  const todayKey = format(today, "yyyy-MM-dd");
  const yesterday = subDays(today, 1);
  const yesterdayKey = format(yesterday, "yyyy-MM-dd");

  const mockTasks: Task[] = [
    {
      id: "1",
      projectId: "p1",
      title: "Task 1",
      status: "done",
      priority: "medium",
      subtasks: [],
      createdAt: yesterday.toISOString(),
      completedAt: today.toISOString(),
      timeSpentPerDay: {
        [yesterdayKey]: 3600000, // 1h
        [todayKey]: 1800000, // 30m
      },
      totalTimeSpent: 5400000,
    },
  ];

  it("should calculate timeSpent correctly in completionData", () => {
    render(<ProductivityCharts tasks={mockTasks} projects={[]} />);

    const trendChart = screen.getByTestId("completion-trend-chart");
    const data = JSON.parse(trendChart.textContent || "[]");

    // Find today's and yesterday's data in the week view (default)
    const todayData = data.find((d: any) => d.fullDate === format(today, "MMM d"));
    const yesterdayData = data.find((d: any) => d.fullDate === format(yesterday, "MMM d"));

    expect(yesterdayData).toBeDefined();
    expect(yesterdayData.timeSpent).toBe(3600000); // 1h

    expect(todayData).toBeDefined();
    expect(todayData.timeSpent).toBe(1800000); // 30m
  });
});
