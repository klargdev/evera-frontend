import { useUserToken } from "@/store/userStore";
import { useCallback, useEffect } from "react";
import { useRouter } from "../hooks";

type Props = {
	children: React.ReactNode;
};
export default function LoginAuthGuard({ children }: Props) {
	const router = useRouter();
	const { accessToken } = useUserToken();

	const check = useCallback(() => {
		console.log('AuthGuard check - accessToken:', accessToken);
		if (!accessToken) {
			console.log('No access token, redirecting to login');
			router.replace("/auth/login");
		} else {
			console.log('Access token found, allowing access');
		}
	}, [router, accessToken]);

	useEffect(() => {
		check();
	}, [check]);

	return <>{children}</>;
}
