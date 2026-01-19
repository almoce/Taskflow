import { renderHook, act } from "@testing-library/react";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("useFocusTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should NOT reset timer when task object changes but id is same", () => {
    const task1 = { id: "1", description: "Task 1" };
    const task2 = { id: "1", description: "Task 1 Updated" }; // Same ID, different object

    const { result, rerender } = renderHook(
      (props) => useFocusTimer(props),
      {
        initialProps: {
          isFocusModeActive: true,
          task: task1,
          cancelFocusSession: vi.fn(),
        },
      }
    );

    // Initial state
    expect(result.current.isRunning).toBe(true);
    expect(result.current.elapsedTime).toBe(0);

    // Advance time by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.elapsedTime).toBe(5000);

    // Rerender with new task object (same ID)
    rerender({
      isFocusModeActive: true,
      task: task2,
      cancelFocusSession: vi.fn(),
    });

    // Check if timer reset (IT SHOULD NOT, but currently it likely does)
    expect(result.current.elapsedTime).toBe(5000);
  });
});
