import type { StateCreator } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { type Project, PROJECT_COLORS } from "@/types/task";
import type { StoreState, ProjectSlice } from "../types";

const generateId = () => uuidv4();

export const createProjectSlice: StateCreator<StoreState, [], [], ProjectSlice> = (set, get) => ({
  projects: [],
  selectedProjectId: null,

  addProject: (name, description, color, icon) => {
    const { projects } = get();
    const usedColors = projects.map((p) => p.color);
    const defaultAvailableColor =
      PROJECT_COLORS.find((c) => !usedColors.includes(c)) || PROJECT_COLORS[0];

    const project: Project = {
      id: generateId(),
      name,
      description,
      color: color || defaultAvailableColor,
      icon,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      projects: [...state.projects, project],
      selectedProjectId: project.id,
    }));
    return project;
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      // Cross-slice state update: removing tasks associated with the project
      tasks: state.tasks.filter((t) => t.projectId !== id),
      selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
    }));
  },

  selectProject: (id) => {
    // Cross-slice state update: resetting active view to 'tasks'
    set((state) => ({ selectedProjectId: id, activeView: "tasks" }));
  },

  importProject: (data) => {
    const { project, tasks } = data;
    const newProjectId = generateId();

    const newProject: Project = {
      ...project,
      id: newProjectId,
      name: `${project.name} (Imported)`, // Append (Imported) to avoid confusion
      createdAt: new Date().toISOString(),
    };

    const newTasks = tasks.map((t) => ({
      ...t,
      id: generateId(),
      projectId: newProjectId,
    }));

    set((state) => ({
      projects: [...state.projects, newProject],
      // Cross-slice state update
      tasks: [...state.tasks, ...newTasks],
      selectedProjectId: newProjectId,
    }));
  },

  getProjectExportData: (projectId) => {
    const { projects, tasks } = get();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const projectTasks = tasks.filter((t) => t.projectId === projectId);

    return {
      project,
      tasks: projectTasks,
      version: 1,
    };
  },
});
