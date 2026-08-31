import { Link } from 'react-router-dom';
import { FOOTER_LINKS } from '../../data/navigation';
import { useLanguage } from '../../context/LanguageContext';
import igoLogo from '../../assets/igo-nursery-logo.jpeg';

function FooterColumn({ title, links }) {
  return (
    <div className="footer-col">
      <h4>{title}</h4>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  const { t } = useLanguage();

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
        <FooterColumn title={t('footer.shop')} links={FOOTER_LINKS.shop} />
        <FooterColumn title={t('footer.discover')} links={FOOTER_LINKS.discover} />
        <FooterColumn title={t('footer.account')} links={FOOTER_LINKS.account} />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} IGO Nursery. {t('footer.rights')}</span>
        <span>{t('footer.builtFor')}</span>
      </div>
    </footer>
  );
}

export default Footer;
