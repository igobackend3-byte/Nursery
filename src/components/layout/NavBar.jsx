import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../../data/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { getNavLabelTranslation } from '../../i18n/translations';
import { useSiteContent } from '../../hooks/useSiteContent';
import { useCatalogue } from '../../context/CatalogueContext';
import { PLANTS_NAV_CATEGORY_SLUGS } from '../../data/siteContent';

// Desktop opens dropdowns on hover (pure CSS). On devices without hover
// (touch), the first tap on a category opens its dropdown instead of
// navigating; a second tap navigates. Outside-click / Escape / route
// change all close it.
const CAN_HOVER = typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(hover: hover)').matches;

// Fallback glyph for a Plants dropdown category with no uploaded image -
// same "leaf placeholder instead of a broken image" pattern used elsewhere.
function NavLeafGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" />
    </svg>
  );
}

function NavBar() {
  const { t, language } = useLanguage();
  const [openKey, setOpenKey] = useState(null);
  const navRef = useRef(null);
  const location = useLocation();
  const { plantsHub } = useSiteContent();
  const { categories } = useCatalogue();

  // The Plants dropdown shows only the admin's 5 configured categories
  // (real category records) plus a "View All Plants" link - not the full
  // 30+ category mega-menu every other nav item still uses.
  const plantsNavSlugs = plantsHub?.navbarCategorySlugs?.length ? plantsHub.navbarCategorySlugs : PLANTS_NAV_CATEGORY_SLUGS.slice(0, 5);
  const plantsNavCategories = plantsNavSlugs.map((slug) => categories.find((c) => c.slug === slug)).filter(Boolean);

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
              {hasDropdown && item.label === 'Plants' ? (
                <ul className="dropdown-menu dropdown-menu-plants">
                  {plantsNavCategories.map((category) => (
                    <li key={category.slug}>
                      <NavLink to={`/category/${category.slug}`} onClick={() => setOpenKey(null)}>
                        <span className="dropdown-plants-icon">
                          {category.image ? <img src={category.image} alt="" /> : <NavLeafGlyph />}
                        </span>
                        {category.label}
                      </NavLink>
                    </li>
                  ))}
                  <li className="dropdown-plants-viewall">
                    <NavLink to="/plants" onClick={() => setOpenKey(null)}>
                      View All Plants →
                    </NavLink>
                  </li>
                </ul>
              ) : hasDropdown && (
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
