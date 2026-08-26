import { Link } from 'react-router-dom';
import { FOOTER_LINKS } from '../../data/navigation';
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
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={igoLogo} alt="IGO Nursery" className="logo-icon" />
            <span>IGO Nursery</span>
          </div>
          <p className="footer-kicker">GROW BETTER • LIVE GREENER</p>
          <p className="footer-desc">
            A modern AgriTech nursery bringing plants, seeds, planters and gardening essentials
            together in one place.
          </p>
        </div>
        <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />
        <FooterColumn title="Discover" links={FOOTER_LINKS.discover} />
        <FooterColumn title="Account" links={FOOTER_LINKS.account} />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} IGO Nursery. All rights reserved.</span>
        <span>Built for a greener everyday.</span>
      </div>
    </footer>
  );
}

export default Footer;
