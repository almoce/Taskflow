import { EmojiPicker } from "frimousse";
import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useUmami } from "@/hooks/useUmami";
import { cn } from "@/lib/utils";
import { useProjects, useUI } from "@/store/useStore";
import { PROJECT_COLORS } from "@/types/task";

export function ProjectDialog() {
  const { isProjectDialogOpen, setIsProjectDialogOpen, editingProject, setEditingProject } =
    useUI();
  const { addProject, updateProject, importProject } = useProjects();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { track } = useUmami();

  const open = isProjectDialogOpen || !!editingProject;

  useEffect(() => {
    if (open) {
      if (editingProject) {
        setName(editingProject.name);
        setDescription(editingProject.description || "");
        setColor(editingProject.color);
        setIcon(editingProject.icon);
      } else {
        setName("");
        setDescription("");
        setColor(PROJECT_COLORS[0]);
        setIcon(undefined);
      }
    }
  }, [editingProject, open]);

  const handleOpenChange = (isOpen: boolean) => {
    setIsProjectDialogOpen(isOpen);
    if (!isOpen) {
      setEditingProject(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      if (editingProject) {
        updateProject(editingProject.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          color,
          icon,
        });
      } else {
        addProject(name.trim(), description.trim() || undefined, color, icon);
        track("project_create", { color, hasIcon: !!icon });
      }
      handleOpenChange(false);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Basic validation
        if (json.project && Array.isArray(json.tasks)) {
          importProject(json);
          track("project_import");
          toast.success("Project imported successfully");
          handleOpenChange(false);
        } else {
          toast.error("Invalid project file format");
        }
      } catch (error) {
        console.error("Failed to parse project file", error);
        toast.error("Failed to parse project file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[425px]" hideClose>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
            {!editingProject && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".json"
                  onChange={handleFileImport}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex flex-col items-center gap-4">
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-20 w-20 p-0 rounded-2xl border-2 transition-all",
                    !pickerOpen && "hover:scale-105",
                  )}
                  style={{
                    backgroundColor: !icon ? color : "transparent",
                    borderColor: !icon ? "transparent" : "var(--border)",
                  }}
                >
                  {icon ? (
                    <span className="text-4xl">{icon}</span>
                  ) : (
                    <div className="w-full h-full rounded-2xl" style={{ backgroundColor: color }} />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[352px] p-4 bg-popover border-border" align="center">
                <div className="flex flex-col space-y-4 max-h-[480px]">
                  <div className="space-y-2 shrink-0">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Colors
                    </Label>
                    <div className="grid grid-cols-8 gap-2">
                      {PROJECT_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={cn(
                            "w-6 h-6 rounded-full transition-all hover:scale-110",
                            color === c && !icon
                              ? "ring-2 ring-offset-2 ring-offset-popover ring-primary"
                              : "",
                          )}
                          style={{ backgroundColor: c }}
                          onClick={() => {
                            setColor(c);
                            setIcon(undefined);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Emojis
                    </Label>
                    <div className="h-[250px] w-full border rounded-md overflow-hidden bg-background/50">
                      <EmojiPicker.Root
                        className="flex flex-col h-full w-full isolate overflow-hidden"
                        columns={8}
                        // biome-ignore lint/suspicious/noExplicitAny: emoji-mart types are missing
                        onEmojiSelect={(selection: any) => {
                          const emojiStr =
                            selection.emoji?.emoji || selection.emoji || selection.native;
                          if (emojiStr) {
                            setIcon(emojiStr);
                            setPickerOpen(false);
                          }
                        }}
                      >
                        <EmojiPicker.Search
                          className="w-full px-3 py-2 text-sm border-0 border-b bg-background focus:outline-none focus:ring-0 shrink-0"
                          onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                          placeholder="Search emojis..."
                        />
                        <EmojiPicker.Viewport
                          className="relative flex-1 overflow-y-auto outline-none scrollbar-thin scrollbar-thumb-muted-foreground/20"
                          style={{ height: "300px" }}
                          onWheel={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <EmojiPicker.List
                            className="select-none"
                            components={{
                              CategoryHeader: ({ category, ...props }) => (
                                <div
                                  className="flex items-center h-8 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-popover/95 backdrop-blur-sm sticky top-0 z-20 border-y border-border/50 first:border-t-0"
                                  {...props}
                                >
                                  {category.label}
                                </div>
                              ),
                              Row: ({ children, ...props }) => (
                                <div
                                  className="flex px-1 items-center justify-between overflow-visible"
                                  style={{ height: "40px" }}
                                  {...props}
                                >
                                  {children}
                                </div>
                              ),
                              Emoji: ({ emoji, ...props }) => (
                                <button
                                  className="flex h-9 w-9 items-center justify-center rounded-md text-lg hover:bg-accent transition-all data-[active]:bg-primary/20 "
                                  type="button"
                                  {...props}
                                >
                                  {emoji.emoji}
                                </button>
                              ),
                            }}
                          />
                        </EmojiPicker.Viewport>
                      </EmojiPicker.Root>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-xs text-muted-foreground">Pick a color or emoji</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Enter project name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description (optional)</Label>
              <Textarea
                id="project-description"
                placeholder="What's this project about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-muted/50 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()} className="gradient-primary px-8">
              {editingProject ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
