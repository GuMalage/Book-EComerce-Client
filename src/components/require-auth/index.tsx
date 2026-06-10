import { useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

interface RequireAuthProps {
  allowedRoles?: string[];
}

export function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { authenticated, authenticatedUser } = useContext(AuthContext);
  const location = useLocation();

  if (!allowedRoles) {
    return authenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasPermission = authenticatedUser?.authorities?.some(
    (authority) => allowedRoles.includes(authority.authority)
  );

  return hasPermission ? (
    <Outlet />
  ) : authenticated ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}