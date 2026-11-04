import { NavLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../Logo/Logo';
import { LogoutBtn } from './LogoutBtn';
import './Header.css';

const primaryNavigation = [
  { to: '/shop', label: 'Shop' },
  { to: '/products', label: 'Medicine' },
  { to: '/dashboard', label: 'Statistics' },
] as const;

export function Header() {
  const { userEmail } = useAuth();

  return (
    <header className="app-header">
      <Logo />
      <nav className="app-header__navigation" aria-label="Main sections">
        {primaryNavigation.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `app-header__nav-link${isActive ? ' app-header__nav-link--active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <Box className="app-header__account">
        <Typography variant="body2" className="app-header__subtitle">
          {userEmail ?? 'vendor@gmail.com'}
        </Typography>
        <LogoutBtn />
      </Box>
    </header>
  );
}
