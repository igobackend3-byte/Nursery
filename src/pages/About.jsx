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
    </div>
  );
}

export default About;
