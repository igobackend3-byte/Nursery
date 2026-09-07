import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Simple line-icons matching the site's existing icon language (see
// SproutIcon/GiftIcon etc. in Home.jsx) - no icon library, no stock art.
function VisionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MissionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" />
    </svg>
  );
}

function VarietyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" /><path d="M12 12C12 7 8 5 4 5c0 5 3 7 8 7Z" /><path d="M12 12c0-5 4-7 8-7 0 5-3 7-8 7Z" />
    </svg>
  );
}

function ExpertIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="14" height="11" rx="1" /><path d="M15 9h4l3 4v4h-7z" />
      <circle cx="6" cy="19" r="2" /><circle cx="17.5" cy="19" r="2" />
    </svg>
  );
}

// Founder's initials, used for a simple avatar badge - no photo is
// available yet (see the request for real founder photos). Skips common
// titles (Dr, Mr, Mrs, Ms, Prof) so "Dr John Yesudhas" reads as "JY".
const NAME_TITLES = new Set(['dr', 'dr.', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.', 'prof', 'prof.']);
function initials(name) {
  const words = name.split(' ').filter((w) => !NAME_TITLES.has(w.toLowerCase()));
  return words.map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function About() {
  const { t } = useLanguage();
  const founderName = t('pages.founderName');

  return (
    <div className="about-page">
      <div className="about-hero">
        <p className="eyebrow">{t('pages.ourStory')}</p>
        <h1>{t('home.whyIgoHeading')}</h1>
        <span className="about-est-badge">{t('pages.establishedLabel')} 2025</span>
        <p className="about-intro">{t('pages.aboutStory')}</p>
      </div>

      <div className="about-founder">
        <div className="about-founder-avatar" aria-hidden="true">{initials(founderName)}</div>
        <div>
          <h3>{t('pages.founderLabel')}</h3>
          <p className="about-founder-name">{founderName}</p>
        </div>
      </div>

      <div className="about-mission-grid">
        <div className="about-mission-card">
          <span className="about-mission-icon"><VisionIcon /></span>
          <h3>{t('pages.visionLabel')}</h3>
          <p>{t('pages.visionText')}</p>
        </div>
        <div className="about-mission-card">
          <span className="about-mission-icon"><MissionIcon /></span>
          <h3>{t('pages.missionLabel')}</h3>
          <p>{t('pages.missionText')}</p>
        </div>
      </div>

      <div className="about-different">
        <h2>{t('pages.differentTitle')}</h2>
        <div className="about-different-grid">
          <div className="about-different-card">
            <span className="about-different-icon"><VarietyIcon /></span>
            <h3>{t('pages.differentVarietyTitle')}</h3>
            <p>{t('pages.differentVarietyText')}</p>
          </div>
          <div className="about-different-card">
            <span className="about-different-icon"><ExpertIcon /></span>
            <h3>{t('pages.differentExpertTitle')}</h3>
            <p>{t('pages.differentExpertText')}</p>
          </div>
          <div className="about-different-card">
            <span className="about-different-icon"><DeliveryIcon /></span>
            <h3>{t('pages.differentDeliveryTitle')}</h3>
            <p>{t('pages.differentDeliveryText')}</p>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <Link to="/category/indoor-plants" className="btn-build-garden">{t('pages.aboutCta')}</Link>
      </div>
    </div>
  );
}

export default About;
