import { useLanguage } from '../context/LanguageContext';
import { getGardenServiceTranslation } from '../i18n/translations';
import { useSiteContent } from '../hooks/useSiteContent';
import EditableSection from '../admin/editor/EditableSection';
import EditableElement from '../admin/editor/EditableElement';
import CardHoverControls from '../admin/editor/CardHoverControls';
import { Link } from 'react-router-dom';

function GardenServices() {
  const { gardenServices: gs } = useSiteContent();
  const { t, language } = useLanguage();

  if (!gs || gs.visible === false) return null;

  const badgeText = gs.badgeText || t('pages.beyondProducts');
  const heading = gs.heading || t('pages.gardenServicesTitle');
  const description = gs.description || t('pages.gardenServicesTagline');
  const cta = gs.cta || {};

  const items = (gs.items || [])
    .map((s, i) => ({ visible: true, order: i, ...s }))
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const rawItems = gs.items || [];

  return (
    <EditableSection sectionKey="gardenServices" label="Garden Services Page">
      <div className="garden-services-page">
        <EditableElement sectionKey="gardenServices" field="badgeText" type="text" label="Badge Text">
          <p className="eyebrow">{badgeText}</p>
        </EditableElement>
        
        <EditableElement sectionKey="gardenServices" field="heading" type="text" label="Heading">
          <h1>{heading}</h1>
        </EditableElement>
        
        <EditableElement sectionKey="gardenServices" field="description" type="text" label="Description">
          <p className="category-tagline">{description}</p>
        </EditableElement>

        <div className="services-grid large">
          {items.map((service) => {
            const tr = getGardenServiceTranslation(service.title, language);
            const itemIndex = rawItems.findIndex((it) => (it.id ?? it.title) === (service.id ?? service.title));
            
            const cardEl = (
              <div className={`service-card static ${service.image ? 'has-image' : ''}`} key={service.id ?? service.title}>
                {service.image && <img src={service.image} alt={tr?.title ?? service.title} loading="lazy" />}
                <h3>{tr?.title ?? service.title}</h3>
                <p>{tr?.desc ?? service.description}</p>
                <span>{service.buttonText || t('pages.learnMore')}</span>
              </div>
            );

            if (itemIndex === -1) return cardEl;
            
            return (
              <CardHoverControls key={service.id ?? service.title} sectionKey="gardenServices" arrayField="items" index={itemIndex} itemLabel="Service">
                {cardEl}
              </CardHoverControls>
            );
          })}
        </div>

        <div 
          className="plant-finder-band" 
          style={{ 
            backgroundImage: cta.backgroundImage ? `url('${cta.backgroundImage}')` : undefined,
            backgroundColor: cta.backgroundColor || undefined
          }}
        >
          <div>
            <EditableElement sectionKey="gardenServices" field="ctaLabel" type="text" label="CTA Label">
              <p className="eyebrow light">{cta.label || t('pages.getStarted')}</p>
            </EditableElement>
            
            <EditableElement sectionKey="gardenServices" field="ctaHeading" type="text" label="CTA Heading">
              <h2>{cta.heading || t('pages.tellUsAboutSpace')}</h2>
            </EditableElement>
            
            <EditableElement sectionKey="gardenServices" field="ctaDescription" type="text" label="CTA Description">
              <p>{cta.description || t('pages.tellUsDesc')}</p>
            </EditableElement>
          </div>
          
          <EditableElement sectionKey="gardenServices" field="ctaButtonText" type="text" label="CTA Button">
            <a href={cta.buttonLink || "mailto:ceojohnyesudas@gmail.com"} className="btn-find-plant">
              {cta.buttonText || t('pages.requestConsultation')}
            </a>
          </EditableElement>
        </div>
      </div>
    </EditableSection>
  );
}

export default GardenServices;
