import { useUserInfo } from "@/store/userStore";
import { Navigate } from "react-router";

/**
 * Secure dashboard redirect based on user role.
 * - Super admin: analytics
 * - Admin/user: workbench
 * - Default: workbench (defense-in-depth)
 */
export default function DashboardRedirect() {
  const userInfo = useUserInfo();
  // Defensive: roles may be undefined or empty
  const roles = Array.isArray(userInfo?.roles)
    ? userInfo.roles.map(r => (r.code || r.name || "").toLowerCase())
    : [];

  // Privilege escalation defense: only allow super-admin to see analytics
  if (roles.includes("super-admin")) {
    return <Navigate to="/dashboard/analysis" replace />;
  }

  // All other roles (admin, user, etc.) go to workbench
  return <Navigate to="/dashboard/workbench" replace />;
} 