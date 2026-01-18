import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectMiniChart } from "@/components/project-view/ProjectMiniChart";
import * as useProjectChartDataHook from "@/hooks/useProjectChartData";

vi.mock("@/hooks/useProjectChartData");

describe("ProjectMiniChart", () => {
  it("renders correctly with data", () => {
    vi.mocked(useProjectChartDataHook.useProjectChartData).mockReturnValue([
      { date: "Mon", fullDate: "Jan 5", completed: 1, created: 2 },
      { date: "Tue", fullDate: "Jan 6", completed: 2, created: 1 },
    ]);

    render(<ProjectMiniChart projectId="p1" />);

    expect(screen.getByText("Week Activity")).toBeInTheDocument();
    // SVG is rendered
    expect(document.querySelector("svg")).toBeInTheDocument();
  });
});
