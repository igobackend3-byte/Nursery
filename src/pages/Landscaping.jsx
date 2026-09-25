import { useLanguage } from '../context/LanguageContext';
import { getLandscapingServiceTranslation } from '../i18n/translations';
import { useSiteContent } from '../hooks/useSiteContent';
import EditableSection from '../admin/editor/EditableSection';
import EditableElement from '../admin/editor/EditableElement';
import CardHoverControls from '../admin/editor/CardHoverControls';

function Landscaping() {
  const { landscaping: content } = useSiteContent();
  const { t, language } = useLanguage();

  if (!content || content.visible === false) return null;

  const badgeText = content.badgeText || t('pages.beyondProducts');
  const heading = content.heading || t('pages.landscapingTitle');
  const description = content.description || t('pages.landscapingTagline');
  const cta = content.cta || {};

  const items = (content.items || [])
    .map((s, i) => ({ visible: true, order: i, ...s }))
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const rawItems = content.items || [];

  return (
    <EditableSection sectionKey="landscaping" label="Landscaping Page">
      <div className="garden-services-page">
        <EditableElement sectionKey="landscaping" field="badgeText" type="text" label="Badge Text">
          <p className="eyebrow">{badgeText}</p>
        </EditableElement>
        
        <EditableElement sectionKey="landscaping" field="heading" type="text" label="Heading">
          <h1>{heading}</h1>
        </EditableElement>
        
        <EditableElement sectionKey="landscaping" field="description" type="text" label="Description">
          <p className="category-tagline">
            {description}
          </p>
        </EditableElement>

        <div className="services-grid large landscaping-grid">
          {items.map((service) => {
            const tr = getLandscapingServiceTranslation(service.title, language);
            const itemIndex = rawItems.findIndex((it) => (it.id ?? it.title) === (service.id ?? service.title));
            
            const cardEl = (
              <div className={`service-card static compact ${service.image ? 'has-image' : ''}`} key={service.id ?? service.title}>
                {service.image ? (
                  <img src={service.image} alt={tr?.title ?? service.title} loading="lazy" />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#f8f9f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '14px' }}>
                    🌱
                  </div>
                )}
                <h3>{tr?.title ?? service.title}</h3>
                {service.description && <p>{tr?.desc ?? service.description}</p>}
              </div>
            );

            if (itemIndex === -1) return cardEl;
            
            return (
              <CardHoverControls key={service.id ?? service.title} sectionKey="landscaping" arrayField="items" index={itemIndex} itemLabel="Landscaping">
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
            <EditableElement sectionKey="landscaping" field="ctaLabel" type="text" label="CTA Label">
              <p className="eyebrow light">{cta.label || t('pages.getStarted')}</p>
            </EditableElement>
            
            <EditableElement sectionKey="landscaping" field="ctaHeading" type="text" label="CTA Heading">
              <h2>{cta.heading || t('pages.tellUsAboutSpace')}</h2>
            </EditableElement>
            
            <EditableElement sectionKey="landscaping" field="ctaDescription" type="text" label="CTA Description">
              <p>{cta.description || t('pages.tellUsDesc')}</p>
            </EditableElement>
          </div>
          
          <EditableElement sectionKey="landscaping" field="ctaButtonText" type="text" label="CTA Button">
            <a href={cta.buttonLink || "mailto:ceojohnyesudas@gmail.com"} className="btn-find-plant">
              {cta.buttonText || t('pages.requestConsultation')}
            </a>
          </EditableElement>
        </div>
      </div>
    </EditableSection>
  );
}

export default Landscaping;
