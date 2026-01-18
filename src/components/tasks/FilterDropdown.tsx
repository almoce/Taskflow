import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
  color?: string;
  className?: string;
}

interface FilterDropdownProps<T extends string> {
  label: string;
  options: FilterOption<T>[];
  selectedValues: T[];
  onToggle: (value: T) => void;
  align?: "start" | "end" | "center";
}

export function FilterDropdown<T extends string>({
  label,
  options,
  selectedValues,
  onToggle,
  align = "end",
}: FilterDropdownProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {label}
          {selectedValues.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {selectedValues.length}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="bg-popover">
        <DropdownMenuLabel>Filter by {label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={() => onToggle(option.value)}
          >
            <div className="flex items-center gap-2">
              {option.color && (
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: option.color }} />
              )}
              {option.className && <div className={cn("w-2 h-2 rounded-full", option.className)} />}
              {option.icon}
              {option.label}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
