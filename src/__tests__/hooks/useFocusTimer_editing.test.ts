import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useFocusTimer } from "@/hooks/useFocusTimer";

describe("useFocusTimer Editing Logic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should track dirty state when time is edited", () => {
    const { result } = renderHook(() =>
      useFocusTimer({
        isFocusModeActive: true,
        task: { id: "1" },
        cancelFocusSession: vi.fn(),
        initialTime: 0,
      }),
    );

    // Initially not dirty
    expect(result.current.isDirty).toBe(false);

    // Edit time
    act(() => {
      result.current.handleTimeEdit(5000);
    });

    expect(result.current.isDirty).toBe(true);
    expect(result.current.editedTime).toBe(5000);
  });

  it("should show confirmation when resuming with dirty state", () => {
    const { result } = renderHook(() =>
      useFocusTimer({
        isFocusModeActive: true,
        task: { id: "1" },
        cancelFocusSession: vi.fn(),
        initialTime: 0,
      }),
    );

    // Pause timer
    act(() => {
      result.current.setIsRunning(false);
    });

    // Edit time
    act(() => {
      result.current.handleTimeEdit(5000);
    });

    // Try to toggle resume
    act(() => {
      result.current.toggleTimer();
    });

    expect(result.current.showConfirmResume).toBe(true);
    expect(result.current.isRunning).toBe(false);
  });

  it("should update elapsed time and resume on confirm", () => {
    const { result } = renderHook(() =>
      useFocusTimer({
        isFocusModeActive: true,
        task: { id: "1" },
        cancelFocusSession: vi.fn(),
        initialTime: 0,
      }),
    );

    // Edit time
    act(() => {
      result.current.handleTimeEdit(5000);
    });

    // Confirm
    act(() => {
      result.current.confirmTimeUpdate();
    });

    expect(result.current.elapsedTime).toBe(5000);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isRunning).toBe(true);
  });
});
