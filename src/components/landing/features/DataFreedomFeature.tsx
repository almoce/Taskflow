import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Cloud,
  Database,
  FileJson,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DataFreedomFeature = () => {
  return (
    <div className="relative h-full w-full  border border-white/5 overflow-hidden flex flex-col items-center justify-center p-8 pointer-events-none select-none">
      <div className="w-full max-w-[320px] shadow-2xl relative z-20 hover:scale-[1.02] transition-transform duration-500">
        <Card className="bg-zinc-950/40 backdrop-blur-md border border-white/10 overflow-hidden relative group shadow-xl">
          <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 text-zinc-400">
                <Database className="w-3 h-3 text-sky-500" />
                Data Freedom
              </CardTitle>
            </div>
            <div className="flex gap-1">
              <ArrowDownLeft className="w-3 h-3 text-emerald-500/50" />
              <ArrowUpRight className="w-3 h-3 text-sky-500/50" />
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[160px] flex items-center justify-center relative overflow-hidden">
            {/* Central Hub */}
            <div className="relative z-20 w-14 h-14 bg-zinc-900 rounded-full border border-sky-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.2)]">
              <Database className="w-6 h-6 text-sky-400" />
              <div className="absolute inset-0 bg-sky-500/10 rounded-full animate-pulse" />
            </div>

            {/* Import Line (Left -> Center) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[50%] h-[1px] bg-white/5 overflow-hidden pr-7">
              {/* The Green Line */}
              <motion.div
                className="w-full h-full bg-linear-to-r from-transparent via-emerald-500 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  ease: "linear",
                  repeat: Infinity,
                  repeatDelay: 1.5, // Wait for blue to finish
                }}
              />
            </div>

            {/* Export Line (Center -> Right) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[1px] bg-white/5 overflow-hidden pl-7">
              {/* The Blue Line */}
              <motion.div
                className="w-full h-full bg-linear-to-r from-transparent via-sky-500 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  ease: "linear",
                  delay: 1.5, // Start after green finishes
                  repeat: Infinity,
                  repeatDelay: 1.5, // Wait for green to finish again
                }}
              />
            </div>

            {/* Icons for context (Static/Fading per cycle) */}
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-zinc-800/80 border border-white/10"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            </motion.div>

            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-zinc-800/80 border border-white/10"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              <FileJson className="w-4 h-4 text-sky-400" />
            </motion.div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center relative z-10 w-full mt-8">
        <h3 className="text-2xl font-bold text-white mb-2">Import & Export</h3>
        <p className="text-zinc-400 leading-relaxed">Your data. Freely moving.</p>
      </div>
    </div>
  );
};
