import { motion } from "framer-motion";
import { Bug, Zap, RotateCcw } from "lucide-react";

export const KanbanFeature = () => {
  return (
    <div className="relative h-full w-full border border-white/5 overflow-hidden flex flex-col items-center justify-center p-8 pointer-events-none select-none">
      <div className="flex gap-4 w-full max-w-[420px] -translate-y-12">
        {/* Column 1: To Do */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 px-1">
             <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Todo</span>
             <span className="text-xs text-zinc-600">3</span>
          </div>
          
          <div className="flex flex-col gap-2 h-[220px] p-2 rounded-lg bg-zinc-800/30 border border-white/5">
             {/* Static Card 1 */}
             <div className="p-3 rounded-md border border-white/10 bg-zinc-900 shadow-sm opacity-50">
                <div className="flex items-start justify-between gap-2 mb-2">
                   <p className="text-xs font-medium text-zinc-400">Database Schema</p>
                </div>
                <div className="flex items-center gap-1.5">
                   <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-500/10 text-orange-400">
                      medium
                   </span>
                </div>
             </div>
             
             {/* Animated Card - Moving from Todo to Done */}
             <motion.div
                initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
                whileInView={{ 
                    x: 140, // Move horizontally to next column
                    y: -20, // Adjust vertical position to top of next column
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, 0]
                }}
                transition={{ 
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1.5
                }}
                className="p-3 rounded-md border border-white/10 bg-zinc-900 shadow-xl relative z-20"
             >
                <div className="flex items-start justify-between gap-2 mb-2">
                   <p className="text-sm font-medium text-zinc-200">Auth Integration</p>
                </div>
                <div className="flex items-center gap-1.5">
                   <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-400">
                      high
                   </span>
                   <span className="w-[18px] h-[18px] rounded-full text-[10px] font-medium flex items-center justify-center border border-indigo-500/20 bg-indigo-500/15 text-indigo-500">
                      <Zap className="h-2.5 w-2.5" />
                   </span>
                </div>
             </motion.div>
          </div>
        </div>

        {/* Column 2: Done */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 px-1">
             <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Done</span>
             <span className="text-xs text-zinc-600">12</span>
          </div>
          <div className="flex flex-col gap-2 h-[220px] p-2 rounded-lg bg-zinc-800/30 border border-white/5 opacity-80">
             {/* Static Card 2 */}
             <div className="p-3 rounded-md border border-white/10 bg-zinc-900 shadow-sm opacity-50">
                <div className="flex items-start justify-between gap-2 mb-2">
                   <p className="text-xs font-medium text-zinc-500 line-through">API Setup</p>
                   <RotateCcw className="h-3 w-3 text-zinc-600" />
                </div>
                <div className="flex items-center gap-1.5">
                   <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400">
                      low
                   </span>
                    <span className="w-[18px] h-[18px] rounded-full text-[10px] font-medium flex items-center justify-center border border-rose-500/20 bg-rose-500/15 text-rose-500">
                      <Bug className="h-2.5 w-2.5" />
                   </span>
                </div>
             </div>
             
             {/* Ghost Card for Drop Target */}
             <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                className="h-20 border-2 border-dashed border-zinc-700/50 rounded-md"
             />
          </div>
        </div>
      </div>
      
       <div className="absolute bottom-8 left-0 text-center z-10 w-full px-6">
         <h3 className="text-2xl font-bold text-white mb-2">Kanban Redefined</h3>
         <p className="text-zinc-400 leading-relaxed">Fluid animations make work feel effortless.</p>
      </div>
    </div>
  );
};
