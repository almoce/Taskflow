import { CallToAction } from "@/components/landing/CallToAction";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { Footer } from "@/components/landing/Footer";
import { HeroBackground } from "@/components/landing/HeroBackground";
import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
	return (
		<div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
			<Navbar />

			{/* Hero Section */}
			<section className="relative flex flex-col items-center justify-end pb-20 pt-80">
				{/* Background Gradients */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)] z-10" />

				<HeroBackground />

				{/* Content */}
				<div className="container mx-auto px-6 relative z-20 text-center">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/60 mb-8 animate-fade-in-up backdrop-blur-md">
						<span className="flex h-2 w-2 rounded-full bg-purple-500"></span>
						<span className="text-xs font-medium text-zinc-300">
							Project & Task
						</span>
					</div>

					<h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 pb-2 drop-shadow-2xl animate-fade-in-up [animation-delay:200ms] opacity-0">
						Plan and Build
						<br />
						<span className="text-5xl block mt-2">your product</span>
					</h1>

					<p className="text-lg md:text-xl text-zinc-300 max-w-4xl mx-auto mb-10 leading-relaxed drop-shadow-lg animate-fade-in-up [animation-delay:400ms] opacity-0">
						Taskflow is a purpose-built tool for modern software development.
						Streamline issues, sprints, and product roadmaps with a tool
						designed for speed.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms] opacity-0">
						<Link to="/app">
							<div className="relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-50 group">
								<span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#9333ea_0%,#e9d5ff_50%,#9333ea_100%)]" />
								<span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-slate-900">
									Start building
								</span>
							</div>
						</Link>
					</div>
				</div>
			</section>

			<FeaturesGrid />
			<CallToAction />
			<Footer />
		</div>
	);
};

export default Index;
