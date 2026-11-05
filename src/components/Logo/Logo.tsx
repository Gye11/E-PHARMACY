import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoUrl from "../../assets/medicines/Maskgroup.jpg";
import "./Logo.css";

export function Logo({ to: destination }: { to?: string } = {}) {
  const { isAuthenticated } = useAuth();
  const to = destination ?? (isAuthenticated ? "/shop" : "/login");

  return (
    <Link to={to} className="logo" aria-label="E-Pharmacy home">
      <img src={logoUrl} alt="" width={40} height={40} decoding="async" />
      <span className="logo__text">E-Pharmacy</span>
    </Link>
  );
}
