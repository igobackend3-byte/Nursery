import { useLanguage } from '../context/LanguageContext';

function About() {
  const { t } = useLanguage();
  return (
    <div className="about-page">
      <p className="eyebrow">{t('pages.ourStory')}</p>
      <h1>{t('home.whyIgoHeading')}</h1>
      <p className="category-tagline">
        {t('pages.aboutStory')}
      </p>

      <div className="about-founder">
        <h3>{t('pages.founderLabel')}</h3>
        <p>{t('pages.founderName')}</p>
        <p className="about-established">{t('pages.establishedLabel')}: 2025</p>
      </div>

      <div className="about-mission-grid">
        <div>
          <h3>{t('pages.visionLabel')}</h3>
          <p>{t('pages.visionText')}</p>
        </div>
        <div>
          <h3>{t('pages.missionLabel')}</h3>
          <p>{t('pages.missionText')}</p>
        </div>
      </div>
    </div>
  );
}

export default About;
