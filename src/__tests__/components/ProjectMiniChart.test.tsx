import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectMiniChart } from "@/components/project-view/ProjectMiniChart";
import * as useProjectChartDataHook from "@/hooks/useProjectChartData";

vi.mock("@/hooks/useProjectChartData");

describe("ProjectMiniChart", () => {
  it("renders correctly with data", async () => {
    vi.mocked(useProjectChartDataHook.useProjectChartData).mockReturnValue([
      { date: "Mon", fullDate: "Jan 5", completed: 1, created: 2, timeSpent: 1.5 },
      { date: "Tue", fullDate: "Jan 6", completed: 2, created: 1, timeSpent: 3.0 },
    ]);

    // Mock clientWidth
    Object.defineProperty(window.SVGElement.prototype, "clientWidth", {
      value: 500,
      configurable: true,
    });

    render(<ProjectMiniChart projectId="p1" />);

    expect(screen.getByText("Week Activity")).toBeInTheDocument();

    // Wait for D3 to render
    await waitFor(() => {
      const svg = screen.getByTestId("mini-chart-svg");
      expect(svg).toBeInTheDocument();
      // 2 Area paths + 2 Line paths = 4 paths total
      expect(svg.querySelectorAll("path").length).toBe(4);
    });
  });
});
