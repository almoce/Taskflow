import { motion } from "framer-motion";
import { Circle, CircleCheck, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

export const InstantSearchFeature = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const fullText = "fix navigation bug...";

  useEffect(() => {
    let currentIndex = 0;
    let timeout: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setSearchQuery(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        timeout = setTimeout(typeNextChar, 100 + Math.random() * 50); // Random typing speed
      } else {
        // Pause at end then reset
        timeout = setTimeout(() => {
          setSearchQuery("");
          currentIndex = 0;
          timeout = setTimeout(typeNextChar, 1000);
        }, 2000);
      }
    };

    // Start simulation
    timeout = setTimeout(typeNextChar, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative h-full w-full border border-white/5 overflow-hidden flex flex-col items-center justify-center p-8 pointer-events-none select-none">
      <div className="w-full max-w-[320px] shadow-2xl relative z-20 -translate-y-12">
        <Command className="rounded-xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center border-b border-white/5 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-zinc-400" />
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-white"
              placeholder="Search tasks..."
              value={searchQuery}
              readOnly
            />
          </div>
          <div className="relative">
            <CommandList className="max-h-[300px] overflow-hidden py-2 absolute top-0 left-0 w-full bg-zinc-950/90 border-x border-b border-white/10 rounded-b-xl shadow-2xl z-50">
              <CommandGroup heading="Tasks" className="text-zinc-400">
                {searchQuery.length > 2 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <CommandItem className="text-zinc-200 data-[selected='true']:bg-white/10 data-[selected='true']:text-white cursor-default">
                      <Circle className="mr-2 h-4 w-4 text-orange-400" />
                      <span>Fix navigation bug</span>
                    </CommandItem>
                    <CommandItem className="text-zinc-200 data-[selected='true']:bg-white/10 data-[selected='true']:text-white cursor-default">
                      <CircleCheck className="mr-2 h-4 w-4 text-green-400" />
                      <span>Review PR #124</span>
                    </CommandItem>
                    <CommandItem className="text-zinc-200 data-[selected='true']:bg-white/10 data-[selected='true']:text-white cursor-default">
                      <Circle className="mr-2 h-4 w-4 text-blue-400" />
                      <span>Update documentation</span>
                    </CommandItem>
                  </motion.div>
                )}
              </CommandGroup>
            </CommandList>
          </div>
        </Command>
      </div>

      <div className="absolute bottom-8 left-0 text-center z-10 w-full px-6">
        <h3 className="text-2xl font-bold text-white mb-2">Instant Search</h3>
        <p className="text-zinc-400 leading-relaxed">Find any task in milliseconds.</p>
      </div>
    </div>
  );
};
