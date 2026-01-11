import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectStatsCard } from "@/components/ProjectStatsCard";
import * as useProjectStatsHook from "@/hooks/useProjectStats";

vi.mock("@/hooks/useProjectStats");

describe("ProjectStatsCard", () => {
  it("renders project information and stats correctly", () => {
    vi.mocked(useProjectStatsHook.useProjectStats).mockReturnValue({
      total: 10,
      todo: 5,
      inProgress: 2,
      done: 3,
      progress: 30,
    });

    render(
      <ProjectStatsCard
        projectId="p1"
        projectName="Test Project"
        projectIcon="🚀"
        projectColor="#8B5CF6"
      />
    );

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("🚀")).toBeInTheDocument();
    expect(screen.getByText("30% Complete")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // todo
    expect(screen.getByText("2")).toBeInTheDocument(); // inProgress
    expect(screen.getByText("3")).toBeInTheDocument(); // done
    expect(screen.getByText("3 / 10 Tasks")).toBeInTheDocument();
  });
});
