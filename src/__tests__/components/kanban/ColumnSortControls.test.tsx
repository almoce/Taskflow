import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ColumnSortControls } from "@/components/kanban/ColumnSortControls";
import { useStore } from "@/store/useStore";

vi.mock("@/store/useStore", () => ({
  useStore: vi.fn(),
}));

describe("ColumnSortControls", () => {
  const mockSetColumnSort = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all criteria buttons", () => {
    vi.mocked(useStore).mockReturnValue({}); // columnSort is undefined
    render(<ColumnSortControls columnId="todo" />);
    
    expect(screen.getByTitle("Sort by Priority")).toBeInTheDocument();
    expect(screen.getByTitle("Sort by Created")).toBeInTheDocument();
    expect(screen.getByTitle("Sort by Due")).toBeInTheDocument();
    expect(screen.getByTitle("Sort by Tag")).toBeInTheDocument();
  });

  it("calls setColumnSort when a button is clicked", () => {
    vi.mocked(useStore).mockImplementation((selector: any) => {
      if (typeof selector === "function") {
        const state = {
          columnSorts: {},
          setColumnSort: mockSetColumnSort,
        };
        return selector(state);
      }
      return {};
    });

    render(<ColumnSortControls columnId="todo" />);
    
    fireEvent.click(screen.getByTitle("Sort by Priority"));
    expect(mockSetColumnSort).toHaveBeenCalledWith("todo", { criteria: "priority", direction: "asc" });
  });
});
