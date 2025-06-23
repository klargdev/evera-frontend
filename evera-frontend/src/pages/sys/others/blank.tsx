import { useNavigate } from "react-router";

const plans = [
	{ name: "Basic", price: "GHS 300", description: "Photo gallery (up to 20 images), Memory wall, Service details, Shareable link" },
	{ name: "Standard", price: "GHS 500", description: "Everything in Basic, Unlimited images, Background music, Donations section, Custom QR code" },
	{ name: "Premium", price: "GHS 700", description: "Everything in Standard, Custom domain, Admin dashboard, Advanced moderation, Priority support" },
];

export default function PlanSelection() {
	const navigate = useNavigate();
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh]">
			<h1 className="text-3xl font-bold mb-4">Select a Plan</h1>
			<div className="flex flex-col md:flex-row gap-8">
				{plans.map((plan) => (
					<div key={plan.name} className="bg-white rounded-xl shadow p-8 flex flex-col items-center border border-[#8B2F1C]/30 w-72">
						<h2 className="text-2xl font-bold text-[#8B2F1C] mb-2">{plan.name}</h2>
						<div className="text-xl font-semibold mb-2">{plan.price}</div>
						<div className="text-gray-700 text-center mb-4">{plan.description}</div>
						<button
							className="bg-[#8B2F1C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6B570A] transition"
							onClick={() => navigate(`/auth/register?plan=${plan.name.toLowerCase()}`)}
						>
							Select {plan.name}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
