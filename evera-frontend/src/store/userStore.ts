import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useNavigate } from "react-router";

import userService, { type SignInReq } from "@/api/services/userService";

import { toast } from "sonner";
import type { UserInfo, UserToken } from "#/entity";
import { StorageEnum } from "#/enum";

type UserStore = {
	userInfo: Partial<UserInfo>;
	userToken: UserToken;

	actions: {
		setUserInfo: (userInfo: UserInfo) => void;
		setUserToken: (token: UserToken) => void;
		clearUserInfoAndToken: () => void;
	};
};

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			userInfo: {},
			userToken: {},
			actions: {
				setUserInfo: (userInfo) => {
					set({ userInfo });
				},
				setUserToken: (userToken) => {
					set({ userToken });
				},
				clearUserInfoAndToken() {
					set({ userInfo: {}, userToken: {} });
				},
			},
		}),
		{
			name: "userStore", // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
			partialize: (state) => ({
				[StorageEnum.UserInfo]: state.userInfo,
				[StorageEnum.UserToken]: state.userToken,
			}),
		},
	),
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermissions = () => useUserStore((state) => state.userInfo?.permissions || []);
export const useUserRoles = () => useUserStore((state) => state.userInfo?.roles || []);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
	const { setUserToken, setUserInfo } = useUserActions();

	const signInMutation = useMutation({
		mutationFn: userService.signin,
	});

	const signIn = async (data: SignInReq) => {
		try {
			const res = await signInMutation.mutateAsync(data);
			console.log('Login response:', res);
			console.log('Response type:', typeof res);
			console.log('Response keys:', Object.keys(res));
			console.log('Response.data:', res.data);
			
			// Handle different response formats
			let user, accessToken, refreshToken;
			
			if (res.success && res.data) {
				// Format: { success: true, data: { user, token, refreshToken } }
				user = res.data.user;
				accessToken = res.data.token;
				refreshToken = res.data.refreshToken;
			} else if (res.user && res.token) {
				// Format: { user, token, refreshToken }
				user = res.user;
				accessToken = res.token;
				refreshToken = res.refreshToken;
			} else {
				// Fallback: assume res is the data directly
				user = res.user;
				accessToken = res.token;
				refreshToken = res.refreshToken;
			}
			
			console.log('Extracted data:', { user, accessToken, refreshToken });
			
			if (!accessToken) {
				throw new Error('No access token received from server');
			}
			
			setUserToken({ accessToken, refreshToken });
			setUserInfo(user || {});
			console.log('User data set:', { user, accessToken });
		} catch (err) {
			console.error('Login error:', err);
			let message = err.message;
			// If the error message is technical, show a friendly fallback
			if (!message || message.includes('Cannot read') || message.includes('undefined') || message.includes('object Object')) {
				message = 'Something went wrong. Please check your details and try again.';
			}
			toast.error(message, {
				position: "top-center",
			});
			throw err;
		}
	};

	return signIn;
};

export const useLogout = () => {
	const { clearUserInfoAndToken } = useUserActions();
	const navigate = useNavigate();

	const logoutMutation = useMutation({
		mutationFn: userService.logout,
	});

	const logout = async () => {
		try {
			await logoutMutation.mutateAsync();
		} catch (error) {
			// Even if logout fails, clear local data
		} finally {
			clearUserInfoAndToken();
			navigate("/auth/login", { replace: true });
		}
	};

	return logout;
};

export default useUserStore;
