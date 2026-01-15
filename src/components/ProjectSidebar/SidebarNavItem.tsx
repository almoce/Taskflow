import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

export const SidebarNavItem = ({
  icon: Icon,
  label,
  isActive,
  collapsed,
  onClick,
}: SidebarNavItemProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-full h-8 px-2 text-sm font-normal",
        collapsed ? "justify-center" : "justify-start",
        isActive
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
    >
      <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
      {!collapsed && label}
    </Button>
  );
};
