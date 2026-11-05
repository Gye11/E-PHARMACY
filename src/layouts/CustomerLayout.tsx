import { NavLink, Outlet, Link } from "react-router-dom";
import { Logo } from "../components/Logo/Logo";
import "../styles/customer.css";

export function CustomerLayout() {
  return (
    <div className="customer-layout">
      <header className="customer-header">
        <Logo to="/home" />
        <nav aria-label="Main navigation">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/medicine-store">Medicine store</NavLink>
          <NavLink to="/medicine">Medicine</NavLink>
        </nav>
        <div className="customer-header__actions">
          <Link
            className="customer-header__cart"
            to="/cart"
            aria-label="Shopping cart"
          >
            Cart
          </Link>
          <Link className="customer-header__account" to="/login">
            Log in
          </Link>
        </div>
      </header>
      <main className="customer-main">
        <Outlet />
      </main>
      <footer className="customer-footer">
        <div className="customer-footer__top">
          <div>
            <Logo to="/home" />
            <p>
              Get the medicine to help you feel better, get back to your active
              life, and enjoy every moment.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <Link to="/home">Home</Link>
            <Link to="/medicine-store">Medicine store</Link>
            <Link to="/medicine">Medicine</Link>
          </nav>
          <div className="customer-footer__socials">
            <a
              href="https://www.facebook.com/golTclub/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="https://www.instagram.com/goitclub/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              ◎
            </a>
            <a
              href="https://www.youtube.com/c/GoIT"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              ▶
            </a>
          </div>
        </div>
        <div className="customer-footer__bottom">
          <span>© E-Pharmacy 2023. All Rights Reserved</span>
          <a href="mailto:support@e-pharmacy.example?subject=Privacy%20Policy">
            Privacy Policy
          </a>
          <a href="mailto:support@e-pharmacy.example?subject=Terms%20and%20Conditions">
            Terms &amp; Conditions
          </a>
        </div>
      </footer>
    </div>
  );
}
