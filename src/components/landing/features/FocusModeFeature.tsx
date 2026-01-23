import { motion } from "framer-motion";
import { Moon, Bell, BellOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const FocusModeFeature = () => {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center p-8 pointer-events-none select-none border border-white/5">
       <div className="w-full max-w-[320px] shadow-2xl relative z-20 hover:scale-[1.02] transition-transform duration-500">
             <Card className="bg-zinc-950/40 backdrop-blur-md border border-white/10 overflow-hidden relative group shadow-xl">
               <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between border-b border-white/5">
                 <div className="flex items-center gap-2">
                   <CardTitle className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 text-zinc-400">
                     <Moon className="w-3 h-3 text-indigo-400" />
                     Zen Mode
                   </CardTitle>
                 </div>
                 <div className="w-8 h-4 bg-indigo-500/20 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-indigo-500 rounded-full shadow-sm" />
                 </div>
               </CardHeader>
               <CardContent className="p-6 flex flex-col items-center justify-center min-h-[120px]">
                   <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                       {/* Ripples */}
                       <motion.div
                          animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                          className="absolute inset-0 bg-indigo-500/10 rounded-full"
                       />
                        <motion.div
                          animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
                          className="absolute inset-0 bg-indigo-500/10 rounded-full"
                       />
                       
                       <div className="relative z-10 bg-zinc-900 p-3 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                            <BellOff className="w-6 h-6 text-indigo-400" />
                       </div>
                       
                       {/* Floating "silenced" notifications */}
                       <motion.div 
                            initial={{ x: 40, y: -20, opacity: 0, scale: 0.5 }}
                            whileInView={{ x: 25, y: -15, opacity: 0.5, scale: 0.8 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="absolute top-0 right-0"
                       >
                            <Bell className="w-4 h-4 text-zinc-600 rotate-12" />
                       </motion.div>
                   </div>
                   
                   <p className="text-xl font-medium text-white tracking-tight">Focus Active</p>
                   <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-wider font-medium">Notifications Silenced</p>
               </CardContent>
             </Card>
        </div>

       <div className="text-center relative z-10 w-full mt-8">
         <h3 className="text-2xl font-bold text-white mb-2">Focus Mode</h3>
         <p className="text-zinc-400 leading-relaxed">Crush distractions. Deep work flows.</p>
      </div>
    </div>
  );
};
