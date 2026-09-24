import { useLanguage } from '../context/LanguageContext';

// DRAFT: grounded only in the confirmed business policies (replacement/
// no-refund, COD coverage, shipping) - see the notice banner. Needs legal
// review before publishing, same as PrivacyPolicy.jsx.
function Terms() {
  const { t } = useLanguage();
  return (
    <div className="policy-page">
      <div className="policy-draft-notice">{t('pages.policyDraftNotice')}</div>
      <p className="eyebrow">{t('pages.termsEyebrow')}</p>
      <h1>{t('pages.termsTitle')}</h1>

      <section>
        <h3>{t('pages.termsOrdersTitle')}</h3>
        <p>{t('pages.termsOrdersText')}</p>
      </section>

      <section>
        <h3>{t('pages.termsReplacementTitle')}</h3>
        <p>{t('pages.termsReplacementText')}</p>
      </section>

      <section>
        <h3>{t('pages.termsPaymentTitle')}</h3>
        <p>{t('pages.termsPaymentText')}</p>
      </section>
    </div>
  );
}

export default Terms;
