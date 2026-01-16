import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { syncAll } from "@/lib/syncEngine";
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
    pendingDeleteProjectIds,
    pendingDeleteTaskIds,
    pendingDeleteArchivedTaskIds,
  } = useStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autosave Listener
  useEffect(() => {
    if (!session?.user) return;

    const unsub = useStore.subscribe((state, prevState) => {
      // Check if projects or tasks have changed
      if (
        state.tasks !== prevState.tasks ||
        state.projects !== prevState.projects ||
        state.archivedTasks !== prevState.archivedTasks
      ) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
          if (!isPro) {
            // We don't want to spam toast here, but maybe a console log or a silent skip
            return;
          }
          try {
            await syncAll();
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
    session,
    isPro,
    upsertProject,
    upsertTask,
    upsertArchivedTask,
    deleteProject,
    deleteTask,
    deleteArchivedTask,
    pendingDeleteProjectIds,
    pendingDeleteTaskIds,
    pendingDeleteArchivedTaskIds,
  ]);
};
