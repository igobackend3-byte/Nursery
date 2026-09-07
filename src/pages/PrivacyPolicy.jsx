import { useLanguage } from '../context/LanguageContext';

// DRAFT: grounded only in facts already confirmed for this project (what
// the enquiry/contact forms collect, that the business hasn't specified
// any third-party data sharing). This is NOT a substitute for legal
// review - see the notice banner - since real privacy compliance
// (applicable law, retention periods, data-processor agreements) needs
// input from the business, not invented detail.
function PrivacyPolicy() {
  const { t } = useLanguage();
  return (
    <div className="policy-page">
      <div className="policy-draft-notice">{t('pages.policyDraftNotice')}</div>
      <p className="eyebrow">{t('pages.privacyEyebrow')}</p>
      <h1>{t('pages.privacyTitle')}</h1>

      <section>
        <h3>{t('pages.privacyCollectTitle')}</h3>
        <p>{t('pages.privacyCollectText')}</p>
      </section>

      <section>
        <h3>{t('pages.privacyUseTitle')}</h3>
        <p>{t('pages.privacyUseText')}</p>
      </section>

      <section>
        <h3>{t('pages.privacyContactTitle')}</h3>
        <p>{t('pages.privacyContactText')}</p>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
