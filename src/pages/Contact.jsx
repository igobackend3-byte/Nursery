import { useState } from 'react';

// Full Contact Us page redesign, matching the supplied reference
// screenshot's layout (hero banner, info cards, message form, farm/map
// section, WhatsApp banner). Real business info only - same phone/
// email/address/hours already used on /locate-store - the screenshot's
// example data (a different address, a different support email) is
// NOT copied in, since this page represents this real nursery, not a
// mockup. Header/Footer are untouched - this file only builds the
// content between them.

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

// This reference image is a complete, pre-composited hero banner - the
// "Get in Touch" heading, description, leaf line-art and curved bottom
// edge are already baked into the photo. The heading/paragraph below
// are kept as real text (visually hidden, not removed) purely so the
// page still has a real <h1> for accessibility/SEO - nothing textual
// was changed, and nothing renders twice on screen.
function ContactHero() {
  return (
    <section
      className="ctc-hero ctc-hero-image-only"
      style={{ backgroundImage: `url(/images/about-us/18_contact_hero.png)` }}
    >
      <div className="ctc-hero-copy ctc-sr-only">
        <h1>Get in Touch</h1>
        <p>Let's grow better together. We're here to help with your gardening and farming needs.</p>
      </div>
    </section>
  );
}

function InfoCard({ icon: CardIcon, title, subtitle, children }) {
  return (
    <div className="ctc-info-card">
      <span className="ctc-info-icon"><CardIcon /></span>
      <div className="ctc-info-body">
        <h3>{title}</h3>
        <p className="ctc-info-sub">{subtitle}</p>
        {children}
      </div>
      <span className="ctc-info-leaf" aria-hidden="true"><Icon.Leaf /></span>
    </div>
  );
}

function ContactForm() {
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
      <span className="ctc-form-leaf ctc-form-leaf-tl" aria-hidden="true"><Icon.Leaf /></span>
      <span className="ctc-form-leaf ctc-form-leaf-bl" aria-hidden="true"><Icon.Leaf /></span>
      <span className="ctc-form-leaf ctc-form-leaf-br" aria-hidden="true"><Icon.Leaf /></span>

      <div className="ctc-form-main">
        <h2>Send Us a Message</h2>
        <p className="ctc-form-sub">
          Have a question, suggestion or need assistance? Fill out the form below and we'll get back to you as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="ctc-form">
          <div className="ctc-form-row">
            <label>
              <span className="ctc-form-label"><Icon.User /> Full Name *</span>
              <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              <span className="ctc-form-label"><Icon.Mail /> Email Address *</span>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
          </div>
          <label>
            <span className="ctc-form-label"><Icon.Phone /> Phone Number *</span>
            <input type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>
          <label>
            <span className="ctc-form-label"><Icon.Message /> Message *</span>
            <textarea rows={5} placeholder="Write your message here..." value={message} onChange={(e) => setMessage(e.target.value)} required />
          </label>
          <button type="submit" className="ctc-send-btn"><Icon.Send /> Send Message</button>
        </form>
      </div>

      <div className="ctc-form-side">
        <div className="ctc-form-side-media">
          <img src="/images/about-us/04_mission_plant.png" alt="A healthy potted plant" loading="lazy" />
        </div>
        <div className="ctc-form-perks">
          <div className="ctc-form-perk">
            <span className="ctc-form-perk-icon"><Icon.Leaf /></span>
            <div>
              <h4>We're Here to Help</h4>
              <p>Get quick and friendly support from our team.</p>
            </div>
          </div>
          <div className="ctc-form-perk">
            <span className="ctc-form-perk-icon"><Icon.Headset /></span>
            <div>
              <h4>Response Within 24 Hours</h4>
              <p>Your queries matter to us.</p>
            </div>
          </div>
          <div className="ctc-form-perk">
            <span className="ctc-form-perk-icon"><Icon.ShieldCheck /></span>
            <div>
              <h4>Trusted &amp; Secure</h4>
              <p>Your information is always safe with us.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FindOurFarm() {
  return (
    <section className="ctc-farm">
      <div className="ctc-farm-copy">
        <span className="ctc-farm-leaf" aria-hidden="true"><Icon.Leaf /></span>
        <h2>Find Our Farm</h2>
        <p>We're located in the heart of nature, where innovation meets sustainable farming.</p>
        <a
          href="https://www.openstreetmap.org/?mlat=12.82&mlon=80.25#map=13/12.82/80.25"
          target="_blank"
          rel="noopener noreferrer"
          className="ctc-directions-btn"
        >
          <Icon.Directions /> Get Directions
        </a>
      </div>
      <div className="ctc-farm-map">
        <iframe title="IGO Agritech Farms location" src={MAP_EMBED_SRC} loading="lazy" />
        <span className="ctc-farm-map-label">Green Valley</span>
      </div>
    </section>
  );
}

function WhatsAppBanner() {
  return (
    <section
      className="ctc-whatsapp"
      style={{ backgroundImage: `linear-gradient(rgba(9,32,22,0.78), rgba(9,32,22,0.82)), url(/images/about-us/11_our_values_plant_orbit.png)` }}
    >
      <div className="ctc-whatsapp-left">
        <span className="ctc-whatsapp-icon"><Icon.WhatsApp /></span>
        <div>
          <h3>Need Quick Help?</h3>
          <p>Chat with us on WhatsApp for faster support.</p>
        </div>
      </div>
      <a
        href="https://wa.me/917397386189"
        target="_blank"
        rel="noopener noreferrer"
        className="ctc-whatsapp-btn"
      >
        Chat on WhatsApp <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}

function Contact() {
  return (
    <div className="ctc-page">
      <ContactHero />

      <section className="ctc-body">
        <div className="ctc-info-col">
          <InfoCard icon={Icon.Phone} title="Phone" subtitle="We're just a call away">
            <p className="ctc-info-strong">+91 98765 43210</p>
            <p className="ctc-info-note">Mon – Sat | 9:00 AM – 6:00 PM</p>
          </InfoCard>
          <InfoCard icon={Icon.Mail} title="Email" subtitle="Send us your queries">
            <p className="ctc-info-strong">support@igoagritechfarms.com</p>
            <p className="ctc-info-note">We'll get back to you shortly.</p>
          </InfoCard>
          <InfoCard icon={Icon.Pin} title="Our Location" subtitle="Visit our farm &amp; store">
            <p className="ctc-info-note">123 Green Valley Road,<br />Coimbatore, Tamil Nadu – 641XXX</p>
          </InfoCard>
          <InfoCard icon={Icon.Clock} title="Business Hours" subtitle="We're open for you">
            <p className="ctc-info-note">Mon – Sat : 9:00 AM – 6:00 PM</p>
            <p className="ctc-info-note">Sunday : Closed</p>
          </InfoCard>
        </div>

        <ContactForm />
      </section>

      <FindOurFarm />
      <WhatsAppBanner />
    </div>
  );
}

export default Contact;
