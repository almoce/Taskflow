import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Project, PROJECT_COLORS } from '@/types/task';
import { cn } from '@/lib/utils';

const EMOJI_OPTIONS = [
    '📁', '📂', '📋', '📝', '✨', '🚀', '💡', '🎯',
    '🔥', '⭐', '💪', '🎨', '🔧', '💻', '📱', '🌟',
    '🏠', '💼', '📊', '📈', '🎬', '🎮', '🎵', '📚',
    '🌈', '🌸', '🍀', '🎁', '❤️', '💎', '🏆', '⚡',
];

interface ProjectDialogProps {
    project?: Project | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (name: string, description?: string, color?: string, icon?: string) => void;
}

export function ProjectDialog({ project, open, onOpenChange, onSubmit }: ProjectDialogProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(PROJECT_COLORS[0]);
    const [icon, setIcon] = useState<string | undefined>(undefined);
    const [pickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        if (open) {
            if (project) {
                setName(project.name);
                setDescription(project.description || '');
                setColor(project.color);
                setIcon(project.icon);
            } else {
                setName('');
                setDescription('');
                setColor(PROJECT_COLORS[0]);
                setIcon(undefined);
            }
        }
    }, [project, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim(), description.trim() || undefined, color, icon);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
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
                                        !pickerOpen && "hover:scale-105"
                                    )}
                                    style={{
                                        backgroundColor: !icon ? color : 'transparent',
                                        borderColor: !icon ? 'transparent' : 'hsl(var(--border))'
                                    }}
                                >
                                    {icon ? (
                                        <span className="text-4xl">{icon}</span>
                                    ) : (
                                        <div className="w-full h-full rounded-2xl" style={{ backgroundColor: color }} />
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4 bg-popover border-border" align="center">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Colors</Label>
                                        <div className="grid grid-cols-8 gap-2">
                                            {PROJECT_COLORS.map((c) => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    className={cn(
                                                        "w-6 h-6 rounded-full transition-all hover:scale-110",
                                                        color === c && !icon ? "ring-2 ring-offset-2 ring-offset-popover ring-primary" : ""
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
                                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Emojis</Label>
                                        <div className="grid grid-cols-8 gap-1">
                                            {EMOJI_OPTIONS.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    className={cn(
                                                        "h-8 w-8 flex items-center justify-center rounded hover:bg-accent transition-colors text-lg",
                                                        icon === emoji && "bg-accent ring-2 ring-primary"
                                                    )}
                                                    onClick={() => {
                                                        setIcon(emoji);
                                                        setPickerOpen(false);
                                                    }}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
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
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!name.trim()} className="gradient-primary px-8">
                            {project ? 'Save Changes' : 'Create Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
