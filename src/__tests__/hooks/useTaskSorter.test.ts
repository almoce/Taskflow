import { describe, expect, it } from "vitest";
import { sortTasks } from "@/hooks/useTaskSorter";
import type { Task } from "@/types/task";

const mockTasks: Task[] = [
  {
    id: "1",
    title: "A",
    priority: "low",
    createdAt: "2023-01-01",
    dueDate: "2023-02-01",
    tag: "Bug",
    status: "todo",
    projectId: "p1",
    subtasks: [],
  },
  {
    id: "2",
    title: "B",
    priority: "high",
    createdAt: "2023-01-02",
    dueDate: undefined,
    tag: "Feature",
    status: "todo",
    projectId: "p1",
    subtasks: [],
  },
  {
    id: "3",
    title: "C",
    priority: "medium",
    createdAt: "2023-01-03",
    dueDate: "2023-01-01",
    tag: "Improvement",
    status: "todo",
    projectId: "p1",
    subtasks: [],
  },
];

describe("sortTasks", () => {
  it("sorts by priority asc (low -> high)", () => {
    const sorted = sortTasks(mockTasks, "priority", "asc");
    expect(sorted.map((t) => t.id)).toEqual(["1", "3", "2"]);
  });

  it("sorts by priority desc (high -> low)", () => {
    const sorted = sortTasks(mockTasks, "priority", "desc");
    expect(sorted.map((t) => t.id)).toEqual(["2", "3", "1"]);
  });

  it("sorts by creation date asc (oldest -> newest)", () => {
    const sorted = sortTasks(mockTasks, "date", "asc");
    expect(sorted.map((t) => t.id)).toEqual(["1", "2", "3"]);
  });

  it("sorts by creation date desc (newest -> oldest)", () => {
    const sorted = sortTasks(mockTasks, "date", "desc");
    expect(sorted.map((t) => t.id)).toEqual(["3", "2", "1"]);
  });

  it("sorts by due date asc (soonest -> latest, no due date last)", () => {
    const sorted = sortTasks(mockTasks, "dueDate", "asc");
    // "2023-01-01" (3) -> "2023-02-01" (1) -> undefined (2)
    expect(sorted.map((t) => t.id)).toEqual(["3", "1", "2"]);
  });

  it("sorts by due date desc (latest -> soonest, no due date first)", () => {
    const sorted = sortTasks(mockTasks, "dueDate", "desc");
    // undefined (2) -> "2023-02-01" (1) -> "2023-01-01" (3)
    // Wait, typical desc sort puts MAX at top?
    // Asc logic: dateA - dateB.
    // Desc logic: -(dateA - dateB) = dateB - dateA.
    // If undefined is MAX_SAFE_INTEGER:
    // Asc: 3 (small), 1 (med), 2 (MAX). Order: 3, 1, 2. Correct.
    // Desc: 2 (MAX), 1 (med), 3 (small). Order: 2, 1, 3.
    expect(sorted.map((t) => t.id)).toEqual(["2", "1", "3"]);
  });

  it("sorts by tag asc", () => {
    const sorted = sortTasks(mockTasks, "tag", "asc");
    // Bug (1), Feature (2), Improvement (3)
    expect(sorted.map((t) => t.id)).toEqual(["1", "2", "3"]);
  });

  it("sorts by tag desc", () => {
    const sorted = sortTasks(mockTasks, "tag", "desc");
    // Improvement (3), Feature (2), Bug (1)
    expect(sorted.map((t) => t.id)).toEqual(["3", "2", "1"]);
  });
});
