import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import type { Project, Task } from "@/types/task";

export const syncProjects = async () => {
  const { session, isPro } = useStore.getState();
  if (!session?.user || !isPro) return;

  const { data: remoteProjects, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error("Error fetching remote projects:", error);
    return;
  }

  const { projects: localProjects, upsertProject, pendingDeleteProjectIds } = useStore.getState();
  const upserts: Project[] = [];

  // 1. Remote -> Local (Down)
  remoteProjects
    .filter((remote) => !pendingDeleteProjectIds.includes(remote.id))
    .forEach((remote) => {
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
    const payload = toUpload.map((p) => ({
      id: p.id,
      user_id: session.user!.id,
      name: p.name,
      description: p.description,
      color: p.color,
      icon: p.icon,
      created_at: p.createdAt,
      updated_at: p.updatedAt || new Date().toISOString(),
    }));

    console.log("DEBUG: Uploading projects payload:", payload);
    console.log("DEBUG: Current User ID:", session.user!.id);

    const { error: uploadError } = await supabase.from("projects").upsert(payload);
    if (uploadError) console.error("Error uploading projects:", uploadError);
  }
};

export const syncTasks = async (projectId?: string) => {
  const { session, isPro } = useStore.getState();
  if (!session?.user || !isPro) return;

  let query = supabase.from("tasks").select("*").eq("is_archived", false);
  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data: remoteTasks, error } = await query;

  if (error) {
    console.error("Error fetching remote tasks:", error);
    return;
  }

  const { tasks: localTasks, upsertTask, pendingDeleteTaskIds } = useStore.getState();
  const upserts: Task[] = [];

  // 1. Remote -> Local (Down)
  remoteTasks
    .filter((remote) => !pendingDeleteTaskIds.includes(remote.id))
    .forEach((remote) => {
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
    // If syncing specific project, skip tasks from other projects
    if (projectId && local.projectId !== projectId) return false;

    // Safety check: Don't upload tasks for projects that don't exist locally
    const projectExists = useStore.getState().projects.some((p) => p.id === local.projectId);
    if (!projectExists) return false;

    const remote = remoteTasks.find((r) => r.id === local.id);
    // If filtering by project, remoteTasks only has that project's tasks.
    // So 'find' is correct for that project.
    
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
      })),
    );
    if (uploadError) console.error("Error uploading tasks:", uploadError);
  }
};

export const syncArchivedTasks = async (projectId?: string) => {
  const { session, isPro } = useStore.getState();
  if (!session?.user || !isPro) return;

  let query = supabase.from("archived_tasks").select("*").eq("is_archived", true);
  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data: remoteTasks, error } = await query;

  if (error) {
    console.error("Error fetching remote archived tasks:", error);
    return;
  }

  const {
    archivedTasks: localTasks,
    upsertArchivedTask,
    pendingDeleteArchivedTaskIds,
  } = useStore.getState();
  const upserts: Task[] = [];

  // 1. Remote -> Local (Down)
  remoteTasks
    .filter((remote) => !pendingDeleteArchivedTaskIds.includes(remote.id))
    .forEach((remote) => {
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

  upserts.forEach((t) => upsertArchivedTask(t));

  // 2. Local -> Remote (Up)
  const toUpload = localTasks.filter((local) => {
    // If syncing specific project, skip tasks from other projects
    if (projectId && local.projectId !== projectId) return false;

    // Safety check: Don't upload tasks for projects that don't exist locally
    const projectExists = useStore.getState().projects.some((p) => p.id === local.projectId);
    if (!projectExists) return false;

    const remote = remoteTasks.find((r) => r.id === local.id);
    if (!remote) return true;
    const remoteTime = new Date(remote.updated_at).getTime();
    const localTime = new Date(local.updatedAt || local.createdAt).getTime();
    return localTime > remoteTime;
  });

  if (toUpload.length > 0) {
    const { error: uploadError } = await supabase.from("archived_tasks").upsert(
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
        is_archived: t.isArchived || true,
      })),
    );
    if (uploadError) console.error("Error uploading archived tasks:", uploadError);
  }
};

export const syncDeletes = async () => {
  const {
    session,
    isPro,
    pendingDeleteProjectIds,
    pendingDeleteTaskIds,
    pendingDeleteArchivedTaskIds,
    removeFromPendingDelete,
  } = useStore.getState();
  if (!session?.user || !isPro) return;

  // Process Projects
  if (pendingDeleteProjectIds.length > 0) {
    const { error } = await supabase.from("projects").delete().in("id", pendingDeleteProjectIds);

    if (!error) {
      // Clear IDs one by one or all at once if we had a clearAll action
      // For now, let's just clear those that were sent
      const idsToClear = [...pendingDeleteProjectIds];
      idsToClear.forEach((id) => removeFromPendingDelete("project", id));
    } else {
      console.error("Error syncing project deletions:", error);
    }
  }

  // Process Tasks
  if (pendingDeleteTaskIds.length > 0) {
    const { error } = await supabase.from("tasks").delete().in("id", pendingDeleteTaskIds);

    if (!error) {
      const idsToClear = [...pendingDeleteTaskIds];
      idsToClear.forEach((id) => removeFromPendingDelete("task", id));
    } else {
      console.error("Error syncing task deletions:", error);
    }
  }

  // Process Archived Tasks
  if (pendingDeleteArchivedTaskIds.length > 0) {
    const { error } = await supabase
      .from("archived_tasks")
      .delete()
      .in("id", pendingDeleteArchivedTaskIds);

    if (!error) {
      const idsToClear = [...pendingDeleteArchivedTaskIds];
      idsToClear.forEach((id) => removeFromPendingDelete("archived_task", id));
    } else {
      console.error("Error syncing archived task deletions:", error);
    }
  }
};

export const syncAll = async () => {
  await syncDeletes();
  await syncProjects();
  await syncTasks();
  await syncArchivedTasks();
};
