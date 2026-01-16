import {
  BarChart3,
  Calendar,
  Download,
  FolderKanban,
  Layout,
  type LucideIcon,
  Search,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  id: string;
  className?: string;
  delay?: string;
}

const FeatureItem = ({ title, description, icon: Icon, className, delay }: FeatureItemProps) => (
  <div
    className={cn(
      "group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 overflow-hidden hover:bg-zinc-900/80 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-purple-500/10",
      className,
      delay,
    )}
  >
    {/* Hover Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative z-10 h-full flex flex-col">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3 group-hover:bg-purple-500/10 group-hover:border-purple-500/20">
        <Icon className="w-7 h-7 text-zinc-400 group-hover:text-purple-400 transition-colors duration-500" />
      </div>

      <h3 className="text-2xl font-bold mb-3 text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all duration-300 transform origin-left">
        {title}
      </h3>

      <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
        {description}
      </p>
    </div>
  </div>
);

export const FeatureShowcase = () => {
  const features = [
    {
      id: "search",
      title: "Instant Search",
      description:
        "Find any task, project, or note instantly. Navigate through your workspace with lightning-fast search.",
      icon: Search,
      className: "md:col-span-2",
      delay: "animate-fade-in-up [animation-delay:200ms]",
    },
    {
      id: "kanban",
      title: "Kanban Redefined",
      description: "Fluid animations and real-time updates make task management feel effortless.",
      icon: Layout,
      className: "",
      delay: "animate-fade-in-up [animation-delay:300ms]",
    },
    {
      id: "analytics",
      title: "Smart Insights",
      description:
        "Visualize productivity with interactive charts. Track velocity and completion rates.",
      icon: BarChart3,
      className: "",
      delay: "animate-fade-in-up [animation-delay:400ms]",
    },
    {
      id: "calendar",
      title: "Visual Roadmap",
      description: "Plan your weeks and months. Sync deadlines and see the big picture.",
      icon: Calendar,
      className: "md:col-span-2",
      delay: "animate-fade-in-up [animation-delay:500ms]",
    },
    {
      id: "projects",
      title: "Project Hub",
      description: "Organize tasks into projects with custom icons and colors.",
      icon: FolderKanban,
      className: "",
      delay: "animate-fade-in-up [animation-delay:600ms]",
    },
    {
      id: "portability",
      title: "Data Freedom",
      description: "Export your entire workspace to JSON or import existing projects in seconds.",
      icon: Download,
      className: "",
      delay: "animate-fade-in-up [animation-delay:700ms]",
    },
    {
      id: "speed",
      title: "Built for Speed",
      description: "Zero latency interactions. Every click and transition is instantaneous.",
      icon: Zap,
      className: "md:col-span-1",
      delay: "animate-fade-in-up [animation-delay:800ms]",
    },
  ];

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
            Everything you need <br />
            to build fast
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
            Taskflow combines the power of enterprise tools with the simplicity of a startup.
            <br className="hidden md:block" /> Built for speed, designed for clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto perspective-[2000px]">
          {features.map((feature) => (
            <FeatureItem key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
