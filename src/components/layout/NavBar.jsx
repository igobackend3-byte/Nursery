import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../data/navigation';

function NavBar() {
  return (
    <nav className="secondary-header">
      <ul className="nav-links">
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className={item.children ? 'has-dropdown' : ''}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                [item.highlight ? 'highlight' : '', isActive ? 'active' : ''].join(' ').trim()
              }
            >
              {item.label.toUpperCase()} {item.children ? '▾' : ''}
            </NavLink>
            {item.children && (
              <ul className={`dropdown-menu${item.children.length > 6 ? ' dropdown-menu-mega' : ''}`}>
                {item.children.map((child) => (
                  <li key={child.label}>
                    <NavLink to={child.to}>{child.label}</NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;
