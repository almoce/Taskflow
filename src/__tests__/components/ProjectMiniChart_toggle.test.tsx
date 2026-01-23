import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectMiniChart } from "@/components/project-view/ProjectMiniChart";
import * as useProjectChartDataHook from "@/hooks/useProjectChartData";

// Mock hooks
vi.mock("@/hooks/useProjectChartData");

describe("ProjectMiniChart Toggle", () => {
  it("should have a row of toggle buttons", () => {
    vi.mocked(useProjectChartDataHook.useProjectChartData).mockReturnValue([]);

    render(<ProjectMiniChart projectId="p1" />);

    // Check for buttons by aria-label
    expect(screen.getByRole("button", { name: "Current Week" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Last Week" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Last 7 Days" })).toBeInTheDocument();
  });

  it("should update chart data when clicking toggle buttons", () => {
    const mockUseProjectChartData = vi.mocked(useProjectChartDataHook.useProjectChartData);
    mockUseProjectChartData.mockReturnValue([]);

    render(<ProjectMiniChart projectId="p1" />);

    // Initial call (current week)
    expect(mockUseProjectChartData).toHaveBeenCalledWith("p1", "week", 0);

    // Click Last Week
    fireEvent.click(screen.getByRole("button", { name: "Last Week" }));
    expect(mockUseProjectChartData).toHaveBeenCalledWith("p1", "week", 1);

    // Click Last 7 Days
    fireEvent.click(screen.getByRole("button", { name: "Last 7 Days" }));
    expect(mockUseProjectChartData).toHaveBeenCalledWith("p1", "last_7_days", 0);

    // Click Current Week
    fireEvent.click(screen.getByRole("button", { name: "Current Week" }));
    expect(mockUseProjectChartData).toHaveBeenCalledWith("p1", "week", 0);
  });
});
