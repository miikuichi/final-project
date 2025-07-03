import React from "react";
import { Navigate } from "react-router-dom";
import { useRole } from "./RoleContext";

const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/" }) => {
  const { role } = useRole();

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const defaultRedirect = role === "admin" ? "/admin" : "/hr";
    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  return children;
};

export default ProtectedRoute;
