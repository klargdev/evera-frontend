import React from "react";
import { useNavigate, useLocation } from "react-router";

// Color palette
// Very dark black: #181818
// Darker gold: #C9A227
// Reddish brown: #8B2F1C
// White: #FFFFFF

const features = [
	{
		icon: "🌹",
		title: "Memorial Pages",
		description:
			"Create a beautiful, shareable page to honor your loved one with stories, photos, and tributes.",
	},
	{
		icon: "🗓️",
		title: "Service Details",
		description:
			"Share event info, maps, livestream links, and RSVP options for memorial services.",
	},
	{
		icon: "🖼️",
		title: "Photo Gallery",
		description: "Upload unlimited images, categorize memories, and set a cover photo.",
	},
	{
		icon: "💬",
		title: "Memory Wall",
		description:
			"Visitors can post tributes, messages, and photos. Optional moderation and reactions included.",
	},
	{
		icon: "🎵",
		title: "Background Music",
		description: "Add a favorite song to play on the memorial page, with easy controls.",
	},
	{
		icon: "💝",
		title: "Donations",
		description:
			"Support the family with mobile money, card payments, and custom messages.",
	},
];

const steps = [
	{
		title: "Create a Memorial",
		description: "Enter details, upload a cover photo, and preview your page.",
	},
	{
		title: "Select a Plan",
		description: "Choose Basic, Standard, or Premium. Pay securely online.",
	},
	{
		title: "Share & Celebrate",
		description: "Fill in the story, invite others, and share your unique link.",
	},
];

const plans = [
	{
		name: "Basic",
		price: "GHS 300",
		features: [
			"Memorial page",
			"Photo gallery (up to 20 images)",
			"Memory wall",
			"Service details",
			"Shareable link",
		],
	},
	{
		name: "Standard",
		price: "GHS 500",
		features: [
			"Everything in Basic",
			"Unlimited images",
			"Background music",
			"Donations section",
			"Custom QR code",
		],
	},
	{
		name: "Premium",
		price: "GHS 700",
		features: [
			"Everything in Standard",
			"Custom domain",
			"Admin dashboard",
			"Advanced moderation",
			"Priority support",
		],
	},
];

export default function EveraLanding() {
	// Always use white background and dark text for SaaS look
	const [bgLoaded, setBgLoaded] = React.useState(true);
	const navigate = useNavigate();
	const location = useLocation();

	React.useEffect(() => {
		const img = new window.Image();
		img.src = "/1.jpg";
		img.onload = () => setBgLoaded(true);
		img.onerror = () => setBgLoaded(false);
	}, []);

	React.useEffect(() => {
		// Check if we have a hash in the URL or if we're on the /plans route
		if (location.hash === '#plans' || location.pathname === '/plans') {
			// Find the plans section
			const plansSection = document.getElementById('plans');
			if (plansSection) {
				// Scroll to plans section with smooth behavior
				plansSection.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}, [location]); // Re-run when location changes

	React.useEffect(() => {
		// If there is no hash, scroll to top on mount
		if (!location.hash) {
			window.scrollTo({ top: 0, behavior: "auto" });
		}
	}, [location.pathname]);

	const handlePlanSelect = (planName) => {
		navigate({
			pathname: '/login',
			search: `?plan=${planName.toLowerCase()}`
		});
	};

	return (
		<div
			style={{
				position: "relative",
				minHeight: "100vh",
				color: "#181818",
				background: bgLoaded
					? "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.92)), url('/1.jpg') center/cover no-repeat"
					: "#fff",
			}}
			className="min-h-screen flex flex-col"
		>
			{/* Hero */}
			<section className="flex flex-col items-center text-center py-24 px-4 bg-transparent">
				<h1 className="text-5xl md:text-7xl font-extrabold text-[#181818] mb-6 drop-shadow-lg">
					Honor. Remember. <span className="text-[#6B570A]">Celebrate.</span>
				</h1>
				<p className="text-xl md:text-2xl text-[#181818] mb-10 max-w-2xl">
					Create a beautiful, lasting memorial page for your loved one. Share stories, photos, and memories with family and friends, anywhere in the world.
				</p>
				<button
					// Scroll to plans section instead of navigating
					onClick={() => {
						const plansSection = document.getElementById('plans');
						if (plansSection) {
							plansSection.scrollIntoView({ behavior: 'smooth' });
						}
					}}
					className="inline-block bg-[#8B2F1C] text-white px-10 py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-[#6B570A] transition"
				>
					Create a Memorial
				</button>
				<img
					src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=900&q=80"
					alt="Evera memorial example"
					className="rounded-3xl shadow-2xl mt-16 w-full max-w-3xl object-cover border-4 border-[#6B570A]/20"
				/>
			</section>

			{/* Features */}
			<section className="py-20 px-4 bg-transparent">
				<h2 className="text-4xl font-bold text-center text-[#8B2F1C] mb-14">
					Features
				</h2>

				<div 
					style={{
						position: "relative",
						minHeight: "100vh",
						color: "#181818",
						background: "linear-gradient(rgba(255, 255, 255, 0.91), rgba(255,255,255,0.92)), url('/1.jpg') center/cover no-repeat",
					}}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
				>
					{features.map((f, i) => (
						<div
							key={i}
							className="bg-white/40 rounded-2xl p-8 shadow-md flex flex-col items-center text-center border border-[#6B570A]/30"
						>
							<div className="text-5xl mb-4 text-[#8B2F1C]">{f.icon}</div>
							<h3 className="font-bold text-xl text-[#181818] mb-2">
								{f.title}
							</h3>
							<p className="text-[#181818] text-base opacity-80">
								{f.description}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* How it works */}
			<section className="py-20 px-4 bg-transparent">
				<h2 className="text-4xl font-bold text-center text-[#8B2F1C] mb-14">
					How It Works
				</h2>
				<div className="flex flex-col md:flex-row justify-center items-stretch gap-10 max-w-5xl mx-auto">
					{steps.map((step, i) => (
						<div
							key={i}
							className="flex-1 bg-white/80 rounded-2xl shadow p-8 flex flex-col items-center border border-[#6B570A]/30"
						>
							<div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#6B570A] text-white font-bold text-2xl mb-5 border-2 border-[#8B2F1C]">
								{i + 1}
							</div>
							<h3 className="font-semibold text-xl text-[#181818] mb-2">
								{step.title}
							</h3>
							<p className="text-[#181818] text-base opacity-80">
								{step.description}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Pricing Plans */}
			<section id="plans" className="py-20 px-4 bg-transparent">
				<h2 className="text-4xl font-bold text-center text-[#8B2F1C] mb-14">
					Choose Your Plan
				</h2>
				<div className="flex flex-col md:flex-row justify-center gap-10 max-w-5xl mx-auto">
					{plans.map((plan, i) => (
						<div
							key={i}
							className="flex-1 bg-white/80 rounded-2xl shadow p-10 flex flex-col items-center border-2 border-[#6B570A]/40 hover:border-[#8B2F1C] transition"
						>
							<h3 className="text-2xl font-bold text-[#8B2F1C] mb-3">
								{plan.name}
							</h3>
							<div className="text-4xl font-extrabold text-[#8B2F1C] mb-6">
								{plan.price}
							</div>
							<ul className="text-[#181818] mb-8 space-y-3 text-base opacity-80">
								{plan.features.map((f, j) => (
									<li key={j}>• {f}</li>
								))}
							</ul>
							<button
								className="bg-[#8B2F1C] text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-[#6B570A] hover:text-white hover:border hover:border-[#8B2F1C] transition"
								onClick={() => handlePlanSelect(plan.name)}
							>
								Select
							</button>
						</div>
					))}
				</div>
			</section>

			{/* Footer */}
			<footer className="mt-auto py-10 bg-white text-[#181818] text-center border-t border-[#6B570A]/20 w-full">
				<div className="max-w-[900px] mx-auto">
					<div className="font-bold text-lg mb-2 text-[#8B2F1C]">Evera</div>
					<div className="text-[#181818]/80 text-sm">
						&copy; {new Date().getFullYear()} Evera. All rights reserved.
					</div>
					<div className="mt-4 flex justify-center gap-6 text-[#181818]/80 text-sm">
						<a href="#features" className="hover:underline text-[#8B2F1C]">
							Features
						</a>
						<a href="#plans" className="hover:underline text-[#6B570A]">
							Plans
						</a>
						<a href="mailto:info@evera.com" className="hover:underline text-[#8B2F1C]">
							Contact
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
