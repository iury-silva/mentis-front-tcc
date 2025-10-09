// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  requireCompleteProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  requireCompleteProfile = true,
}) => {
  const { isAuthenticated, loading, user, profileCompleted } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto está carregando OU enquanto o usuário existe mas os dados ainda não foram carregados completamente
  if (loading || (isAuthenticated && user && profileCompleted === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Aguarda o usuário estar completamente carregado antes de fazer verificações
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Perfil incompleto - só executa quando profileCompleted está definido
  if (
    requireCompleteProfile &&
    profileCompleted === false &&
    location.pathname !== "/complete-profile"
  ) {
    return <Navigate to="/complete-profile" replace />;
  }

  // Redireciona se perfil já completo
  if (location.pathname === "/complete-profile" && profileCompleted === true) {
    const redirectPath = user.role?.includes("admin")
      ? "/dashboard"
      : "/dashboard-user";
    return <Navigate to={redirectPath} replace />;
  }

  // Checa role permitida
  if (allowedRoles && user.role) {
    const hasAccess = allowedRoles.some((role) =>
      user.role.includes(role)
    );
    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
