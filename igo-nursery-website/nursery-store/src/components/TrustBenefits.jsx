import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSiteContent } from '../hooks/useSiteContent';
import CardHoverControls from '../admin/editor/CardHoverControls';
import './TrustBenefits.css';

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="trust-icon">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const SproutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="trust-icon">
    <path d="M12 22V12" />
    <path d="M12 12C12 7 8 5 4 5c0 5 3 7 8 7Z" />
    <path d="M12 12c0-5 4-7 8-7 0 5-3 7-8 7Z" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="trust-icon">
    <rect x="1" y="6" width="14" height="11" rx="1" />
    <path d="M15 9h4l3 4v4h-7z" />
    <circle cx="6" cy="19" r="2" />
    <circle cx="17.5" cy="19" r="2" />
  </svg>
);

const HeadsetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="trust-icon">
    <path d="M3 14v-3c0-5 4-9 9-9s9 4 9 9v3" />
    <path d="M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2z" />
    <path d="M20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2z" />
  </svg>
);

const BENEFIT_ICONS = {
  shield: <ShieldIcon />,
  sprout: <SproutIcon />,
  truck: <TruckIcon />,
  headset: <HeadsetIcon />,
};

const DEFAULT_BENEFITS = [
  { id: 1, icon: 'shield', title: 'Quality Assured', description: 'Every time you order', visible: true, order: 1 },
  { id: 2, icon: 'sprout', title: 'Grown with Care', description: 'By our expert team', visible: true, order: 2 },
  { id: 3, icon: 'truck', title: 'Safe & Secure Delivery', description: 'Right to your doorstep', visible: true, order: 3 },
  { id: 4, icon: 'headset', title: "We're Here for You", description: 'Before & after purchase', visible: true, order: 4 },
];

function TrustBenefits() {
  const [ref, visible] = useScrollReveal(0.2);
  const { trustBenefits: tb } = useSiteContent();

  if (tb && tb.visible === false) return null;

  const items = (tb?.items?.length ? tb.items : DEFAULT_BENEFITS)
    .filter((b) => b.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (items.length === 0) return null;

  // Real, admin-editable benefits vs. the built-in DEFAULT_BENEFITS
  // fallback used when the admin has emptied tb.items - hover controls
  // need the index into the section's actual `items` array (same
  // rawCards/rawItems pattern used on every other card section).
  const rawItems = tb?.items?.length ? tb.items : null;

  return (
    <section ref={ref} className={`trust-benefits${visible ? ' trust-benefits-visible' : ''}`}>
      <div className="trust-benefits-container">
        {items.map((b, i) => {
          const itemIndex = rawItems ? rawItems.findIndex((it) => (it.id ?? it.title) === (b.id ?? b.title)) : -1;
          const benefitEl = (
            <div className="trust-benefit" key={b.id ?? b.title} style={{ transitionDelay: visible ? `${i * 90}ms` : '0ms' }}>
              <span className="trust-benefit-icon">{BENEFIT_ICONS[b.icon] || <ShieldIcon />}</span>
              <div className="trust-benefit-copy">
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </div>
            </div>
          );
          if (itemIndex === -1) return benefitEl;
          return (
            <CardHoverControls key={b.id ?? b.title} sectionKey="trustBenefits" arrayField="items" index={itemIndex} itemLabel="Benefit">
              {benefitEl}
            </CardHoverControls>
          );
        })}
      </div>
    </section>
  );
}

export default TrustBenefits;
