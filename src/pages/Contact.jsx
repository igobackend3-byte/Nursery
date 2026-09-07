import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Same real business info already shown on /locate-store, plus a simple
// mailto-based enquiry form - consistent with the mailto pattern already
// used on Garden Services and Landscaping (no invented backend/API).
function Contact() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry from ${name || 'website visitor'}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:ceojohnyesudas@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="contact-page">
      <p className="eyebrow">{t('pages.contactEyebrow')}</p>
      <h1>{t('pages.contactTitle')}</h1>
      <p className="category-tagline">{t('pages.contactTagline')}</p>

      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            {t('pages.contactNameLabel')}
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            {t('pages.contactEmailLabel')}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            {t('pages.contactMessageLabel')}
            <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </label>
          <button type="submit" className="btn-find-plant">{t('pages.contactSend')}</button>
        </form>

        <div className="contact-details">
          <h3>{t('pages.contactVisitTitle')}</h3>
          <p>IGO Nursery — Muttukadu Lab &amp; Store</p>
          <p>ECR Road, Muttukadu, Chennai, Tamil Nadu 603112</p>
          <h4>{t('pages.storeHours')}</h4>
          <p>8:00 AM – 6:00 PM, {t('pages.everyDay')}</p>
          <p className="store-visits-note">{t('pages.customerVisitsWelcome')}</p>
          <h4>{t('pages.contact')}</h4>
          <p>+91 73973 86189<br />ceojohnyesudas@gmail.com</p>
          <h4>{t('pages.supportHoursLabel')}</h4>
          <p>{t('pages.support247')}</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
