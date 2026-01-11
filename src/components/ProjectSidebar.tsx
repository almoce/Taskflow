import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Project } from "@/types/task";
import {
	BarChart3,
	ChevronLeft,
	ChevronRight,
	Download,
	Home,
	MoreHorizontal,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProjectSidebarProps {
	projects: Project[];
	selectedProjectId: string | null;
	activeView: "tasks" | "analytics";
	onSelectProject: (id: string | null) => void;
	onSetActiveView: (view: "tasks" | "analytics") => void;
	onEditProject: (project: Project) => void;
	onDeleteProject: (id: string) => void;
	onNewProject: () => void;
	onExport: (id: string) => void;
	getProgress: (id: string) => number;
}

export function ProjectSidebar({
	projects,
	selectedProjectId,
	activeView,
	onSelectProject,
	onSetActiveView,
	onEditProject,
	onDeleteProject,
	onNewProject,
	onExport,
	getProgress,
}: ProjectSidebarProps) {
	const [collapsed, setCollapsed] = useState(() => {
		const saved = localStorage.getItem("sidebar-collapsed");
		return saved ? JSON.parse(saved) : false;
	});

	const toggleCollapsed = () => {
		const newState = !collapsed;
		setCollapsed(newState);
		localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
	};

	return (
		<aside
			className={`h-screen bg-background border-r border-border flex flex-col transition-all duration-200 ${collapsed ? "w-14" : "w-56"}`}
		>
			<div className="h-12 px-2 flex items-center justify-between border-b border-border">
				{!collapsed && (
					<span className="text-sm font-semibold tracking-tight px-2">
						TaskFlow
					</span>
				)}
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-muted-foreground hover:text-foreground"
					onClick={toggleCollapsed}
				>
					{collapsed ? (
						<ChevronRight className="h-4 w-4" />
					) : (
						<ChevronLeft className="h-4 w-4" />
					)}
				</Button>
			</div>

			<nav className="p-2 space-y-0.5">
				<Button
					variant="ghost"
					size="sm"
					className={`w-full h-8 px-2 text-sm font-normal ${collapsed ? "justify-center" : "justify-start"} ${activeView === "tasks" && selectedProjectId === null
							? "bg-secondary text-foreground"
							: "text-muted-foreground hover:text-foreground"
						}`}
					onClick={() => {
						onSelectProject(null);
						onSetActiveView("tasks");
					}}
				>
					<Home className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
					{!collapsed && "Dashboard"}
				</Button>

				<Button
					variant="ghost"
					size="sm"
					className={`w-full h-8 px-2 text-sm font-normal ${collapsed ? "justify-center" : "justify-start"} ${activeView === "analytics"
							? "bg-secondary text-foreground"
							: "text-muted-foreground hover:text-foreground"
						}`}
					onClick={() => onSetActiveView("analytics")}
				>
					<BarChart3 className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
					{!collapsed && "Analytics"}
				</Button>
			</nav>

			<div className="px-3 py-3">
				<div className="flex items-center justify-between">
					{!collapsed && (
						<span className="text-xs font-medium text-muted-foreground">
							Projects
						</span>
					)}
					<Button
						variant="ghost"
						size="icon"
						className={`h-5 w-5 text-muted-foreground hover:text-foreground ${collapsed ? "mx-auto" : ""}`}
						onClick={onNewProject}
					>
						<Plus className="h-3.5 w-3.5" />
					</Button>
				</div>
			</div>

			<ScrollArea className="flex-1 px-2">
				<div className="space-y-0.5">
					{projects.map((project) => {
						const isSelected =
							activeView === "tasks" && selectedProjectId === project.id;
						return (
							<div
								key={project.id}
								className={`group flex items-center rounded-md transition-colors ${isSelected ? "bg-secondary" : "hover:bg-secondary/50"
									}`}
							>
								<Button
									variant="ghost"
									size="sm"
									className={`flex-1 h-8 px-2 hover:bg-transparent ${collapsed ? "justify-center" : "justify-start"}`}
									onClick={() => onSelectProject(project.id)}
								>
									<div
										className={`flex items-center ${collapsed ? "" : "gap-2 w-full"}`}
									>
										{project.icon ? (
											<span className="text-sm flex-shrink-0">
												{project.icon}
											</span>
										) : (
											<div
												className="w-2 h-2 rounded-sm flex-shrink-0"
												style={{ backgroundColor: project.color }}
											/>
										)}
										{!collapsed && (
											<span
												className={`truncate max-w-36 text-sm ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
											>
												{project.name}
											</span>
										)}
									</div>
								</Button>
								{!collapsed && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6 mr-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
											>
												<MoreHorizontal className="h-3.5 w-3.5" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-40">
											<DropdownMenuItem
												onClick={() => onEditProject(project)}
												className="text-sm"
											>
												<Pencil className="h-3.5 w-3.5 mr-2" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => onExport(project.id)}
												className="text-sm"
											>
												<Download className="h-3.5 w-3.5 mr-2" />
												Export
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => onDeleteProject(project.id)}
												className="text-destructive focus:text-destructive text-sm"
											>
												<Trash2 className="h-3.5 w-3.5 mr-2" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								)}
							</div>
						);
					})}

					{projects.length === 0 && !collapsed && (
						<div className="text-center py-6 text-xs text-muted-foreground">
							No projects yet
						</div>
					)}
				</div>
			</ScrollArea>
		</aside>
	);
}
