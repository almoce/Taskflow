import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import type { Project, Task } from "@/types/task";

export const syncProjects = async () => {
  const { session } = useStore.getState();
  if (!session?.user) return;

  const { data: remoteProjects, error } = await supabase
    .from("projects")
    .select("*");

  if (error) {
    console.error("Error fetching remote projects:", error);
    return;
  }

  const { projects: localProjects, upsertProject } = useStore.getState();
  const upserts: Project[] = [];

  // 1. Remote -> Local (Down)
  remoteProjects.forEach((remote) => {
    const mappedRemote: Project = {
      id: remote.id,
      name: remote.name,
      description: remote.description,
      color: remote.color,
      icon: remote.icon,
      createdAt: remote.created_at,
      updatedAt: remote.updated_at,
    };

    const local = localProjects.find((p) => p.id === remote.id);
    if (!local) {
      upserts.push(mappedRemote);
    } else {
      const remoteTime = new Date(remote.updated_at).getTime();
      const localTime = new Date(local.updatedAt || local.createdAt).getTime();
      if (remoteTime > localTime) {
        upserts.push(mappedRemote);
      }
    }
  });

  upserts.forEach((p) => upsertProject(p));

  // 2. Local -> Remote (Up)
  const toUpload = localProjects.filter((local) => {
    const remote = remoteProjects.find((r) => r.id === local.id);
    if (!remote) return true;
    const remoteTime = new Date(remote.updated_at).getTime();
    const localTime = new Date(local.updatedAt || local.createdAt).getTime();
    return localTime > remoteTime;
  });

  if (toUpload.length > 0) {
    const { error: uploadError } = await supabase.from("projects").upsert(
      toUpload.map((p) => ({
        id: p.id,
        user_id: session.user!.id,
        name: p.name,
        description: p.description,
        color: p.color,
        icon: p.icon,
        created_at: p.createdAt,
        updated_at: p.updatedAt || new Date().toISOString(),
      }))
    );
    if (uploadError) console.error("Error uploading projects:", uploadError);
  }
};

export const syncTasks = async () => {
  const { session } = useStore.getState();
  if (!session?.user) return;

  const { data: remoteTasks, error } = await supabase.from("tasks").select("*");

  if (error) {
    console.error("Error fetching remote tasks:", error);
    return;
  }

  const { tasks: localTasks, upsertTask } = useStore.getState();
  const upserts: Task[] = [];

  // 1. Remote -> Local (Down)
  remoteTasks.forEach((remote) => {
    const mappedRemote: Task = {
      id: remote.id,
      projectId: remote.project_id,
      title: remote.title,
      description: remote.description,
      status: remote.status as Task["status"],
      priority: remote.priority as Task["priority"],
      tag: remote.tag as Task["tag"],
      dueDate: remote.due_date,
      subtasks: remote.subtasks || [],
      createdAt: remote.created_at,
      completedAt: remote.completed_at,
      updatedAt: remote.updated_at,
      isArchived: remote.is_archived,
    };

    const local = localTasks.find((t) => t.id === remote.id);
    if (!local) {
      upserts.push(mappedRemote);
    } else {
      const remoteTime = new Date(remote.updated_at).getTime();
      const localTime = new Date(local.updatedAt || local.createdAt).getTime();
      if (remoteTime > localTime) {
        upserts.push(mappedRemote);
      }
    }
  });

  upserts.forEach((t) => upsertTask(t));

  // 2. Local -> Remote (Up)
  const toUpload = localTasks.filter((local) => {
    const remote = remoteTasks.find((r) => r.id === local.id);
    if (!remote) return true;
    const remoteTime = new Date(remote.updated_at).getTime();
    const localTime = new Date(local.updatedAt || local.createdAt).getTime();
    return localTime > remoteTime;
  });

  if (toUpload.length > 0) {
    const { error: uploadError } = await supabase.from("tasks").upsert(
      toUpload.map((t) => ({
        id: t.id,
        user_id: session.user!.id,
        project_id: t.projectId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        tag: t.tag,
        due_date: t.dueDate,
        subtasks: t.subtasks,
        created_at: t.createdAt,
        completed_at: t.completedAt,
        updated_at: t.updatedAt || new Date().toISOString(),
        is_archived: t.isArchived || false,
      }))
    );
    if (uploadError) console.error("Error uploading tasks:", uploadError);
  }
};

export const syncAll = async () => {
  await syncProjects();
  await syncTasks();
};
