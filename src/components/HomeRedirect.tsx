import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redireciona baseado no papel do usuário
  if (user.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard-user" replace />;
  }
};

export default HomeRedirect;
