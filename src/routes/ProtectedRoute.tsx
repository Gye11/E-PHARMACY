import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, role, authReady } = useAuth();
  const location = useLocation();

  if (!authReady)
    return (
      <div role="status" className="route-loading">
        Loading…
      </div>
    );
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (role !== "pharmacy") return <Navigate to="/home" replace />;

  return <Outlet />;
}
