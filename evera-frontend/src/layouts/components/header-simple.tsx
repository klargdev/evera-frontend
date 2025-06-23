import Logo from "@/components/logo";
//import SettingButton from "./setting-button";
import { useTheme } from "@/theme/hooks/use-theme";

export default function HeaderSimple() {
	const { mode } = useTheme();
	const isDarkGold = mode === "dark";
	//const settingIconColor = "#181818";
	return (
		<header className="flex h-28 w-full max-w-[2500px] mx-auto items-center justify-between px-16 bg-white shadow-sm sticky top-0 z-10 border-b border-[#6B570A]/20">
			<div className="flex items-center gap-4">
				<Logo size={30} />
				<span className={isDarkGold ? "text-2xl font-extrabold text-[#8B2F1C] tracking-tight" : "text-2xl font-extrabold text-[#8B2F1C] tracking-tight"}>Evera</span>
			</div>
			<nav className="flex gap-4 items-center">
				<a href="#plans" className="bg-[#6B570A] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#b08d22] transition">Create Memorial</a>
				{/*<SettingButton iconColor={settingIconColor} />*/}
			</nav>
		</header>
	);
}
