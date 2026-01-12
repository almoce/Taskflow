import { Button } from "@/components/ui/button";
import { 
  ArrowDownAZ, 
  ArrowUpWideNarrow, 
  Calendar, 
  Clock, 
  Tag,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useStore } from "@/store/useStore";
import type { SortCriteria, SortDirection } from "@/store/types";
import { cn } from "@/lib/utils";

interface ColumnSortControlsProps {
  columnId: string;
}

const CRITERIA: { id: SortCriteria; icon: any; label: string }[] = [
  { id: "priority", icon: ArrowUpWideNarrow, label: "Priority" },
  { id: "date", icon: Calendar, label: "Created" },
  { id: "dueDate", icon: Clock, label: "Due" },
  { id: "tag", icon: Tag, label: "Tag" },
];

export function ColumnSortControls({ columnId }: ColumnSortControlsProps) {
  const columnSort = useStore((state) => state.columnSorts[columnId]);
  const setColumnSort = useStore((state) => state.setColumnSort);

  const handleSortClick = (criteria: SortCriteria) => {
    if (columnSort?.criteria === criteria) {
      if (columnSort.direction === "asc") {
        setColumnSort(columnId, { criteria, direction: "desc" });
      } else {
        // Clear sort on third click
        setColumnSort(columnId, null);
      }
    } else {
      setColumnSort(columnId, { criteria, direction: "asc" });
    }
  };

  return (
    <div className="flex items-center gap-0.5 ml-auto">
      {CRITERIA.map(({ id, icon: Icon, label }) => {
        const isActive = columnSort?.criteria === id;
        return (
          <Button
            key={id}
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 relative group transition-colors",
              isActive ? "text-primary bg-primary/10" : "text-muted-foreground/50 hover:text-foreground"
            )}
            onClick={() => handleSortClick(id)}
            title={`Sort by ${label}${isActive ? (columnSort.direction === "asc" ? " (Asc)" : " (Desc)") : ""}`}
          >
            <Icon className="h-3 w-3" />
            {isActive && (
              <div className="absolute -top-1 -right-1 bg-background rounded-full border border-border shadow-sm p-0.5">
                {columnSort.direction === "asc" ? (
                  <ChevronUp className="h-2 w-2" />
                ) : (
                  <ChevronDown className="h-2 w-2" />
                )}
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );
}
