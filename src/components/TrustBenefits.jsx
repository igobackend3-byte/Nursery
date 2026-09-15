import { useScrollReveal } from '../hooks/useScrollReveal';
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

const BENEFITS = [
  { icon: <ShieldIcon />, title: 'Quality Assured', subtitle: 'Every time you order' },
  { icon: <SproutIcon />, title: 'Grown with Care', subtitle: 'By our expert team' },
  { icon: <TruckIcon />, title: 'Safe & Secure Delivery', subtitle: 'Right to your doorstep' },
  { icon: <HeadsetIcon />, title: "We're Here for You", subtitle: 'Before & after purchase' },
];

function TrustBenefits() {
  const [ref, visible] = useScrollReveal(0.2);

  return (
    <section ref={ref} className={`trust-benefits${visible ? ' trust-benefits-visible' : ''}`}>
      <div className="trust-benefits-container">
        {BENEFITS.map((b, i) => (
          <div className="trust-benefit" key={b.title} style={{ transitionDelay: visible ? `${i * 90}ms` : '0ms' }}>
            <span className="trust-benefit-icon">{b.icon}</span>
            <div className="trust-benefit-copy">
              <h3>{b.title}</h3>
              <p>{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustBenefits;
