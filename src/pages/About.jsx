import { useLanguage } from '../context/LanguageContext';

function About() {
  const { t } = useLanguage();
  return (
    <div className="about-page">
      <p className="eyebrow">{t('pages.ourStory')}</p>
      <h1>{t('home.whyIgoHeading')}</h1>
      <p className="category-tagline">
        IGO Nursery started as a small AgriTech lab in Muttukadu, testing how IoT monitoring and
        precision trials could grow healthier plants at scale. Today every plant that reaches your
        door has passed through that same lab before it ever reaches the catalogue.
      </p>
    </div>
  );
}

export default About;
