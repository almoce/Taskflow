import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-6 border-t border-white/10 bg-black text-zinc-500 text-sm">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}logo_taskflow.png`}
            alt="TaskFlow"
            className="w-5 h-5"
          />
          <span>© 2026 TaskFlow Inc.</span>
        </div>
        <div className="flex gap-8">
          <a
            href="https://github.com/almoce/Taskflow"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
