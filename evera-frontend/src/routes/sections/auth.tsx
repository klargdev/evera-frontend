import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { RouteObject } from "react-router";

const LoginPage = lazy(() => import("@/views/authentication/login"));
const ResetPasswordPage = lazy(() => import("@/views/authentication/login/reset-password-page"));

const authCustom: RouteObject[] = [
	{
		path: "login",
		element: <LoginPage />,
	},
	{
		path: "register",
		element: <LoginPage />,
	},
];

export const authRoutes: RouteObject[] = [
	{
		path: "auth",
		element: (
			<Suspense>
				<Outlet />
			</Suspense>
		),
		children: authCustom,
	},
	// Only add reset-password as a top-level route
	{
		path: "reset-password",
		element: <ResetPasswordPage />,
	},
];
