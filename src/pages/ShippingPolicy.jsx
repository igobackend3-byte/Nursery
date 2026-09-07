import { useLanguage } from '../context/LanguageContext';

// Every fact on this page comes directly from the business's own answers
// (delivery radius, charges, replacement window, COD coverage) - nothing
// invented.
function ShippingPolicy() {
  const { t } = useLanguage();
  return (
    <div className="policy-page">
      <p className="eyebrow">{t('pages.shippingEyebrow')}</p>
      <h1>{t('pages.shippingTitle')}</h1>

      <section>
        <h3>{t('pages.shippingCoverageTitle')}</h3>
        <p>{t('pages.shippingCoverageText')}</p>
      </section>

      <section>
        <h3>{t('pages.shippingChargesTitle')}</h3>
        <p>{t('pages.shippingChargesText')}</p>
      </section>

      <section>
        <h3>{t('pages.shippingCodTitle')}</h3>
        <p>{t('pages.shippingCodText')}</p>
      </section>

      <section>
        <h3>{t('pages.shippingReplacementTitle')}</h3>
        <p>{t('pages.shippingReplacementText')}</p>
      </section>
    </div>
  );
}

export default ShippingPolicy;
