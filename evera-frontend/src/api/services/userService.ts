import apiClient from "../apiClient";

import type { UserInfo, UserToken } from "#/entity";

export interface SignInReq {
	email: string;
	password: string;
}

export interface SignUpReq {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	plan: 'basic' | 'standard' | 'premium';
}

export interface ForgotPasswordReq {
	email: string;
}

export interface ResetPasswordReq {
	password: string;
	confirmPassword: string;
}

export type SignInRes = { success: boolean; data: UserToken & { user: UserInfo } };
export type ForgotPasswordRes = { message: string };
export type ResetPasswordRes = { message: string };

export enum UserApi {
	SignIn = "/api/v1/auth/login",
	SignUp = "/api/v1/auth/register",
	Logout = "/api/v1/auth/logout",
	Refresh = "/api/v1/auth/refresh",
	ForgotPassword = "/api/v1/auth/forgot-password",
	ResetPassword = "/api/v1/auth/reset-password",
	ValidateResetToken = "/api/v1/auth/reset-password",
	User = "/api/v1/user",
	VerifyEmail = "/api/v1/auth/verify-email",
	AcceptInvite = "/api/v1/auth/accept-invite",
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.post({ url: UserApi.Logout });
const forgotPassword = (email: string) =>
	apiClient.post({ url: "/api/v1/auth/forgot-password", data: { email } });
const validateResetToken = (token: string) => apiClient.get<{ valid: boolean; message?: string }>({ url: `${UserApi.ValidateResetToken}/${token}` });
const resetPassword = (token: string, data: ResetPasswordReq) => apiClient.post<ResetPasswordRes>({ url: `${UserApi.ResetPassword}/${token}`, data });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

export default {
	signin,
	signup,
	logout,
	forgotPassword,
	validateResetToken,
	resetPassword,
	findById,
};
