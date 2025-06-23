import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { useTranslation } from "react-i18next";

interface ReturnButtonProps {
	onClick?: () => void;
}
export function ReturnButton({ onClick }: ReturnButtonProps) {
	const { t } = useTranslation();
	return (
		<Button 
			variant="ghost" 
			onClick={onClick} 
			className="w-full cursor-pointer text-muted-foreground hover:text-foreground"
		>
			<Icon icon="solar:alt-arrow-left-linear" size={20} className="mr-2" />
			<span className="text-sm font-medium">{t("sys.login.backSignIn") || "Back to Sign In"}</span>
		</Button>
	);
}
