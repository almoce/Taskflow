import { motion } from "framer-motion";
import { Gauge, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const SpeedFeature = () => {
  return (
    <div className="relative h-full w-full bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden flex flex-col items-center justify-center p-8 pointer-events-none select-none">
       <div className="w-full max-w-[320px] shadow-2xl relative z-20 hover:scale-[1.02] transition-transform duration-500">
             <Card className="bg-zinc-950/40 backdrop-blur-md border border-white/10 overflow-hidden relative group shadow-xl">
               <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between border-b border-white/5">
                 <div className="flex items-center gap-2">
                   <CardTitle className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 text-zinc-400">
                     <Gauge className="w-3 h-3 text-cyan-400" />
                     Performance
                   </CardTitle>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    <span className="text-[9px] text-zinc-500 font-medium">Optimized</span>
                 </div>
               </CardHeader>
               <CardContent className="p-6 flex flex-col items-center justify-center min-h-[120px]">
                   <div className="relative mb-2">
                       <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                       <Zap className="w-10 h-10 text-zinc-100 relative z-10 fill-cyan-500/10 stroke-[1.5]" />
                   </div>
                   <div className="text-center">
                       <div className="text-3xl font-bold text-white tracking-tight flex items-baseline justify-center gap-1.5">
                           <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                           >
                            &lt;
                           </motion.span>
                           <motion.span
                                key="number"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                           >
                               16
                           </motion.span>
                           <span className="text-sm font-medium text-zinc-500">ms</span>
                       </div>
                       <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-wider font-medium">Render Time</p>
                   </div>
                   
                   {/* FPS Bar */}
                   <div className="w-full max-w-[120px] h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                        <motion.div 
                            className="h-full bg-cyan-500"
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        />
                   </div>
                   <p className="text-[8px] text-zinc-600 mt-1.5 font-mono">60 FPS locked</p>
               </CardContent>
             </Card>
        </div>

       <div className="text-center relative z-10 w-full mt-8">
         <h3 className="text-2xl font-bold text-white mb-2">Built for Speed</h3>
         <p className="text-zinc-400 leading-relaxed">Instant interactions. Zero lag.</p>
      </div>
    </div>
  );
};
