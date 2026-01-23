import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductivityCharts } from "@/components/analytics/ProductivityCharts";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Task } from "@/types/task";

// Mock the child components to avoid deep rendering issues and D3/SVG errors in JSDOM
vi.mock("@/components/charts/AreaChart", () => ({
  AreaChart: () => <div data-testid="area-chart" />,
}));
vi.mock("@/components/charts/BarChart", () => ({
  BarChart: () => <div data-testid="bar-chart" />,
}));
vi.mock("@/components/analytics/charts/CompletionTrendChart", () => ({
  CompletionTrendChart: () => <div data-testid="trend-chart" />,
}));
vi.mock("@/components/analytics/charts/CompletionBreakdownChart", () => ({
  CompletionBreakdownChart: () => <div data-testid="breakdown-chart" />,
}));
vi.mock("@/components/analytics/charts/TaskDistributionChart", () => ({
  TaskDistributionChart: () => <div data-testid="distribution-chart" />,
}));
vi.mock("@/components/analytics/charts/CompletionSummary", () => ({
  CompletionSummary: () => <div data-testid="summary" />,
}));

describe("ProductivityCharts Toggle", () => {
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Test Task",
      projectId: "p1",
      status: "done",
      priority: "medium",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      subtasks: [],
      isArchived: false,
    },
  ];

  it("should render the week range label", () => {
    render(
      <TooltipProvider>
        <ProductivityCharts tasks={mockTasks} projects={[]} />
      </TooltipProvider>
    );
    expect(screen.getByText(/Productivity Overview/i)).toBeInTheDocument();
  });

  it("should toggle between current and last week when the button is clicked", () => {
    render(
      <TooltipProvider>
        <ProductivityCharts tasks={mockTasks} projects={[]} />
      </TooltipProvider>
    );
    
    // Check for the toggle buttons
    const prevButton = screen.getByRole("button", { name: /Previous Week/i });
    const nextButton = screen.getByRole("button", { name: /Next Week/i });
    
    expect(nextButton).toBeDisabled(); // Initially on current week (offset 0)
    expect(prevButton).not.toBeDisabled();
    
    fireEvent.click(prevButton);
    
    // Offset 1
    expect(nextButton).not.toBeDisabled();
    expect(prevButton).not.toBeDisabled(); // Can go back further now
    
    // Go back again -> Offset 2
    fireEvent.click(prevButton);
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    
    // Go forward -> Offset 1
    fireEvent.click(nextButton);
    expect(nextButton).not.toBeDisabled();
    
    // Go forward -> Offset 0
    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
  });
});
