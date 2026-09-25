import { useState } from 'react';
import { useSiteContent } from '../hooks/useSiteContent';
import EditableSection from '../admin/editor/EditableSection';
import EditableElement from '../admin/editor/EditableElement';
import { useVisualEditor } from '../admin/editor/VisualEditorContext';
import { DEFAULT_SITE_CONTENT } from '../data/siteContent';

// Full Contact Us page, matching the supplied reference screenshots'
// layout (hero banner, info cards, message form, trust strip, farm/map
// section, WhatsApp banner). Real business info only - same phone/
// email already used in the site footer - the screenshot's own example
// data (a different address, a different support email) is NOT copied
// in, since this page represents this real nursery, not a mockup.
// Header/Footer are untouched - this file only builds the content
// between them.

function HoverImageEditor({ sectionKey, field, label, children, className = '', style = {} }) {
  const { isEditorMode, setActiveElement, updateContent, deleteContent } = useVisualEditor();

  const handleEdit = (e) => {
    e.preventDefault();
    setActiveElement({
      sectionKey,
      type: 'image',
      field,
      label
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (window.confirm(`Reset ${label} to default?`)) {
      updateContent(sectionKey, field, DEFAULT_SITE_CONTENT[sectionKey]?.[field] || '');
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm(`Delete ${label}?`)) {
      deleteContent(sectionKey, field);
    }
  };

  if (!isEditorMode) return <>{children}</>;

  return (
    <div className={`card-hover-wrap ${className}`} style={{ ...style, position: 'relative' }}>
      {children}
      <div className="card-hover-toolbar">
        <button className="card-hover-btn" onClick={handleEdit}>Edit Image</button>
        <button className="card-hover-btn" onClick={handleReset}>Reset to Default</button>
        <button className="card-hover-btn card-hover-btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Icons
// Small original line-icons, consistent stroke style with the rest of
// the site's inline icon set - no icon library installed in this
// project, so none is added here either.
const Icon = {
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" />
    </svg>
  ),
  Pin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" /><circle cx="12" cy="9" r="3" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Leaf: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C12 22 20 18 20 12V5l-8-3-8 3v7C4 18 12 22 12 22z" /></svg>
  ),
  Directions: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" /><circle cx="12" cy="9" r="3" />
    </svg>
  ),
  WhatsApp: () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.63-.6-2.87-1.24-4.74-4.14-4.89-4.33-.14-.19-1.17-1.56-1.17-2.98s.73-2.11 1-2.4c.24-.27.53-.34.71-.34l.5.01c.16 0 .38-.06.59.45.24.57.8 1.98.87 2.13.07.14.11.32.02.5-.09.19-.13.31-.26.47-.13.16-.28.36-.4.48-.13.13-.27.28-.12.55.16.27.7 1.16 1.51 1.88 1.04.93 1.91 1.22 2.18 1.35.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.35-.22.6-.13.24.09 1.55.73 1.82.86.27.14.44.2.51.31.07.11.07.63-.17 1.31z" />
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  Message: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Headset: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
    </svg>
  ),
};

// Same coordinates already used on /locate-store - Muttukadu, Chennai.
const MAP_EMBED_SRC = 'https://www.openstreetmap.org/export/embed.html?bbox=80.22%2C12.79%2C80.28%2C12.85&layer=mapnik&marker=12.82%2C80.25';
void MAP_EMBED_SRC; // kept for reference; contactPage.farm.mapUrl (site content) is what's actually rendered

// This reference image is a complete, pre-composited hero banner - the
// "Get in Touch" heading, description, leaf line-art and curved bottom
// edge are already baked into the photo. The heading/paragraph below
// are kept as real text (visually hidden, not removed) purely so the
// page still has a real <h1> for accessibility/SEO - nothing textual
// was changed, and nothing renders twice on screen.
function ContactHero({ data }) {
  return (
    <HoverImageEditor sectionKey="contactHero" field="backgroundImage" label="Hero Background Image" style={{ display: 'block' }}>
      <section className="ctc-hero ctc-hero-image-only" style={{ backgroundImage: `url(${data.backgroundImage})` }}>
        <div className="ctc-hero-copy ctc-sr-only">
          <h1>{data.heading}</h1>
          <p>{data.description}</p>
        </div>
      </section>
    </HoverImageEditor>
  );
}

function InfoCard({ icon: CardIcon, customIcon, title, subtitle, children, cardKey, schemaFields, iconField }) {
  const { isEditorMode, setActiveElement, updateContent, deleteContent } = useVisualEditor();

  const handleEdit = (e) => {
    e.preventDefault();
    setActiveElement({
      sectionKey: 'contactInfoCards',
      type: 'text_fields',
      fields: schemaFields,
      label: `Edit ${title} Text`
    });
  };

  const handleIconEdit = (e) => {
    e.preventDefault();
    setActiveElement({
      sectionKey: 'contactInfoCards',
      type: 'image',
      field: iconField,
      label: `${title} Icon`
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm(`Delete ${title}?`)) {
      schemaFields.forEach(f => deleteContent('contactInfoCards', f.field));
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (window.confirm(`Reset ${title} to default?`)) {
      schemaFields.forEach(f => {
        updateContent('contactInfoCards', f.field, DEFAULT_SITE_CONTENT.contactInfoCards[f.field]);
      });
    }
  };

  return (
    <div className={`ctc-info-card ${isEditorMode ? 'card-hover-wrap' : ''}`}>
      <span className="ctc-info-icon">
        {customIcon ? <img src={customIcon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <CardIcon />}
      </span>
      <div className="ctc-info-body">
        <h3>{title}</h3>
        <p className="ctc-info-sub">{subtitle}</p>
        {children}
      </div>

      {isEditorMode && (
        <div className="card-hover-toolbar">
          <button className="card-hover-btn" onClick={handleEdit}>Edit Text</button>
          <button className="card-hover-btn" onClick={handleIconEdit}>Edit Image/Icon</button>
          <button className="card-hover-btn" onClick={handleReset}>Reset to Default</button>
          <button className="card-hover-btn card-hover-btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

function ContactForm({ data }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry from ${name || 'website visitor'}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}\nPhone: ${phone}`);
    window.location.href = `mailto:ceojohnyesudas@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="ctc-form-card">
      <div className="ctc-form-header-row">
        <div className="ctc-form-header-text">
          <h2>{data.heading}</h2>
          <p className="ctc-form-sub">{data.description}</p>
        </div>
        <div className="ctc-form-side-media">
          <HoverImageEditor sectionKey="contactForm" field="sideImage" label="Side Image" style={{ width: '100%', height: '100%' }}>
            <img src={data.sideImage} alt="Contact Form Side" loading="lazy" />
          </HoverImageEditor>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="ctc-form">
        <div className="ctc-form-row">
          <label>
            <span className="ctc-form-label"><Icon.User /> <span>{data.nameLabel}</span></span>
            <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            <span className="ctc-form-label"><Icon.Mail /> <span>{data.emailLabel}</span></span>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>
        <label>
          <span className="ctc-form-label"><Icon.Phone /> <span>{data.phoneLabel}</span></span>
          <input type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label>
          <span className="ctc-form-label"><Icon.Message /> <span>{data.messageLabel}</span></span>
          <textarea rows={5} placeholder="Write your message here..." value={message} onChange={(e) => setMessage(e.target.value)} required />
        </label>
        <button type="submit" className="ctc-send-btn"><Icon.Send /> <span>{data.buttonText}</span></button>
      </form>
    </div>
  );
}

function TrustInformationStrip({ data }) {
  return (
    <div className="ctc-trust-strip">
      <div className="ctc-trust-row">
        <div className="ctc-form-perk">
          <span className="ctc-form-perk-icon"><Icon.ShieldCheck /></span>
          <div>
            <h4>{data.perk1Heading}</h4>
            <p>{data.perk1Text}</p>
          </div>
        </div>
        <div className="ctc-form-perk">
          <span className="ctc-form-perk-icon"><Icon.Headset /></span>
          <div>
            <h4>{data.perk2Heading}</h4>
            <p>{data.perk2Text}</p>
          </div>
        </div>
        <div className="ctc-form-perk">
          <span className="ctc-form-perk-icon"><Icon.ShieldCheck /></span>
          <div>
            <h4>{data.perk3Heading}</h4>
            <p>{data.perk3Text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FindOurFarm({ data }) {
  return (
    <section className="ctc-farm">
      <div className="ctc-farm-copy">
        <span className="ctc-farm-leaf" aria-hidden="true"><Icon.Leaf /></span>
        <h2>{data.heading}</h2>
        <p>{data.description}</p>
        <a
          href={data.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ctc-directions-btn"
        >
          <Icon.Directions /> <span>{data.buttonText}</span>
        </a>
      </div>
      <div className="ctc-farm-map">
        <iframe title="IGO Nursery location" src={data.mapUrl} loading="lazy" />
        <span className="ctc-farm-map-label"><span>{data.mapLabel}</span></span>
      </div>
    </section>
  );
}

function WhatsAppBanner({ data }) {
  return (
    <HoverImageEditor sectionKey="contactWhatsapp" field="backgroundImage" label="WhatsApp Background Image" style={{ display: 'block' }}>
      <section
        className="ctc-whatsapp"
        style={{ backgroundImage: `linear-gradient(rgba(9,32,22,0.78), rgba(9,32,22,0.82)), url(${data.backgroundImage})` }}
      >
      <div className="ctc-whatsapp-left">
        <span className="ctc-whatsapp-icon"><Icon.WhatsApp /></span>
        <div>
          <h3>{data.heading}</h3>
          <p>{data.description}</p>
        </div>
      </div>
      <a
        href={`https://wa.me/${data.number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ctc-whatsapp-btn"
      >
        <span>{data.buttonText}</span> <span aria-hidden="true">→</span>
      </a>
    </section>
    </HoverImageEditor>
  );
}

function Contact() {
  const { contactHero, contactInfoCards, contactForm, contactTrust, contactFarm, contactWhatsapp } = useSiteContent();

  return (
    <div className="ctc-page">
      <EditableSection sectionKey="contactHero" label="Contact - Hero">
        <ContactHero data={contactHero} />
      </EditableSection>

      <section className="ctc-body">
        <EditableSection sectionKey="contactInfoCards" label="Contact - Info Cards">
          <div className="ctc-info-col">
            <InfoCard 
              icon={Icon.Phone} customIcon={contactInfoCards.phoneIcon} iconField="phoneIcon"
              title={contactInfoCards.phoneHeading} subtitle={contactInfoCards.phoneSub}
              cardKey="phone" schemaFields={[
                { field: 'phoneHeading', label: 'Heading' },
                { field: 'phoneSub', label: 'Subheading' },
                { field: 'phoneText', label: 'Phone Number' },
                { field: 'phoneHours', label: 'Hours Line' }
              ]}
            >
              <p className="ctc-info-strong">{contactInfoCards.phoneText}</p>
              <p className="ctc-info-note">{contactInfoCards.phoneHours}</p>
            </InfoCard>
            
            <InfoCard 
              icon={Icon.Mail} customIcon={contactInfoCards.emailIcon} iconField="emailIcon"
              title={contactInfoCards.emailHeading} subtitle={contactInfoCards.emailSub}
              cardKey="email" schemaFields={[
                { field: 'emailHeading', label: 'Heading' },
                { field: 'emailSub', label: 'Subheading' },
                { field: 'emailText', label: 'Email Address' },
                { field: 'emailNote', label: 'Note' }
              ]}
            >
              <p className="ctc-info-strong">{contactInfoCards.emailText}</p>
              <p className="ctc-info-note">{contactInfoCards.emailNote}</p>
            </InfoCard>
            
            <InfoCard 
              icon={Icon.Pin} customIcon={contactInfoCards.locIcon} iconField="locIcon"
              title={contactInfoCards.locHeading} subtitle={contactInfoCards.locSub}
              cardKey="location" schemaFields={[
                { field: 'locHeading', label: 'Heading' },
                { field: 'locSub', label: 'Subheading' },
                { field: 'locText', label: 'Address (HTML <br /> allowed for line breaks)' }
              ]}
            >
              <p className="ctc-info-note" dangerouslySetInnerHTML={{ __html: contactInfoCards.locText }} />
            </InfoCard>
            
            <InfoCard 
              icon={Icon.Clock} customIcon={contactInfoCards.hoursIcon} iconField="hoursIcon"
              title={contactInfoCards.hoursHeading} subtitle={contactInfoCards.hoursSub}
              cardKey="hours" schemaFields={[
                { field: 'hoursHeading', label: 'Heading' },
                { field: 'hoursSub', label: 'Subheading' },
                { field: 'hoursText1', label: 'Line 1' },
                { field: 'hoursText2', label: 'Line 2' }
              ]}
            >
              <p className="ctc-info-note">{contactInfoCards.hoursText1}</p>
              <p className="ctc-info-note">{contactInfoCards.hoursText2}</p>
            </InfoCard>
          </div>
        </EditableSection>

        <EditableSection sectionKey="contactForm" label="Contact - Message Form">
          <ContactForm data={contactForm} />
        </EditableSection>
      </section>

      <EditableSection sectionKey="contactTrust" label="Contact - Trust Strip">
        <TrustInformationStrip data={contactTrust} />
      </EditableSection>

      <EditableSection sectionKey="contactFarm" label="Contact - Find Our Farm">
        <FindOurFarm data={contactFarm} />
      </EditableSection>
      <EditableSection sectionKey="contactWhatsapp" label="Contact - WhatsApp Banner">
        <WhatsAppBanner data={contactWhatsapp} />
      </EditableSection>
    </div>
  );
}

export default Contact;
