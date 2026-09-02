import { Link } from 'react-router-dom';
import { FOOTER_LINKS } from '../../data/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { getNavLabelTranslation } from '../../i18n/translations';
import igoLogo from '../../assets/igo-nursery-logo.jpeg';

// Most footer links duplicate a top-nav item, so they reuse that existing
// translation key (nav.*, header.*, orders.myOrders, pages.*) rather than
// a separate translation - keyed by the exact English label text in
// data/navigation.js's FOOTER_LINKS. "Garden Décor" and "FAQ" have no
// top-nav equivalent, so those two fall through to getNavLabelTranslation's
// route-keyed lookup (same dictionary the nav dropdown uses) instead.
const FOOTER_LABEL_KEYS = {
  'Plants': 'nav.plants', 'Seeds': 'nav.seeds', 'Pots & Planters': 'nav.potsPlanters',
  'Plant Care': 'nav.plantCare', 'Offers': 'nav.offers',
  'Our Story': 'pages.ourStory', 'Gifting': 'nav.gifting', 'Garden Services': 'nav.gardenServices',
  'Blog': 'nav.blog', 'Locate Store': 'nav.locateStore',
  'My Account': 'header.account', 'Orders': 'orders.myOrders', 'Wishlist': 'header.wishlist',
  'Cart': 'header.cart', 'Contact': 'pages.contact',
};

function FooterColumn({ title, links, t, language }) {
  return (
    <div className="footer-col">
      <h4>{title}</h4>
      <ul>
        {links.map((link) => {
          const key = FOOTER_LABEL_KEYS[link.label];
          const label = key ? t(key) : getNavLabelTranslation(link.to, link.label, language);
          return (
            <li key={link.label}>
              <Link to={link.to}>{label}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={igoLogo} alt="IGO Nursery" className="logo-icon" />
            <span>IGO Nursery</span>
          </div>
          <p className="footer-kicker">{t('footer.tagline')}</p>
          <p className="footer-desc">{t('footer.description')}</p>
        </div>
        <FooterColumn title={t('footer.shop')} links={FOOTER_LINKS.shop} t={t} language={language} />
        <FooterColumn title={t('footer.discover')} links={FOOTER_LINKS.discover} t={t} language={language} />
        <FooterColumn title={t('footer.account')} links={FOOTER_LINKS.account} t={t} language={language} />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} IGO Nursery. {t('footer.rights')}</span>
        <span>{t('footer.builtFor')}</span>
      </div>
    </footer>
  );
}

export default Footer;
