import { ORDER_STATUSES } from '../lib/orders';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../i18n/translations';

// The normal (non-cancelled) lifecycle, in order - used to render the
// Order Placed -> ... -> Delivered progress timeline (see spec section 11).
const TIMELINE_STAGES = ORDER_STATUSES.filter((s) => s !== 'Cancelled');

function formatWhen(ts) {
  const date = ts?.toDate?.();
  if (!date) return null;
  return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// `order` needs `.status` and `.statusHistory` ([{status, at}]). Renders a
// vertical step tracker; if the order was cancelled, shows that instead of
// the normal progress (cancellation can happen from any stage, so it
// doesn't fit a linear "steps completed so far" model). Stage labels are
// translated via orders.statuses.* so this one component works on both the
// customer Account page and the admin Orders page - but the admin panel is
// deliberately English-only regardless of whatever language a customer
// session in the same browser last selected (localStorage is shared across
// both), so admin callers pass `locale="en"` to force that rather than
// following the shared LanguageContext.
function OrderTimeline({ order, locale }) {
  const { t: contextT } = useLanguage();
  const t = locale ? (path) => getTranslation(locale, path) : contextT;

  if (order.status === 'Cancelled') {
    const cancelledAt = order.statusHistory?.find((h) => h.status === 'Cancelled');
    return (
      <div className="order-timeline order-timeline-cancelled">
        <span className="order-timeline-cancelled-icon">✕</span>
        <div>
          <strong>{t('orders.statuses.Cancelled')}</strong>
          {formatWhen(cancelledAt?.at) && <p>{formatWhen(cancelledAt.at)}</p>}
        </div>
      </div>
    );
  }

  const currentIndex = TIMELINE_STAGES.indexOf(order.status);

  return (
    <ol className="order-timeline">
      {TIMELINE_STAGES.map((stage, i) => {
        const historyEntry = order.statusHistory?.find((h) => h.status === stage);
        const done = i <= currentIndex;
        const current = i === currentIndex;
        return (
          <li key={stage} className={`order-timeline-step${done ? ' done' : ''}${current ? ' current' : ''}`}>
            <span className="order-timeline-dot" />
            <div>
              <strong>{t(`orders.statuses.${stage}`)}</strong>
              {historyEntry && formatWhen(historyEntry.at) && <p>{formatWhen(historyEntry.at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default OrderTimeline;
