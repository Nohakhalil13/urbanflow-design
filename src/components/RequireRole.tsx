import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useApp } from "@/lib/app-context";
import { Role } from "@/lib/urbanfix-data";

export function RequireRole({ role, children }: { role: Role | Role[]; children: ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
