import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Taskflow Logo" className="w-8 h-8" />
          Taskflow
        </div>
        <div className="flex items-center gap-4">
          <Link to="/app">
            <Button
              size="sm"
              className="bg-white text-black hover:bg-zinc-200 transition-all font-medium rounded-full px-4 h-8 text-xs"
            >
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
