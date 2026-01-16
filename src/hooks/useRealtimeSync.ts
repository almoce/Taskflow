import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { syncAll, syncArchivedTasks, syncProjects, syncTasks } from "@/lib/syncEngine";
import { useAuth, useStore } from "@/store/useStore";
import type { Project, Task } from "@/types/task";

export const useRealtimeSync = () => {
  const { session, isPro } = useAuth();
  const {
    upsertProject,
    upsertTask,
    upsertArchivedTask,
    deleteProject,
    deleteTask,
    deleteArchivedTask,
  } = useStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef({ projects: false, tasks: false, archived: false });

  // Autosave Listener
  useEffect(() => {
    if (!session?.user) return;

    const unsub = useStore.subscribe((state, prevState) => {
      // Check what changed and update dirty flags
      if (state.projects !== prevState.projects) dirtyRef.current.projects = true;
      if (state.tasks !== prevState.tasks) dirtyRef.current.tasks = true;
      if (state.archivedTasks !== prevState.archivedTasks) dirtyRef.current.archived = true;

      // If any change occurred, schedule sync
      if (dirtyRef.current.projects || dirtyRef.current.tasks || dirtyRef.current.archived) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
          if (!isPro) return;

          try {
            // Execute granular syncs based on what changed
            if (dirtyRef.current.projects) await syncProjects();
            if (dirtyRef.current.tasks) await syncTasks();
            if (dirtyRef.current.archived) await syncArchivedTasks();

            // Reset flags after sync attempts
            dirtyRef.current = { projects: false, tasks: false, archived: false };
          } catch (e) {
            console.error("Autosave failed", e);
          }
        }, 1000); // 1 second debounce
      }
    });

    return () => {
      unsub();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [session, isPro]);

  // Profile Realtime Listener (Upgrades/Downgrades)
  useEffect(() => {
    if (!session?.user) return;

    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${session.user.id}`,
        },
        (payload) => {
          const newProfile = payload.new as any;
          useStore.getState().fetchProfile(); // Re-fetch to update store state

          if (newProfile.is_pro) {
            toast.success("You are now a Pro member!");
          } else {
            // Optional: toast("Your Pro subscription has ended.");
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  // Main Sync Logic (Projects & Tasks) - Only for Pro Users
  useEffect(() => {
    if (!session?.user || !isPro) return;

    const performSync = async () => {
      // Optional: toast.loading("Syncing...") if we want visual feedback
      // But for background sync, maybe silent is better, or only on error.
      // Let's keep it silent for now or maybe just log.
      try {
        await syncAll();
      } catch (e) {
        console.error("Sync failed", e);
      }
    };

    performSync();

    // Realtime Subscriptions
    const channel = supabase
      .channel("db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const remote = payload.new as any;
          // Use getState() to avoid stale closure issues without re-subscribing
          const { pendingDeleteProjectIds } = useStore.getState();
          if (pendingDeleteProjectIds.includes(remote.id)) return;

          const project: Project = {
            id: remote.id,
            name: remote.name,
            description: remote.description,
            color: remote.color,
            icon: remote.icon,
            createdAt: remote.created_at,
            updatedAt: remote.updated_at,
          };
          upsertProject(project);
        } else if (payload.eventType === "DELETE") {
          deleteProject(payload.old.id);
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const remote = payload.new as any;
          const { pendingDeleteTaskIds } = useStore.getState();
          if (pendingDeleteTaskIds.includes(remote.id)) return;

          const task: Task = {
            id: remote.id,
            projectId: remote.project_id,
            title: remote.title,
            description: remote.description,
            status: remote.status,
            priority: remote.priority,
            tag: remote.tag,
            dueDate: remote.due_date,
            subtasks: remote.subtasks,
            createdAt: remote.created_at,
            completedAt: remote.completed_at,
            updatedAt: remote.updated_at,
            isArchived: remote.is_archived,
          };
          upsertTask(task);
        } else if (payload.eventType === "DELETE") {
          deleteTask(payload.old.id);
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "archived_tasks" }, (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const remote = payload.new as any;
          const { pendingDeleteArchivedTaskIds } = useStore.getState();
          if (pendingDeleteArchivedTaskIds.includes(remote.id)) return;

          const task: Task = {
            id: remote.id,
            projectId: remote.project_id,
            title: remote.title,
            description: remote.description,
            status: remote.status,
            priority: remote.priority,
            tag: remote.tag,
            dueDate: remote.due_date,
            subtasks: remote.subtasks,
            createdAt: remote.created_at,
            completedAt: remote.completed_at,
            updatedAt: remote.updated_at,
            isArchived: remote.is_archived,
          };
          upsertArchivedTask(task);
        } else if (payload.eventType === "DELETE") {
          deleteArchivedTask(payload.old.id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    session?.user?.id,
    isPro,
    upsertProject,
    upsertTask,
    upsertArchivedTask,
    deleteProject,
    deleteTask,
    deleteArchivedTask,
    // We remove unstable dependencies that might change often but shouldn't trigger re-subscription
    // pendingDelete arrays might change, but do we want to re-subscribe?
    // The callback closes over the values?
    // No, the callback is defined INSIDE the effect.
    // So if pendingDelete arrays change, we NEED to re-run the effect to update the closure?
    // OR we use a ref for pendingDeletes.
    // Re-subscribing on every delete action is bad.
    // I should use `useStore.getState().pendingDelete...` inside the callback instead of dependency.
  ]);
};
