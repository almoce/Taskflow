import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectSummary } from "@/components/project-view/ProjectSummary";

// Mock child components to isolate the test
vi.mock("@/components/project-view/ProjectStatsCard", () => ({
  ProjectStatsCard: () => <div data-testid="stats-card">Stats Card</div>,
}));

vi.mock("@/components/project-view/ProjectMiniChart", () => ({
  ProjectMiniChart: () => <div data-testid="mini-chart">Mini Chart</div>,
}));

describe("ProjectSummary", () => {
  it("renders both child components", () => {
    render(<ProjectSummary projectId="p1" projectColor="#000" />);
    expect(screen.getByTestId("stats-card")).toBeInTheDocument();
    expect(screen.getByTestId("mini-chart")).toBeInTheDocument();
  });
});
