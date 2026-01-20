import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { FocusOverlay } from "@/components/focus/FocusOverlay";
import * as useStore from "@/store/useStore";

// Mock the stores
const mockUseFocus = vi.fn();
const mockUseTasks = vi.fn();

vi.mock("@/store/useStore", () => ({
  useFocus: () => mockUseFocus(),
  useTasks: () => mockUseTasks(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
  },
}));

describe("FocusOverlay", () => {
  const mockTask = {
    id: "task-1",
    title: "Test Task",
    description: "This is a test task",
    status: "todo",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseFocus.mockReturnValue({
      isFocusModeActive: true,
      activeFocusTaskId: "task-1",
      endFocusSession: vi.fn(),
      cancelFocusSession: vi.fn(),
      updateTaskTime: vi.fn(),
    });

    mockUseTasks.mockReturnValue({
      tasks: [mockTask],
      updateTask: vi.fn(),
    });
  });

  it("renders nothing when focus mode is inactive", () => {
    mockUseFocus.mockReturnValue({
      isFocusModeActive: false,
      activeFocusTaskId: null,
    });

    const { container } = render(<FocusOverlay />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders timer view when active", () => {
    render(<FocusOverlay />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(6);
  });

  it("toggles timer on button click", () => {
    render(<FocusOverlay />);
    
    // Initial state: running (auto-start) -> Pause button visible
    const pauseButton = screen.getByRole("button", { name: "Pause timer" });
    fireEvent.click(pauseButton);
    
    // Now it should be paused -> Start button visible
    expect(screen.getByRole("button", { name: "Start timer" })).toBeInTheDocument();
    
    // Resume
    const startButton = screen.getByRole("button", { name: "Start timer" });
    fireEvent.click(startButton);
    
    expect(screen.getByRole("button", { name: "Pause timer" })).toBeInTheDocument();
  });

  it("shows summary view on 'Complete Task'", () => {
    render(<FocusOverlay />);
    
    const completeButton = screen.getByRole("button", { name: "Complete task" });
    fireEvent.click(completeButton);
    
    expect(screen.getByText("Session Complete")).toBeInTheDocument();
  });
});
