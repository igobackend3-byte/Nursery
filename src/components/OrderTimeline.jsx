import { ORDER_STATUSES } from '../lib/orders';

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
// doesn't fit a linear "steps completed so far" model).
function OrderTimeline({ order }) {
  if (order.status === 'Cancelled') {
    const cancelledAt = order.statusHistory?.find((h) => h.status === 'Cancelled');
    return (
      <div className="order-timeline order-timeline-cancelled">
        <span className="order-timeline-cancelled-icon">✕</span>
        <div>
          <strong>Order Cancelled</strong>
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
              <strong>{stage}</strong>
              {historyEntry && formatWhen(historyEntry.at) && <p>{formatWhen(historyEntry.at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default OrderTimeline;
