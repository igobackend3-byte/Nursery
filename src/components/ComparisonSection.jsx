import React from 'react';
import './ComparisonSection.css';

// --- Icons ---
const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-icon">
    <path d="M12 22c0-5 8-8 8-14 0-2.5-2-4-5-4-3 0-6 2.5-6 6M12 22c0-5-8-8-8-14 0-2.5 2-4 5-4 3 0 6 2.5 6 6" />
    <path d="M12 22V10" />
  </svg>
);

const PestIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-icon">
    <path d="M12 4v4m0 8v4M4 12h4m8 0h4m-12.8 5.7L8 16m8-8l2.8-2.8m0 11.3L16 13.5M8 7.5L5.2 4.7" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const RepotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-icon">
    <path d="M6 8h12l-1.5 10H7.5L6 8Z" />
    <path d="M5 5h14v3H5z" />
    <path d="M12 2v3" />
  </svg>
);

const SoilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-icon">
    <path d="M2 20h20M7 20v-4a5 5 0 0 1 10 0v4M12 16v-4" />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    <circle cx="8" cy="10" r="1" fill="currentColor" />
    <circle cx="16" cy="10" r="1" fill="currentColor" />
  </svg>
);

const GrowingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-icon">
    <path d="M12 18V8" />
    <path d="M12 8c0 4 3 6 7 6 0-4-2-6-7-6Z" />
    <path d="M12 10c0 3-2.5 5-6 5 0-3 2-5 6-5Z" />
    <path d="M4 22h16" />
  </svg>
);

const HealthIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-icon">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.9 7.9 7.9-7.9 1-1a5.5 5.5 0 0 0 0-7.8z" />
    <path d="M12 8v4m-2-2h4" />
  </svg>
);

const PackagingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-icon">
    <path d="M21 8l-9 5-9-5 9-5 9 5Z" />
    <path d="M21 8v8l-9 5-9-5V8" />
    <path d="M12 13v10" />
  </svg>
);

const SupportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-icon">
    <path d="M3 14v-3c0-5 4-9 9-9s9 4 9 9v3" />
    <path d="M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2z" />
    <path d="M20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2z" />
    <path d="M12 21v-4" />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// --- Data ---
const FEATURES = [
  { label: 'Plant Quality', icon: <LeafIcon /> },
  { label: 'Pest Control', icon: <PestIcon /> },
  { label: 'Repotting', icon: <RepotIcon /> },
  { label: 'Soil Quality', icon: <SoilIcon /> },
  { label: 'Growing Conditions', icon: <GrowingIcon /> },
  { label: 'Plant Health', icon: <HealthIcon /> },
  { label: 'Packaging', icon: <PackagingIcon /> },
  { label: 'Customer Support', icon: <SupportIcon /> },
];

const LOCAL_NURSERIES = [
  'Inconsistent, no quality checks',
  'Pest issues common',
  'Often needs immediate repotting',
  'Standard, unlabelled soil',
  'Sourcing and origin unclear',
  'No health guarantee',
  'Basic, prone to damage in transit',
  'In-person only, no follow-up',
];

const IGO_NURSERY = [
  { text: 'Every plant checked before it ships', bold: 'checked' },
  { text: 'Pest-free before it leaves our nursery', bold: 'Pest-free' },
  { text: 'Ships repot-ready in the right container', bold: 'repot-ready' },
  { text: 'Right soil mix for each plant type', bold: 'Right soil mix' },
  { text: 'Grown and hardened in our own nursery', bold: 'hardened' },
  { text: 'Healthy on arrival, or we make it right', bold: 'Healthy' },
  { text: 'Secure, moisture-safe packaging', bold: 'moisture-safe' },
  { text: 'Real plant-care guidance after purchase', bold: 'plant-care guidance' },
];

const OTHERS_ONLINE = [
  'Quality varies by seller',
  'Rarely guaranteed',
  'Depends on how it was packed',
  'Generic, one-size-fits-all soil',
  'Sourced from multiple third parties',
  'Limited or unclear guarantee',
  'Standard courier packaging',
  'Email or chat only',
];

// Helper to bold specific words inline
const highlightText = (textObj) => {
  if (!textObj.bold) return textObj.text;
  const parts = textObj.text.split(new RegExp(`(${textObj.bold})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === textObj.bold.toLowerCase() ? (
          <strong key={i}>{part}</strong>
        ) : (
          part
        )
      )}
    </>
  );
};

export default function ComparisonSection() {
  return (
    <section className="comparison-section">
      {/* Background container */}
      <div className="comparison-bg-layer" aria-hidden="true" />
      
      <div className="comparison-container">
        {/* Header Area */}
        <div className="comparison-header-area">
          <div className="comp-eyebrow-wrapper">
            <span className="comp-eyebrow-line"></span>
            <span className="comp-eyebrow">
              <LeafIcon /> WHY CHOOSE US
            </span>
            <span className="comp-eyebrow-line"></span>
          </div>
          <h2 className="comp-title">
            How we compare to <em className="comp-highlight">buying plants</em> elsewhere.
          </h2>
          <p className="comp-subtitle">Better quality. Fresher plants. A healthier tomorrow.</p>
        </div>

        {/* Table Layout */}
        <div className="comparison-table">
          
          {/* Column 1: Features */}
          <div className="comp-col comp-col-features">
            <div className="comp-col-header comp-empty-header"></div>
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="comp-cell comp-feature-cell">
                <span className="comp-feature-icon-wrapper">
                  {feature.icon}
                </span>
                <span className="comp-feature-label">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Column 2: Local Nurseries */}
          <div className="comp-col comp-col-local">
            <div className="comp-col-header comp-local-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-header-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Local Nurseries</span>
            </div>
            {LOCAL_NURSERIES.map((text, idx) => (
              <div key={idx} className="comp-cell comp-value-cell">
                <span className="comp-status-icon comp-cross">
                  <CrossIcon />
                </span>
                <span className="comp-value-text">{text}</span>
              </div>
            ))}
          </div>

          {/* Column 3: IGO Nursery (BEST CHOICE) */}
          <div className="comp-col comp-col-igo">
            <div className="comp-best-choice-badge">
              <CheckIcon /> BEST CHOICE <CheckIcon />
            </div>
            <div className="comp-col-header comp-igo-header">
              <div className="comp-igo-header-content">
                <LeafIcon />
                <div>
                  <span className="comp-igo-title">IGO NURSERY</span>
                  <span className="comp-igo-subtitle">Healthy plants. Happier homes.</span>
                </div>
              </div>
              <img src="/images/home-corners/living-room.jpg" alt="" className="comp-igo-header-bg" />
              <div className="comp-igo-header-overlay" />
            </div>
            {IGO_NURSERY.map((item, idx) => (
              <div key={idx} className="comp-cell comp-value-cell comp-igo-cell">
                <span className="comp-status-icon comp-check">
                  <CheckIcon />
                </span>
                <span className="comp-value-text">{highlightText(item)}</span>
              </div>
            ))}
          </div>

          {/* Column 4: Others (Online) */}
          <div className="comp-col comp-col-others">
            <div className="comp-col-header comp-others-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-header-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Others (Online)</span>
            </div>
            {OTHERS_ONLINE.map((text, idx) => (
              <div key={idx} className="comp-cell comp-value-cell">
                <span className="comp-status-icon comp-minus">
                  <MinusIcon />
                </span>
                <span className="comp-value-text">{text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
