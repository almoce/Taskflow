import { Link } from "react-router-dom";
import { CallToAction } from "@/components/landing/CallToAction";
import { FAQSection } from "@/components/landing/FAQSection";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { Footer } from "@/components/landing/Footer";
// import { HeroBackground } from "@/components/landing/HeroBackground";
import { HeroBackgroundClassic } from "@/components/landing/HeroBackgroundClassic"; // Use this for the old design
import { Navbar } from "@/components/landing/Navbar";
import { PricingSection } from "@/components/landing/PricingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-end pb-20 pt-80">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)] z-10" />

        {/* <HeroBackground /> */}
        <HeroBackgroundClassic />

        {/* Content */}
        <div className="container mx-auto px-6 relative z-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/60 mb-8 animate-fade-in-up backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-medium text-zinc-300">Local-First Productivity</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 pb-4 drop-shadow-2xl animate-fade-in-up [animation-delay:200ms] opacity-0 leading-[0.85]">
            Focus without
            <br />
            <span className="text-4xl md:text-6xl tracking-tight block mt-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 font-bold">
              friction.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up [animation-delay:400ms] opacity-0 font-medium">
            Experience the fastest way to manage tasks. Private by default, local-first, and
            designed to help you stay in the flow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms] opacity-0">
            <Link to="/app">
              <div className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-50 group">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#9333ea_0%,#e9d5ff_50%,#9333ea_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-slate-900">
                  Start without Sign-up
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <FeaturesGrid />
      <FeatureShowcase />
      <PricingSection />
      <CallToAction />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
