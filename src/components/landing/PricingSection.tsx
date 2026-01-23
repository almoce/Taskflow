import { Check, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PricingSection = () => {
  const features = [
    { name: "Unlimited Tasks & Projects", free: true, pro: true },
    { name: "Offline-First Architecture", free: true, pro: true },
    { name: "Local Data Privacy", free: true, pro: true },
    { name: "Multi-device Sync", free: false, pro: true },
    { name: "Secure Cloud Backup", free: false, pro: true },
    { name: "Advanced Analytics", free: false, pro: true },
    { name: "Priority Support", free: false, pro: true },
  ];

  return (
    <section className="py-24 bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(50,50,50,0.1),transparent_70%)]" />

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Fair, simple plans.
          </h2>
          <p className="text-lg text-zinc-400 tracking-tight">
            Taskflow is free to use locally. Forever. <br />
            Upgrade only when you need the cloud.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/20 backdrop-blur-sm overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-3 p-6 border-b border-white/5 items-end gap-4">
            <div className="col-span-1 text-left">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Comparison
              </span>
            </div>
            <div className="col-span-1 text-center">
              <h3 className="text-lg font-bold text-white mb-4">Local</h3>
              <Link to="/app" data-umami-event="pricing_start_free_click">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full border-white/10 hover:bg-white/5 text-white h-9 text-xs"
                >
                  Start Free
                </Button>
              </Link>
            </div>
            <div className="col-span-1 text-center">
              <h3 className="text-lg font-bold text-white mb-4">Pro Cloud</h3>
              <Link to="/app" className="relative block" data-umami-event="pricing_upgrade_click">
                <Button
                  size="sm"
                  className="w-full rounded-full bg-white text-black hover:bg-zinc-200 h-9 text-xs"
                >
                  Upgrade
                </Button>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-[8px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider shadow-lg">
                  Recommended
                </div>
              </Link>
            </div>
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-white/5">
            {features.map((feature, i) => (
              <div
                key={feature.name}
                className={cn(
                  "grid grid-cols-3 p-4 items-center hover:bg-white/[0.02] transition-colors",
                  i % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]",
                )}
              >
                <div className="col-span-1 text-zinc-300 font-medium text-xs md:text-sm">
                  {feature.name}
                </div>

                {/* Free Column */}
                <div className="col-span-1 flex justify-center">
                  {feature.free ? (
                    <Check className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <Minus className="w-4 h-4 text-zinc-800" />
                  )}
                </div>

                {/* Pro Column */}
                <div className="col-span-1 flex justify-center">
                  {feature.pro ? (
                    <div className="p-0.5 rounded-full bg-purple-500/20">
                      <Check className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                  ) : (
                    <Minus className="w-4 h-4 text-zinc-800" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
