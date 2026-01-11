import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CallToAction = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-zinc-900"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Ready to build better?
        </h2>
        <p className="text-zinc-400 mb-10 max-w-lg mx-auto">
          Join thousands of developers and product managers who are already
          shipping faster with Taskflow.
        </p>
        <Link to="/app">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 h-12 font-medium"
          >
            Get started for free
          </Button>
        </Link>
      </div>
    </section>
  );
};
