import { ArrowUpRight, Cloud, Database, Layout, Lock, Plus, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  gradient,
  delay,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group relative p-1 rounded-3xl bg-transparent transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]",
        delay,
      )}
    >
      {/* Subtle border gradient */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 opacity-100" />

      {/* Hover glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl",
          gradient,
        )}
      />

      <div className="relative h-full bg-black/40 backdrop-blur-md rounded-[22px] overflow-hidden p-8 border border-white/5 group-hover:border-white/10 transition-colors flex flex-col">
        {/* Top Glow Ambient */}
        <div
          className={cn(
            "absolute -top-20 -right-20 w-64 h-64 blur-[80px] rounded-full opacity-10 transition-opacity duration-700 group-hover:opacity-30",
            gradient,
          )}
        />

        <div className="relative z-10 mb-8">
          <div
            className={cn(
              "inline-flex p-3 rounded-2xl border border-white/10 bg-white/5 mb-6 group-hover:scale-110 transition-transform duration-500",
              gradient,
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{title}</h3>
          <p className="text-zinc-400 leading-relaxed tracking-tight">{description}</p>
        </div>

        <div className="mt-auto relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/20 border border-white/5 group-hover:border-white/10 transition-colors">
          {/* Parallax Container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 transform transition-transform duration-700 group-hover:scale-[1.02]">
            {children}
          </div>
          {/* Glass Overlay on bottom for fade */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export const FeaturesGrid = () => {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Nebula Backgrounds */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse [animation-duration:8s]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full mix-blend-screen animate-pulse [animation-duration:10s]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Local First. Cloud Optional.
          </h2>
          <p className="text-xl text-zinc-400 tracking-tight">
            Designed for privacy, speed, and flexibility. Start small, scale up when you're ready.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 perspective-[2000px]">
          {/* Feature 1 - Privacy */}
          <FeatureCard
            icon={Shield}
            title="Privacy by Default"
            description="Your data stays on your device. We use local storage to keep your tasks private and secure."
            gradient="bg-emerald-500/20 text-emerald-400"
            delay="animate-fade-in-up [animation-delay:200ms]"
          >
            {/* Visual: Database/Lock */}
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full" />
              <div className="relative z-10 bg-zinc-900 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl">
                <Database className="w-12 h-12 text-zinc-500" />
                <div className="flex gap-2">
                  <div className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Encrypted
                  </div>
                  <div className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-1 rounded-full border border-white/5">
                    Local Only
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Feature 2 - Performance */}
          <FeatureCard
            icon={Zap}
            title="Instant Performance"
            description="Zero loading times. The app works completely offline so you can stay in your flow."
            gradient="bg-yellow-500/20 text-yellow-400"
            delay="animate-fade-in-up [animation-delay:400ms]"
          >
            {/* Visual: Speed/Instant */}
            <div className="w-full h-full flex flex-col justify-center items-center px-4">
              <div className="w-full bg-zinc-800/50 h-2 rounded-full overflow-hidden mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-300 w-full animate-[shimmer_2s_infinite]" />
              </div>
              <div className="flex justify-between w-full text-[10px] text-zinc-500 font-mono">
                <span>LATENCY</span>
                <span className="text-yellow-400">0ms</span>
              </div>
              <div className="mt-6 flex gap-3">
                <div className="w-16 h-20 bg-zinc-800 rounded border border-white/5 animate-pulse" />
                <div className="w-16 h-20 bg-zinc-800 rounded border border-white/5 animate-pulse [animation-delay:100ms]" />
                <div className="w-16 h-20 bg-zinc-800 rounded border border-white/5 animate-pulse [animation-delay:200ms]" />
              </div>
            </div>
          </FeatureCard>

          {/* Feature 3 - Cloud Sync */}
          <FeatureCard
            icon={Cloud}
            title="Pro Cloud Sync"
            description="Upgrade to Pro to sync across devices, collaborate, and back up your data securely to the cloud."
            gradient="bg-blue-500/20 text-blue-400"
            delay="animate-fade-in-up [animation-delay:600ms]"
          >
            {/* Visual: Cloud Sync */}
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]" />

              <div className="relative z-10 bg-zinc-900 p-3 rounded-xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Cloud className="w-8 h-8 text-blue-400" />
              </div>

              <div className="absolute top-8 left-8 bg-zinc-800 p-1.5 rounded-lg border border-white/5 animate-bounce [animation-duration:3s]">
                <Layout className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="absolute bottom-8 right-8 bg-zinc-800 p-1.5 rounded-lg border border-white/5 animate-bounce [animation-duration:3s] [animation-delay:1s]">
                <Database className="w-3 h-3 text-zinc-400" />
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};
