import { ArrowUpRight, BarChart3, Calendar, Layout, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  gradient,
  delay,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group relative p-1 rounded-3xl bg-transparent transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]",
        delay,
      )}
    >
      {/* Subtle border gradient */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 opacity-100" />

      {/* Hover glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl",
          gradient,
        )}
      />

      <div className="relative h-full bg-black/40 backdrop-blur-md rounded-[22px] overflow-hidden p-8 border border-white/5 group-hover:border-white/10 transition-colors flex flex-col">
        {/* Top Glow Ambient */}
        <div
          className={cn(
            "absolute -top-20 -right-20 w-64 h-64 blur-[80px] rounded-full opacity-10 transition-opacity duration-700 group-hover:opacity-30",
            gradient,
          )}
        />

        <div className="relative z-10 mb-8">
          <div
            className={cn(
              "inline-flex p-3 rounded-2xl border border-white/10 bg-white/5 mb-6 group-hover:scale-110 transition-transform duration-500",
              gradient,
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{title}</h3>
          <p className="text-zinc-400 leading-relaxed tracking-tight">{description}</p>
        </div>

        <div className="mt-auto relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/20 border border-white/5 group-hover:border-white/10 transition-colors">
          {/* Parallax Container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 transform transition-transform duration-700 group-hover:scale-[1.02]">
            {children}
          </div>
          {/* Glass Overlay on bottom for fade */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export const FeaturesGrid = () => {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Nebula Backgrounds */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse [animation-duration:8s]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full mix-blend-screen animate-pulse [animation-duration:10s]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Core Experiences
          </h2>
          <p className="text-xl text-zinc-400 tracking-tight">
            Three powerful views designed to adapt to your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 perspective-[2000px]">
          {/* Feature 1 - Kanban */}
          <FeatureCard
            icon={Layout}
            title="Flexible Board"
            description="Drag and drop tasks through custom workflows. Visualize progress with a tactile board experience."
            gradient="bg-purple-500/20 text-purple-400"
            delay="animate-fade-in-up [animation-delay:200ms]"
          >
            {/* Detailed Kanban UI */}
            <div className="w-full h-full flex gap-3 text-[10px]">
              {/* Column 1 */}
              <div className="flex-1 rounded-lg bg-white/[0.03] border border-white/[0.05] p-2 flex flex-col gap-2 relative group/col">
                <div className="flex items-center justify-between mb-1 opacity-60">
                  <span className="font-semibold text-zinc-300">To Do</span>
                  <span className="bg-white/10 px-1.5 rounded text-xs">3</span>
                </div>
                {/* Card 1 */}
                <div className="bg-[#1C1C1E] p-2 rounded border border-white/5 shadow-sm space-y-2 opacity-80 group-hover:translate-y-[-2px] transition-transform duration-500">
                  <div className="flex gap-1">
                    <div className="h-1 w-8 rounded-full bg-purple-500" />
                    <div className="h-1 w-6 rounded-full bg-blue-500" />
                  </div>
                  <div className="h-2 w-3/4 bg-zinc-700 rounded-sm" />
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex -space-x-1">
                      <div className="w-3 h-3 rounded-full bg-zinc-600 border border-[#1C1C1E]" />
                      <div className="w-3 h-3 rounded-full bg-zinc-500 border border-[#1C1C1E]" />
                    </div>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="bg-[#1C1C1E] p-2 rounded border border-white/5 shadow-sm space-y-2 opacity-80">
                  <div className="h-1 w-6 rounded-full bg-orange-500" />
                  <div className="h-2 w-1/2 bg-zinc-700 rounded-sm" />
                </div>
                {/* Ghost Card */}
                <div className="border border-dashed border-white/10 rounded p-2 flex items-center justify-center text-zinc-600">
                  <Plus className="w-3 h-3" />
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex-1 rounded-lg bg-white/3 border border-white/5 p-2 flex flex-col gap-2 opacity-60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-zinc-300">In Progress</span>
                  <span className="bg-white/10 px-1.5 rounded text-xs">1</span>
                </div>
                <div className="bg-[#1C1C1E] p-2 rounded border border-white/5 shadow-sm space-y-2">
                  <div className="h-1 w-10 rounded-full bg-emerald-500" />
                  <div className="h-2 w-2/3 bg-zinc-700 rounded-sm" />
                  <div className="w-full h-12 bg-zinc-800/30 rounded mt-1" />
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Feature 2 - Analytics */}
          <FeatureCard
            icon={BarChart3}
            title="Real-time Insights"
            description="Track velocity, burn-down, and team performance with beautiful, interactive charts."
            gradient="bg-blue-500/20 text-blue-400"
            delay="animate-fade-in-up [animation-delay:400ms]"
          >
            {/* Detailed Chart UI */}
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex gap-2 text-[10px] text-zinc-500">
                  <span className="text-zinc-300">Velocity</span>
                  <span>Burnup</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3" /> 12%
                </div>
              </div>
              <div className="flex-1 flex items-end justify-between gap-2 px-1 pb-1 border-b border-white/5 relative">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-t border-dashed border-zinc-700 w-full" />
                  <div className="border-t border-dashed border-zinc-700 w-full" />
                  <div className="border-t border-dashed border-zinc-700 w-full" />
                </div>
                {/* Bars */}
                {[40, 70, 45, 90, 60, 80].map((h, i) => {
                  return (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: static visual data
                      key={i}
                      className="relative w-full h-full flex items-end group/bar"
                    >
                      <div
                        className={cn(
                          "w-full rounded-t-sm transition-all duration-500",
                          i === 3
                            ? "bg-gradient-to-t from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                            : "bg-zinc-800 hover:bg-zinc-700",
                        )}
                        style={{ height: `${h}%` }}
                      />
                      {/* Tooltip Simulation */}
                      {i === 3 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 px-2 py-1 rounded text-[10px] text-white shadow-xl">
                          92pts
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[9px] text-zinc-600 mt-2 px-1 font-mono">
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span className="text-white">THU</span>
                <span>FRI</span>
                <span>SAT</span>
              </div>
            </div>
          </FeatureCard>

          {/* Feature 3 - Calendar */}
          <FeatureCard
            icon={Calendar}
            title="Timeline View"
            description="Plan your roadmap effectively. Switch between monthly, weekly, and daily views instantly."
            gradient="bg-pink-500/20 text-pink-400"
            delay="animate-fade-in-up [animation-delay:600ms]"
          >
            {/* Detailed Calendar UI */}
            <div className="w-full h-full flex flex-col text-[10px]">
              <div className="flex justify-between items-center mb-3 px-1">
                <span className="font-semibold text-white text-xs">November 2024</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded hover:bg-white/10 flex items-center justify-center text-zinc-400">
                    {"<"}
                  </div>
                  <div className="w-4 h-4 rounded hover:bg-white/10 flex items-center justify-center text-white">
                    {">"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-zinc-600 mb-1">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1 flex-1">
                {Array.from({ length: 28 }).map((_, i) => {
                  return (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: static calendar grid
                      key={i}
                      className={cn(
                        "rounded-sm border border-transparent hover:border-white/5 transition-colors relative group/day p-0.5",
                        i === 15 ? "bg-white/5" : "",
                      )}
                    >
                      <span
                        className={cn(
                          "block text-right mb-1",
                          i === 15 ? "text-white font-bold" : "text-zinc-600",
                        )}
                      >
                        {i + 1}
                      </span>
                      {/* Small dot events */}
                      {(i === 4 || i === 12 || i === 22) && (
                        <div className="w-1 h-1 rounded-full bg-zinc-600 mx-auto" />
                      )}
                      {/* Span Event */}
                      {i === 15 && (
                        <div className="w-[180%] h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_5px_rgba(236,72,153,0.3)] absolute left-0 top-6 z-10" />
                      )}
                      {i === 8 && (
                        <div className="w-full h-1.5 rounded-full bg-purple-500/50 absolute left-0 top-6" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};
