import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const InsightsFeature = () => {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center p-8 pointer-events-none select-none border border-white/5">
        <div className="w-full max-w-[500px] shadow-2xl relative z-20 hover:scale-[1.02] transition-transform duration-500">
             <Card className="bg-zinc-950/40 backdrop-blur-md border border-white/10 overflow-hidden relative group shadow-xl">
               <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between border-b border-white/5">
                 <div className="flex items-center gap-2">
                   <CardTitle className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 text-zinc-400">
                     <TrendingUp className="w-3 h-3 text-emerald-500" />
                     Week Activity
                   </CardTitle>
                 </div>
                  <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] text-zinc-500 font-medium">Live</span>
                  </div>
               </CardHeader>
               <CardContent className="p-0 relative h-[160px] flex items-end">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                         <div className="w-full h-px bg-white/20" />
                         <div className="w-full h-px bg-white/20" />
                         <div className="w-full h-px bg-white/20" />
                         <div className="w-full h-px bg-white/20" />
                    </div>

                     {/* Gradient Area Chart */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                         <title>Analytics Chart</title>
                         <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.3" />
                                   <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
                              </linearGradient>
                         </defs>
                         <motion.path
                              initial={{ d: "M0,100 L0,100 L20,100 L40,100 L60,100 L80,100 L100,100 Z" }}
                              whileInView={{ 
                                   d: "M0,100 L0,60 L20,30 L40,50 L60,10 L80,40 L100,20 L100,100 Z"
                              }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              fill="url(#chartGradient)"
                         />
                         <motion.path
                              initial={{ d: "M0,100 L20,100 L40,100 L60,100 L80,100 L100,100" }}
                              whileInView={{
                                   d: "M0,60 L20,30 L40,50 L60,10 L80,40 L100,20"
                              }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              fill="none"
                              stroke="rgb(16, 185, 129)"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                         />
                         
                         {/* Interactive Points Animation - Removed per user request */}
                    </svg>

                    {/* Overlay Stats */}
                    <div className="absolute bottom-4 right-4 flex flex-col items-end">
                         <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1 }}
                              className="text-lg font-bold text-white tabular-nums"
                         >
                              +24.5%
                         </motion.div>
                         <motion.div 
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ delay: 1.2 }}
                              className="text-[9px] text-emerald-400 font-medium"
                         >
                              vs. last week
                         </motion.div>
                    </div>
               </CardContent>
             </Card>
        </div>

       <div className="text-center relative z-10 w-full mt-8">
         <h3 className="text-2xl font-bold text-white mb-2">Smart Insights</h3>
         <p className="text-zinc-400 leading-relaxed">Visualize productivity. Track velocity.</p>
      </div>
    </div>
  );
};
