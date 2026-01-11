// import { Bug, TrendingUp, Zap } from "lucide-react";

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 flex items-start justify-center p-20 select-none pointer-events-none">
      <div
        className="relative w-full max-w-6xl aspect-video rounded-xl border border-white/10 bg-white/5 p-2 shadow-2xl opacity-80 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      >
        <div className="bg-[#0D0D0F] rounded-lg border border-white/5 overflow-hidden w-full h-full flex items-center justify-center relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          {/* Simulated Interface Elements */}
          <div className="w-full h-full bg-[#111113] rounded-lg border border-white/10 shadow-2xl flex flex-col relative overflow-hidden">
            {/* Header / Search Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/20 backdrop-blur-sm">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40 border border-rose-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40 border border-amber-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-500/20"></div>
                </div>
                <div className="h-4 w-px bg-white/10 mx-2"></div>
                <div className="flex-1 max-w-md h-9 bg-black/40 border border-white/5 rounded-lg flex items-center px-4 gap-3">
                  <div className="w-3 h-3 rounded-full border-2 border-white/20"></div>
                  <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                  <div className="ml-auto flex items-center gap-1">
                    <div className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] text-white/40 font-mono">
                      ⌘
                    </div>
                    <div className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] text-white/40 font-mono">
                      K
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 bg-purple-500/20 border border-purple-500/40 rounded-full"></div>
                <div className="h-8 w-20 bg-purple-600/20 border border-purple-600/40 rounded-lg"></div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 border-r border-white/5 p-4 space-y-6 hidden md:block">
                <div className="space-y-2">
                  <div className="h-2 w-16 bg-white/10 rounded-full mb-4"></div>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-8 rounded-lg flex items-center px-3 gap-3 ${i === 1 ? "bg-purple-500/10 border border-purple-500/20" : ""}`}
                    >
                      <div
                        className={`w-3 h-3 rounded bg-${i === 1 ? "purple-400" : "white/20"}`}
                      ></div>
                      <div
                        className={`h-1.5 w-16 bg-${i === 1 ? "purple-400/50" : "white/10"} rounded-full`}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="h-2 w-12 bg-white/10 rounded-full mb-4"></div>
                  {[1, 2].map((i) => (
                    <div key={i} className="h-8 rounded-lg flex items-center px-3 gap-3">
                      <div className="w-3 h-3 rounded-full bg-white/10"></div>
                      <div className="h-1.5 w-20 bg-white/10 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content (Kanban) */}
              <div className="flex-1 p-6 overflow-hidden">
                <div className="grid grid-cols-3 gap-6 h-full">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <div className="h-2 w-2 rounded-full bg-zinc-500"></div>
                      <div className="h-2 w-16 bg-zinc-500/30 rounded-full"></div>
                    </div>
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-white/5 bg-[#1C1C1E]/50 shadow-sm animate-float"
                        style={{ animationDelay: `${i * 0.5}s` }}
                      >
                        <div className="h-2 w-3/4 bg-white/20 rounded-full mb-4"></div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <div className="h-4 w-10 rounded bg-rose-500/10 border border-rose-500/20"></div>
                            <div className="h-4 w-4 rounded bg-white/5 border border-white/10"></div>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/5"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <div className="h-2 w-20 bg-blue-500/30 rounded-full"></div>
                    </div>
                    <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 shadow-[0_0_20px_rgba(147,51,234,0.1)] ring-1 ring-purple-500/20 animate-float [animation-delay:2s]">
                      <div className="h-2 w-2/3 bg-white/30 rounded-full mb-4"></div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <div className="h-4 w-12 rounded bg-purple-500/20 border border-purple-500/40"></div>
                        </div>
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-white/10"></div>
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-white/10"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <div className="h-2 w-14 bg-emerald-500/30 rounded-full"></div>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-[#1C1C1E]/30 opacity-40 grayscale-[0.5] animate-float [animation-delay:1s]">
                      <div className="h-2 w-3/4 bg-white/10 rounded-full mb-4 line-through"></div>
                      <div className="w-6 h-6 rounded-full bg-zinc-800 ml-auto mr-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Fade-out Gradient */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
