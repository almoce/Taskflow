import { Archive, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Input } from "@/components/ui/input";
import { useArchivedTasks, useProjects, useTasks } from "@/store/useStore";

export function ArchivedView() {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedProjectId } = useProjects();
  const { updateTask, unarchiveTask } = useTasks();
  const { archivedTasks, deleteArchivedTask } = useArchivedTasks();

  const filteredTasks = useMemo(() => {
    let tasks = archivedTasks;

    // Filter by project if one is selected
    if (selectedProjectId) {
      tasks = tasks.filter((t) => t.projectId === selectedProjectId);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query),
      );
    }

    return tasks;
  }, [archivedTasks, selectedProjectId, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-muted rounded-lg">
            <Archive className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Archived Tasks</h2>
            <p className="text-sm text-muted-foreground">
              Manage and search through your archived tasks
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search archived tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed border-border/50">
          <div className="p-4 bg-muted rounded-full mb-4">
            <Archive className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-medium">No archived tasks found</h3>
          <p className="text-sm text-muted-foreground max-w-xs text-center mt-1">
            {searchQuery
              ? "We couldn't find any archived tasks matching your search."
              : "When you archive tasks, they'll appear here for your reference."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="relative group">
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Individual actions if needed, but TaskCard already has its own menu */}
              </div>
              <TaskCard
                task={task}
                onUpdate={(updates) => updateTask(task.id, updates)}
                onDelete={() => deleteArchivedTask(task.id)}
                onArchive={() => unarchiveTask(task.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
