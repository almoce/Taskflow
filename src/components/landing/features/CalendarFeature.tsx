import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CalendarFeature = () => {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center p-8 pointer-events-none select-none border border-white/5">
       <div className="w-full max-w-[320px] shadow-2xl relative z-20 hover:scale-[1.02] transition-transform duration-500">
             <Card className="bg-zinc-950/40 backdrop-blur-md border border-white/10 overflow-hidden relative group shadow-xl">
               <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between border-b border-white/5">
                 <div className="flex items-center gap-2">
                   <CardTitle className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 text-zinc-400">
                     <CalendarIcon className="w-3 h-3 text-purple-500" />
                     Schedule
                   </CardTitle>
                 </div>
                 <span className="text-[9px] text-zinc-500 font-medium">Oct 2024</span>
               </CardHeader>
               <CardContent className="p-4 relative">
                   <div className="grid grid-cols-7 gap-1 text-center mb-2">
                       {['S','M','T','W','T','F','S'].map(d => (
                           <div key={d} className="text-[8px] text-zinc-600 font-medium">{d}</div>
                       ))}
                   </div>
                   <div className="grid grid-cols-7 gap-1 text-center">
                       {Array.from({length: 31}, (_, i) => i + 1).map((day) => (
                           <div key={day} className={`text-[10px] py-1 rounded-sm relative ${day === 24 ? 'bg-purple-500 text-white font-bold' : 'text-zinc-400'}`}>
                                {day}
                                {[12, 18, 24].includes(day) && (
                                     <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 + (day * 0.05) }}
                                        className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full ${day === 24 ? 'bg-white' : 'bg-purple-500'}`} 
                                     />
                                )}
                           </div>
                       ))}
                   </div>
                   
                   {/* Populating Event Card */}
                   <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        className="absolute bottom-4 right-4 left-4 bg-zinc-900/90 border border-white/10 p-2 rounded-md shadow-lg backdrop-blur-sm"
                   >
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-8 rounded-full bg-purple-500" />
                            <div>
                                <p className="text-[10px] text-zinc-200 font-medium">Product Launch</p>
                                <p className="text-[9px] text-zinc-500">10:00 AM - 11:30 AM</p>
                            </div>
                        </div>
                   </motion.div>
               </CardContent>
             </Card>
        </div>

       <div className="text-center relative z-10 w-full mt-8">
         <h3 className="text-2xl font-bold text-white mb-2">Smart Calendar</h3>
         <p className="text-zinc-400 leading-relaxed">Sync deadlines. Never miss a beat.</p>
      </div>
    </div>
  );
};
