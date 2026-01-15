import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth, useStore } from "@/store/useStore";
import { syncAll } from "@/lib/syncEngine";
import type { Project, Task } from "@/types/task";
import { toast } from "sonner";

export const useRealtimeSync = () => {
  const { session } = useAuth();
  const { upsertProject, upsertTask, deleteProject, deleteTask } = useStore();

  useEffect(() => {
    if (!session?.user) return;

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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const remote = payload.new as any;
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
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
           if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const remote = payload.new as any;
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, upsertProject, upsertTask, deleteProject, deleteTask]);
};
