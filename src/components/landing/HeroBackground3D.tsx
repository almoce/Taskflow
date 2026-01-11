import { Bug, Calendar, FileText, MoreHorizontal, TrendingUp, Zap } from "lucide-react";

export const HeroBackground3D = () => {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1300px] h-[600px] bg-purple-900/20 blur-[180px] rounded-full mix-blend-screen" />

      <div
        className="relative w-full max-w-5xl aspect-16/9 perspective-[1200px]"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main Tilted Container */}
        <div
          className="relative w-full h-full"
          style={{
            transform: "rotateX(20deg) rotateY(-15deg) rotateZ(6deg) scale(0.9)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Layer 1: Base Grid / Background */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-3xl shadow-2xl"
            style={{ transform: "translateZ(-60px) scale(1.05)" }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-90" />
            {/* Inner reflection */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-30 pointer-events-none rounded-3xl" />
          </div>

          {/* Layer 2: Floating Cards (Middle Layer) */}
          <div
            className="absolute top-1/4 left-1/4 transform translate-z-10"
            style={{ transform: "translateZ(70px)" }}
          >
            {/* Task Card 1: High Priority Bug */}
            <div className="w-80 p-3 rounded-md border border-border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-2 ring-1 ring-white/5 bg-[#1C1C1E] border-white/10">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug text-zinc-200">
                  Fix keyboard navigation focus state
                </p>
                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </div>

              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-priority-high/15 text-priority-high bg-red-500/15 text-red-500">
                  high
                </span>

                <span className="w-[18px] h-[18px] rounded-full text-[10px] font-medium flex items-center justify-center border bg-rose-500/15 text-rose-500 border-rose-500/20">
                  <Bug className="h-2.5 w-2.5" />
                </span>

                <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
                  <Calendar className="h-2.5 w-2.5" />
                  Today
                </span>
              </div>
            </div>
          </div>

          {/* Layer 3: Floating Cards (Top Layer - Higher Z) */}
          <div
            className="absolute top-1/2 left-[40%] transform"
            style={{ transform: "translateZ(140px) translateX(20px)" }}
          >
            {/* Task Card 2: Medium Priority Feature (Main Focus) */}
            <div className="w-96 p-4 rounded-md border border-purple-500/50 bg-[#1C1C1E] shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col gap-3 ring-1 ring-white/10 relative overflow-hidden group">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-30" />

              <div className="flex items-start justify-between gap-2 relative z-10">
                <p className="text-base font-medium leading-snug text-white drop-shadow-md">
                  Integrate Stripe Payment Gateway
                </p>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>

              <div className="flex items-center gap-2 mt-1 flex-wrap relative z-10">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-500/15 text-orange-500">
                  medium
                </span>

                <span className="w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center border bg-indigo-500/15 text-indigo-500 border-indigo-500/20">
                  <Zap className="h-3.5 w-3.5" />
                </span>

                <div className="w-6 h-6 rounded-full bg-muted/30 border border-border/50 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground/60" />
                </div>

                <span className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                  <Calendar className="h-3.5 w-3.5" />
                  Nov 24
                </span>
              </div>

              {/* Subtasks Progress */}
              <div className="flex items-center gap-2 relative z-10 w-full mt-1">
                <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-3/4 rounded-full" />
                </div>
                <span className="text-[10px] text-zinc-500">3/4</span>
              </div>
            </div>
          </div>

          {/* Layer 4: Floating Cards (Background/Far Layer) */}
          <div
            className="absolute bottom-1/4 right-1/4 transform"
            style={{ transform: "translateZ(-20px) rotateY(5deg)" }}
          >
            {/* Task Card 3: Low Priority Improvement */}
            <div className="w-72 p-3 rounded-md border border-white/5 bg-[#1C1C1E]/80 backdrop-blur-sm shadow-xl opacity-60 grayscale-[0.2] flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug text-zinc-400">
                  Optimize database queries
                </p>
                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </div>

              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-500">
                  low
                </span>

                <span className="w-[18px] h-[18px] rounded-full text-[10px] font-medium flex items-center justify-center border bg-cyan-500/10 text-cyan-500 border-cyan-500/10">
                  <TrendingUp className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Connection Lines (Decorative) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: "translateZ(20px)" }}
            aria-hidden="true"
          >
            <path
              d="M 400 200 Q 500 300 600 250"
              stroke="url(#gradient-line)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 4"
              opacity="0.3"
              filter="url(#glow)"
            />
            <defs>
              <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0" />
                <stop offset="50%" stopColor="#A855F7" stopOpacity="1" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-40" />
      </div>
    </div>
  );
};
