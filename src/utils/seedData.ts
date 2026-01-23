import { useStore } from "@/store/useStore";
import {
  PROJECT_COLORS,
  type Priority,
  type Task,
  type TaskStatus,
  type TaskTag,
} from "../types/task";

const PROJECT_TEMPLATES = [
  {
    name: "Website Redesign",
    description: "Overhaul the company website with modern design",
    icon: "🎨",
  },
  { name: "Mobile App", description: "Develop iOS and Android applications", icon: "📱" },
  { name: "Marketing Campaign", description: "Q4 Marketing push", icon: "🚀" },
  { name: "Backend Migration", description: "Migrate legacy backend to Node.js", icon: "🔧" },
  { name: "Team Offsite", description: "Plan the annual team retreat", icon: "🌴" },
  { name: "Customer Support", description: "Track and resolve user tickets", icon: "🎧" },
  { name: "Q1 Hiring", description: "Recruit top talent for engineering", icon: "🤝" },
  { name: "Brand Identity", description: "Refresh logo and brand guidelines", icon: "✨" },
  { name: "Security Audit", description: "Annual security compliance check", icon: "🔒" },
  { name: "Product Launch", description: "Launch the new flagship feature", icon: "📣" },
];

const TASK_TITLES = [
  "Design Homepage",
  "Implement Login",
  "Fix Navigation Bug",
  "Write Documentation",
  "Setup Database",
  "Create API Endpoints",
  "Test Payment Gateway",
  "Optimize Images",
  "Code Review",
  "Deploy to Staging",
  "User Interview",
  "Analyze Metrics",
  "Refactor Auth",
  "Update Dependencies",
  "Fix CSS Glitch",
  "Write Unit Tests",
  "Configure CI/CD",
  "Design Icon Set",
  "Draft Blog Post",
  "Record Demo Video",
];

const DESCRIPTIONS = [
  "Need to ensure pixel perfect implementation.",
  "Follow the design specs attached in Figma.",
  "Critical priority, affects all users.",
  "Take your time but ensure high quality.",
  "Coordinate with the design team.",
  "Check existing patterns before starting.",
  "Make sure to handle edge cases.",
];

const TAGS: TaskTag[] = ["Feature", "Bug", "Improvement"];
const PRIORITIES: Priority[] = ["high", "medium", "low"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  ).toISOString();
}

function subDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export const generateSeedData = () => {
  const store = useStore.getState();

  // 1. Clear existing data
  store.reset();

  const now = new Date();
  const sixtyDaysAgo = subDays(now, 60);

  // 2. Generate Projects
  PROJECT_TEMPLATES.forEach((tmpl, index) => {
    const color = PROJECT_COLORS[index % PROJECT_COLORS.length];
    const useIcon = Math.random() > 0.2; // 80% chance of icon

    const project = store.addProject(
      tmpl.name,
      tmpl.description,
      color,
      useIcon ? tmpl.icon : undefined,
    );

    // 3. Generate Tasks for this project (15-25 tasks)
    const numTasks = Math.floor(Math.random() * 11) + 15;

    for (let i = 0; i < numTasks; i++) {
      const title = getRandomItem(TASK_TITLES);
      const priority = getRandomItem(PRIORITIES);
      const tag = getRandomItem(TAGS);

      const task = store.addTask(project.id, title, priority, tag);

      // Determine Status & Dates
      const statusRoll = Math.random();
      let status: TaskStatus = "todo";
      const createdAt = getRandomDate(sixtyDaysAgo, now);
      let completedAt: string | undefined;
      let isArchived = false;

      // ~40% Done, ~30% In Progress, ~30% Todo
      if (statusRoll < 0.4) {
        status = "done";
        // Completion date must be after creation
        const createdDate = new Date(createdAt);
        // Ensure completion is within range (after created, before now)
        completedAt = getRandomDate(createdDate, now);

        // 20% chance to archive completed tasks
        if (Math.random() < 0.2) {
          isArchived = true;
        }
      } else if (statusRoll < 0.7) {
        status = "in-progress";
      } else {
        status = "todo";
      }

      const description = getRandomItem(DESCRIPTIONS);
      const dueDate =
        Math.random() > 0.4
          ? getRandomDate(now, new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)) // Next 14 days
          : undefined;

      // Generate Focus Time (totalTimeSpent)
      // Only for non-todo tasks, or randomly some todo tasks (maybe they started but didn't finish)
      // Let's say only for in-progress and done.
      let totalTimeSpent = 0;
      const timeSpentPerDay: Record<string, number> = {};

      if (status !== "todo") {
        // Random time between 15 mins (900000ms) and 4 hours (14400000ms)
        totalTimeSpent = Math.floor(Math.random() * (14400000 - 900000 + 1)) + 900000;

        // Attribute to a date
        let dateStr: string;
        if (completedAt) {
          dateStr = completedAt.split("T")[0];
        } else {
          // For in-progress, use today or recent
          dateStr = new Date().toISOString().split("T")[0];
        }
        timeSpentPerDay[dateStr] = totalTimeSpent;
      }

      const updates: Partial<Task> = {
        description,
        status,
        dueDate,
        createdAt, // Overwrite with historical date
        totalTimeSpent,
        timeSpentPerDay,
      };

      if (status === "done") {
        updates.completedAt = completedAt;
      }

      if (isArchived) {
        updates.isArchived = true;
      }

      store.updateTask(task.id, updates);
    }
  });

  console.log("Enhanced seed data generated successfully");
};
