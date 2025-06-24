import { Suspense, lazy } from "react";
import type { RouteObject } from "react-router";

const LoginPage = lazy(() => import("@/views/authentication/login"));
const ResetPasswordPage = lazy(() => import("@/views/authentication/login/reset-password-page"));

export const authRoutes: RouteObject[] = [
	{
		path: "login",
		element: (
			<Suspense fallback={<div>Loading login...</div>}>
				<LoginPage />
			</Suspense>
		),
	},
	{
		path: "register",
		element: (
			<Suspense fallback={<div>Loading register...</div>}>
				<LoginPage />
			</Suspense>
		),
	},
	{
		path: "reset-password",
		element: (
			<Suspense fallback={<div>Loading reset password...</div>}>
				<ResetPasswordPage />
			</Suspense>
		),
	},
];
