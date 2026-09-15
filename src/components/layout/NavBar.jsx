import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../../data/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { getNavLabelTranslation } from '../../i18n/translations';

// Desktop opens dropdowns on hover (pure CSS). On devices without hover
// (touch), the first tap on a category opens its dropdown instead of
// navigating; a second tap navigates. Outside-click / Escape / route
// change all close it.
const CAN_HOVER = typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(hover: hover)').matches;

function NavBar() {
  const { t, language } = useLanguage();
  const [openKey, setOpenKey] = useState(null);
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => setOpenKey(null), [location.pathname]);

  useEffect(() => {
    if (!openKey) return undefined;
    function onDocClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenKey(null);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpenKey(null);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [openKey]);

  return (
    <nav className="secondary-header" ref={navRef}>
      <ul className="nav-links">
        {NAV_ITEMS.map((item) => {
          const label = item.i18nKey ? t(`nav.${item.i18nKey}`) : item.label;
          const hasDropdown = !!item.children;
          const isOpen = openKey === item.label;
          return (
            <li
              key={item.label}
              className={`${hasDropdown ? 'has-dropdown' : ''}${isOpen ? ' is-open' : ''}`.trim()}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [item.highlight ? 'highlight' : '', isActive ? 'active' : ''].join(' ').trim()
                }
                aria-haspopup={hasDropdown ? 'true' : undefined}
                aria-expanded={hasDropdown ? isOpen : undefined}
                onClick={(e) => {
                  if (!hasDropdown) return;
                  if (!CAN_HOVER) {
                    // touch: first tap opens, second tap navigates
                    if (!isOpen) {
                      e.preventDefault();
                      setOpenKey(item.label);
                    } else {
                      setOpenKey(null);
                    }
                  }
                }}
              >
                {label.toUpperCase()} {hasDropdown ? '▾' : ''}
              </NavLink>
              {hasDropdown && (
                <ul
                  className={`dropdown-menu${item.children.length > 6 ? ' dropdown-menu-mega' : ''}${item.align === 'right' ? ' dropdown-menu-right' : ''}`}
                >
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <NavLink to={child.to} onClick={() => setOpenKey(null)}>
                        {getNavLabelTranslation(child.to, child.label, language)}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default NavBar;
