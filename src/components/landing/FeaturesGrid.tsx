import { BarChart3, Calendar, Layout } from "lucide-react";

export const FeaturesGrid = () => {
  return (
    <section className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for modern product teams
          </h2>
          <p className="text-zinc-400 max-w-5xl mx-auto">
            Experience a workflow that adapts to your needs. From idea to
            production, Taskflow has you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Feature 1 - Kanban */}
          <div className="group relative p-8 rounded-xl bg-zinc-900/50 border border-white/10 overflow-hidden hover:bg-zinc-900/80 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <Layout className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Board</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Visualize your work with our powerful Kanban board. Drag,
                drop, and organize tasks with fluid animations.
              </p>
            </div>
          </div>

          {/* Feature 2 - Analytics */}
          <div className="group relative p-8 rounded-xl bg-zinc-900/50 border border-white/10 overflow-hidden hover:bg-zinc-900/80 transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Real-time Insights
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Track velocity and progress with beautiful, generated charts.
                Make data-driven decisions instantly.
              </p>
            </div>
          </div>

          {/* Feature 3 - Calendar */}
          <div className="group relative p-8 rounded-xl bg-zinc-900/50 border border-white/10 overflow-hidden hover:bg-zinc-900/80 transition-all duration-300 hover:scale-[1.02] hover:border-pink-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Timeline View</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Never miss a deadline. View your roadmap on a calendar
                interface designed for long-term planning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};