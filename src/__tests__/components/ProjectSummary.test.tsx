import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectSummary } from "@/components/project-view/ProjectSummary";
import * as useProjectChartDataHook from "@/hooks/useProjectChartData";

// Mock child components to isolate the test
vi.mock("@/components/project-view/ProjectStatsCard", () => ({
  ProjectStatsCard: () => <div data-testid="stats-card">Stats Card</div>,
}));

vi.mock("@/components/project-view/ProjectMiniChart", () => ({
  ProjectMiniChart: () => <div data-testid="mini-chart">Mini Chart</div>,
}));

vi.mock("@/hooks/useProjectChartData");

describe("ProjectSummary", () => {
  it("renders child components and time metrics", () => {
    vi.mocked(useProjectChartDataHook.useProjectChartData).mockReturnValue([
      { date: "Mon", fullDate: "Jan 5", completed: 1, created: 2, timeSpent: 1.5 },
      { date: "Tue", fullDate: "Jan 6", completed: 2, created: 1, timeSpent: 2.5 },
    ]);

    render(<ProjectSummary projectId="p1" projectColor="#000" />);
    expect(screen.getByTestId("stats-card")).toBeInTheDocument();
    expect(screen.getByTestId("mini-chart")).toBeInTheDocument();
  });
});
