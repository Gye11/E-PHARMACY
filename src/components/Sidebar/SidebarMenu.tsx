import { NavLink } from 'react-router-dom';
import { SpriteIcon } from '../common/SpriteIcon';
import './Sidebar.css';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/orders', label: 'Orders', icon: 'orders' },
  { to: '/products', label: 'Products', icon: 'products' },
  { to: '/customers', label: 'Customers', icon: 'customers' },
  { to: '/suppliers', label: 'Suppliers', icon: 'suppliers' },
] as const;

export function SidebarMenu() {
  return (
    <nav className="sidebar-menu" aria-label="Main navigation">
      <ul className="sidebar-menu__list">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `sidebar-menu__link${isActive ? ' sidebar-menu__link--active' : ''}`
              }
              title={item.label}
            >
              <SpriteIcon name={item.icon} size={22} />
              <span className="sidebar-menu__label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
