import { useRouter } from "@/routes/hooks";
import { useUserActions, useUserInfo } from "@/store/userStore";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/avatar";

/**
 * Account Dropdown
 */
export default function AccountDropdown() {
	const { replace } = useRouter();
	const userInfo = useUserInfo();
	const { clearUserInfoAndToken } = useUserActions();
	const { t } = useTranslation();
	
	// Handle different user data structures
	const username = userInfo?.firstName || userInfo?.username || "User";
	const email = userInfo?.email || "";
	const avatar = userInfo?.avatar || "";
	
	const logout = () => {
		try {
			clearUserInfoAndToken();
		} catch (error) {
			console.log(error);
		} finally {
			replace("/auth/login");
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage 
							src={userInfo?.avatar || userInfo?.profilePicture || null} 
							alt={userInfo?.firstName || userInfo?.name || 'User'} 
						/>
						<AvatarFallback>
							{userInfo?.firstName?.[0] || userInfo?.name?.[0] || 'U'}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<div className="flex items-center gap-2 p-2">
					<Avatar className="h-10 w-10">
						<AvatarImage 
							src={userInfo?.avatar || userInfo?.profilePicture || null} 
							alt={userInfo?.firstName || userInfo?.name || 'User'} 
						/>
						<AvatarFallback>
							{userInfo?.firstName?.[0] || userInfo?.name?.[0] || 'U'}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col items-start">
						<div className="text-text-primary text-sm font-medium">{username}</div>
						<div className="text-text-secondary text-xs">{email}</div>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<NavLink to="https://docs-admin.slashspaces.com/" target="_blank">
						{t("sys.docs")}
					</NavLink>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<NavLink to="/management/user/profile">{t("sys.nav.user.profile")}</NavLink>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<NavLink to="/management/user/account">{t("sys.nav.user.account")}</NavLink>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="font-bold text-warning" onClick={logout}>
					{t("sys.login.logout")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
