import { m } from "framer-motion";
import { Folder, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProjectHubFeature = () => {
  const projects = [
    {
      name: "Website Redesign",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      members: 3,
    },
    {
      name: "Mobile App",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      members: 5,
    },
    {
      name: "Marketing Q4",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      members: 2,
    },
    {
      name: "Internal Tools",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      members: 4,
    },
  ];

  return (
    <div className="relative h-full w-full border border-white/5 overflow-hidden flex flex-col items-center justify-center p-8 pointer-events-none select-none">
      <div className="w-full max-w-[320px] shadow-2xl relative z-20 hover:scale-[1.02] transition-transform duration-500">
        <Card className="bg-zinc-950/40 backdrop-blur-md border border-white/10 overflow-hidden relative group shadow-xl">
          <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 text-zinc-400">
                <Folder className="w-3 h-3 text-white" />
                Projects
              </CardTitle>
            </div>
            <MoreHorizontal className="w-3 h-3 text-zinc-600" />
          </CardHeader>
          <CardContent className="p-3 h-[160px] grid grid-cols-2 gap-2">
            {projects.map((project, i) => (
              <m.div
                key={project.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`p-3 rounded-lg border ${project.border} ${project.bg} group/item hover:bg-zinc-900/80 transition-colors cursor-default flex flex-col justify-between h-16`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-2 h-2 rounded-full ${project.color} bg-current opacity-80`} />
                </div>
                <p className="text-[10px] font-medium text-zinc-200 leading-tight group-hover/item:text-white transition-colors">
                  {project.name}
                </p>
              </m.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="text-center relative z-10 w-full mt-8">
        <h3 className="text-2xl font-bold text-white mb-2">Project Hub</h3>
        <p className="text-zinc-400 leading-relaxed">Organize tasks with custom colors.</p>
      </div>
    </div>
  );
};
