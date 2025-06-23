import { LineLoading } from "@/components/loading";
import DashboardLayout from "@/layouts/dashboard";
import LoginAuthGuard from "@/routes/components/login-auth-guard";
import { Suspense, lazy } from "react";
import { Navigate, type RouteObject } from "react-router";
import DashboardRedirect from "@/pages/dashboard/DashboardRedirect";

const Analysis = lazy(() => import("@/pages/dashboard/analysis"));
const Workbench = lazy(() => import("@/pages/dashboard/workbench"));

export const dashboardRoutes: RouteObject[] = [
	{
		path: "/dashboard",
		element: (
			<LoginAuthGuard>
				<Suspense fallback={<LineLoading />}>
					<DashboardLayout />
				</Suspense>
			</LoginAuthGuard>
		),
		children: [
			{ index: true, element: <DashboardRedirect /> },
			{ path: "analysis", element: <Analysis /> },
			{ path: "workbench", element: <Workbench /> },
			{ path: "*", element: <Navigate to="/dashboard" replace /> },
		],
	},
];
