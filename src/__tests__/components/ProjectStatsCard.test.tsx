import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectStatsCard } from "@/components/ProjectStatsCard";
import * as useProjectStatsHook from "@/hooks/useProjectStats";

vi.mock("@/hooks/useProjectStats");

describe("ProjectStatsCard", () => {
  it("renders project stats correctly", () => {
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
        projectColor="#8B5CF6"
      />
    );

    expect(screen.getByText("Current Status")).toBeInTheDocument();
    expect(screen.getByText("30% Complete")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // todo
    expect(screen.getByText("2")).toBeInTheDocument(); // inProgress
    expect(screen.getByText("3")).toBeInTheDocument(); // done
  });
});