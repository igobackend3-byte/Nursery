import { Link } from 'react-router-dom';
import igoLogo from '../../assets/igo-nursery-logo.jpeg';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import DecorativeLeaves from '../DecorativeLeaves';
import { useLanguage } from '../../context/LanguageContext';

// Footer content matches the user-supplied reference screenshot exactly
// (brand text, columns, contact details) - see the Contact page redesign
// commit for the same "why real vs. example data" note. This is a
// shared component rendered on every page, so this change is sitewide,
// not scoped to one page - flagged to the user for that reason.

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'X', href: '#' },
];

const SocialIcon = {
  Facebook: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.87v-6.98H7.9V12h2.5V9.8c0-2.48 1.48-3.85 3.74-3.85 1.08 0 2.21.2 2.21.2v2.43h-1.25c-1.23 0-1.6.76-1.6 1.55V12h2.73l-.44 2.89h-2.3v6.98A10 10 0 0 0 22 12z" /></svg>
  ),
  Instagram: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
  ),
  YouTube: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 6.5a3 3 0 0 0-2.1-2.1C18.6 4 12 4 12 4s-6.6 0-8.4.4A3 3 0 0 0 1.5 6.5 31 31 0 0 0 1 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1c1.8.4 8.4.4 8.4.4s6.6 0 8.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-5.5zM10 15.5v-7l6 3.5z" /></svg>
  ),
  LinkedIn: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.6 4.78 6V21h-4v-5.6c0-1.35-.03-3.1-1.9-3.1-1.9 0-2.2 1.5-2.2 3v5.7H9z" /></svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.1-9.3L1 2h7l4.9 6zM17.6 20h1.9L7.5 3.9H5.5z" /></svg>
  ),
};

// `labelKey` -> footer.<labelKey> in i18n/translations.js; `label` stays
// as the English fallback/source of truth (same pattern as data/navigation.js).
const QUICK_LINKS = [
  { label: 'Home', labelKey: 'linkHome', to: '/' },
  { label: 'About', labelKey: 'linkAbout', to: '/about' },
  { label: 'Products', labelKey: 'linkProducts', to: '/category/indoor-plants' },
  { label: 'Services', labelKey: 'linkServices', to: '/garden-services' },
  { label: 'Blog', labelKey: 'linkBlog', to: '/blog' },
  { label: 'Contact Us', labelKey: 'linkContact', to: '/contact' },
];

const SERVICE_LINKS = [
  { label: 'Seeds & Nursery', labelKey: 'seedsNursery', to: '/category/seeds' },
  { label: 'Pots & Planters', labelKey: 'potsPlanters', to: '/category/pots-planters' },
  { label: 'Plant Care', labelKey: 'plantCare', to: '/category/plant-care' },
  { label: 'Garden Essentials', labelKey: 'gardenEssentials', to: '/garden-services' },
  { label: 'Agricultural Solutions', labelKey: 'agriculturalSolutions', to: '/landscaping' },
];

function FooterLeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" /></svg>
  );
}

const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg>
);
const IconPin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" /><circle cx="12" cy="9" r="3" /></svg>
);

// A small decorative vine tracing the very top edge of the footer, with a
// few tiny leaves along it - purely ambient, never overlapping the real
// footer content beneath it. Draws itself in (stroke-dashoffset) the first
// time the footer scrolls into view, reusing the same `is-visible` class
// the footer columns already fade in with.
function FooterVine() {
  return (
    <svg className="footer-vine" viewBox="0 0 1200 28" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 6 C 150 24, 300 -6, 450 10 S 750 22, 900 8 S 1100 -4, 1200 12" />
      <g className="vine-leaf" transform="translate(210,8)"><FooterLeafIcon /></g>
      <g className="vine-leaf" transform="translate(560,14) scale(0.85)"><FooterLeafIcon /></g>
      <g className="vine-leaf" transform="translate(830,10) scale(0.9)"><FooterLeafIcon /></g>
    </svg>
  );
}

function Footer() {
  const [ref, visible] = useScrollReveal(0.1);
  const { t } = useLanguage();
  return (
    <footer ref={ref} className={`site-footer ftr-agritech${visible ? ' is-visible' : ''}`}>
      <FooterVine />
      <DecorativeLeaves variant="footer" count={2} />
      <span className="ftr-leaf-decor" aria-hidden="true"><FooterLeafIcon /></span>

      <div className="footer-top ftr-top-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={igoLogo} alt="IGO Nursery" className="logo-icon" />
            <span>IGO Nursery</span>
          </div>
          <p className="ftr-desc">
            {t('footer.desc1')}<br />{t('footer.desc2')}
          </p>
          <div className="ftr-social">
            {SOCIAL_LINKS.map((s) => {
              const SIcon = SocialIcon[s.label];
              return (
                <a href={s.href} key={s.label} aria-label={s.label} className="ftr-social-btn">
                  <SIcon />
                </a>
              );
            })}
          </div>
        </div>

        <div className="footer-col">
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            {QUICK_LINKS.map((l) => (
              <li key={l.label}><Link to={l.to}>{t(`footer.${l.labelKey}`)}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('footer.ourServices')}</h4>
          <ul>
            {SERVICE_LINKS.map((l) => (
              <li key={l.label}><Link to={l.to}>{t(`footer.${l.labelKey}`)}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col ftr-contact-col">
          <h4>{t('footer.contactUs')}</h4>
          <p><span className="ftr-contact-icon"><IconPhone /></span> +91 98765 43210</p>
          <p><span className="ftr-contact-icon"><IconMail /></span> support@igoagritechfarms.com</p>
          {/* The street address is a real-world postal address - kept
              un-translated (place/road names) across every language,
              same convention as the founder's name above. */}
          <p><span className="ftr-contact-icon"><IconPin /></span> 123 Green Valley Road,<br />Coimbatore, Tamil Nadu – 641XXX</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>{t('footer.copyright')}</span>
        <span className="footer-legal-links">
          <Link to="/privacy-policy">{t('footer.privacyPolicy')}</Link>
          <span aria-hidden="true"> | </span>
          <Link to="/terms">{t('footer.termsConditions')}</Link>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
