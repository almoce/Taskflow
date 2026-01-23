import { CalendarFeature } from "./features/CalendarFeature";
import { DataFreedomFeature } from "./features/DataFreedomFeature";
import { FocusModeFeature } from "./features/FocusModeFeature";
import { InsightsFeature } from "./features/InsightsFeature";
import { InstantSearchFeature } from "./features/InstantSearchFeature";
import { KanbanFeature } from "./features/KanbanFeature";
import { ProjectHubFeature } from "./features/ProjectHubFeature";

export const FeatureShowcase = () => {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white via-white to-zinc-500">
            Everything you need <br />
            to build fast
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
            Taskflow combines the power of enterprise tools with the simplicity of a startup.
            <br className="hidden md:block" /> Built for speed, designed for clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto perspective-[2000px]">
          <div className="md:col-span-2 h-[400px] hover:scale-[1.02] transition-transform duration-500">
            <InstantSearchFeature />
          </div>
          <div className="md:col-span-1 h-[400px] hover:scale-[1.02] transition-transform duration-500">
            <KanbanFeature />
          </div>
          <div className="md:col-span-1 h-[400px] hover:scale-[1.02] transition-transform duration-500">
            <CalendarFeature />
          </div>
          <div className="md:col-span-2 h-[400px] hover:scale-[1.02] transition-transform duration-500">
            <InsightsFeature />
          </div>
          <div className="md:col-span-1 h-[400px] hover:scale-[1.02] transition-transform duration-500">
            <ProjectHubFeature />
          </div>
          <div className="md:col-span-1 h-[400px] hover:scale-[1.02] transition-transform duration-500">
            <DataFreedomFeature />
          </div>
          <div className="md:col-span-1 h-[400px] hover:scale-[1.02] transition-transform duration-500">
            <FocusModeFeature />
          </div>
        </div>
      </div>
    </section>
  );
};
