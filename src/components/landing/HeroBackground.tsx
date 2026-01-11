import { Bug, TrendingUp, Zap } from "lucide-react";

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 flex items-start justify-center p-20 select-none pointer-events-none">
      <div 
        className="relative w-full max-w-6xl aspect-video rounded-xl border border-white/10 bg-white/5 p-2 shadow-2xl opacity-80 overflow-hidden"
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' 
        }}
      >
        <div className="bg-[#0D0D0F] rounded-lg border border-white/5 overflow-hidden w-full h-full flex items-center justify-center relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          {/* Simulated Interface Elements */}
          <div className="w-full h-full bg-[#111113] rounded-lg border border-white/10 shadow-2xl p-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="h-3 w-px bg-white/10 mx-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  </div>
                  <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-white/5 border border-white/10 rounded-md"></div>
                <div className="h-6 w-20 bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 rounded-md"></div>
              </div>
            </div>

            {/* Kanban Content */}
            <div className="grid grid-cols-3 gap-4 h-full">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse-subtle"></div>
                  <div className="h-2 w-12 bg-zinc-500/40 rounded-full"></div>
                  <div className="ml-auto h-3 w-3 bg-zinc-800 rounded"></div>
                </div>
                <div className="space-y-3">
                  {/* Task Card 1 */}
                  <div className="p-3 rounded-lg border border-white/5 bg-[#1C1C1E] shadow-sm animate-float">
                    <div className="h-2 w-3/4 bg-white/20 rounded-full mb-3"></div>
                    <div className="flex items-center gap-2">
                      <div className="px-1.5 py-0.5 rounded bg-rose-500/10 text-[8px] font-bold text-rose-500/80 uppercase tracking-wider">
                        High
                      </div>
                      <div className="w-4 h-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Zap className="w-2.5 h-2.5 text-indigo-400" />
                      </div>
                    </div>
                  </div>
                  {/* Task Card 2 */}
                  <div className="p-3 rounded-lg border border-white/5 bg-[#1C1C1E] shadow-sm animate-float [animation-delay:2s]">
                    <div className="h-2 w-1/2 bg-white/20 rounded-full mb-3"></div>
                    <div className="flex items-center gap-2">
                      <div className="px-1.5 py-0.5 rounded bg-amber-500/10 text-[8px] font-bold text-amber-500/80 uppercase tracking-wider">
                        Med
                      </div>
                      <div className="w-4 h-4 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                        <Bug className="w-2.5 h-2.5 text-rose-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse-subtle"></div>
                  <div className="h-2 w-16 bg-blue-500/40 rounded-full"></div>
                  <div className="ml-auto h-3 w-3 bg-zinc-800 rounded"></div>
                </div>
                <div className="space-y-3">
                  {/* Task Card 3 */}
                  <div className="p-3 rounded-lg border border-[#5E6AD2]/30 bg-[#1C1C1E] shadow-lg ring-1 ring-[#5E6AD2]/20 animate-float [animation-delay:4s]">
                    <div className="h-2 w-2/3 bg-white/30 rounded-full mb-3"></div>
                    <div className="flex items-center gap-2">
                      <div className="px-1.5 py-0.5 rounded bg-rose-500/10 text-[8px] font-bold text-rose-500/80 uppercase tracking-wider">
                        High
                      </div>
                      <div className="w-4 h-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <TrendingUp className="w-2.5 h-2.5 text-cyan-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-subtle"></div>
                  <div className="h-2 w-10 bg-emerald-500/40 rounded-full"></div>
                  <div className="ml-auto h-3 w-3 bg-zinc-800 rounded"></div>
                </div>
                <div className="space-y-3 opacity-40 grayscale-[0.5]">
                  <div className="p-3 rounded-lg border border-white/5 bg-[#1C1C1E] shadow-sm animate-float [animation-delay:1s]">
                    <div className="h-2 w-3/4 bg-white/20 rounded-full mb-2 line-through"></div>
                    <div className="h-2 w-2/4 bg-white/10 rounded-full line-through"></div>
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
