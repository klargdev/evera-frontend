import Logo from "@/components/logo";
import { down, useMediaQuery } from "@/hooks";
import { useSettings } from "@/store/settingStore";
import { cn } from "@/utils";
import { ThemeLayout } from "#/enum";
import Header from "./header";
import Main from "./main";
import { NavVerticalLayout, NavHorizontalLayout, NavMobileLayout } from "./nav";
import { useFilteredNavData } from "./nav/nav-data";

// Dashboard Layout
export default function DashboardLayout() {
	const isMobile = useMediaQuery(down("md"));
	const { themeLayout } = useSettings();
	const navData = useFilteredNavData();

	return (
		<div
			data-slot="slash-layout-root"
			className={cn("w-full min-h-svh flex bg-background", {
				"flex-col": isMobile || themeLayout === ThemeLayout.Horizontal,
			})}
		>
			{isMobile ? (
				<MobileLayout navData={navData} />
			) : (
				<PcLayout navData={navData} />
			)}
		</div>
	);
}

// Pc Layout
function PcLayout({ navData }) {
	const { themeLayout } = useSettings();

	if (themeLayout === ThemeLayout.Horizontal) return <PcHorizontalLayout navData={navData} />;
	return <PcVerticalLayout navData={navData} />;
}

function PcHorizontalLayout({ navData }) {
	return (
		<div data-slot="slash-layout-content" className={cn("w-full h-screen flex flex-col transition-all duration-300 ease-in-out")}> 
			<Header leftSlot={<Logo />} />
			<NavHorizontalLayout data={navData} />
			<Main />
		</div>
	);
}

function PcVerticalLayout({ navData }) {
	const settings = useSettings();
	const { themeLayout } = settings;
	return (
		<>
			<NavVerticalLayout data={navData} />
			<div
				data-slot="slash-layout-content"
				className={cn("w-full flex flex-col transition-[padding] duration-300 ease-in-out", {
					"pl-[var(--layout-nav-width)]": themeLayout === ThemeLayout.Vertical,
					"pl-[var(--layout-nav-width-mini)]": themeLayout === ThemeLayout.Mini,
				})}
			>
				<Header leftSlot={<Logo />} />
				<Main />
			</div>
		</>
	);
}

// Mobile Layout
function MobileLayout({ navData }) {
	return (
		<>
			<Header leftSlot={<Logo />} />
			<NavMobileLayout data={navData} />
			<Main />
		</>
	);
}
