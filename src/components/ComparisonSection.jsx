import React from 'react';
import { useSiteContent } from '../hooks/useSiteContent';
import EditableElement from '../admin/editor/EditableElement';
import CardHoverControls from '../admin/editor/CardHoverControls';
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
const ROW_ICONS = {
  leaf: <LeafIcon />,
  pest: <PestIcon />,
  repot: <RepotIcon />,
  soil: <SoilIcon />,
  growing: <GrowingIcon />,
  health: <HealthIcon />,
  packaging: <PackagingIcon />,
  support: <SupportIcon />,
};

const DEFAULT_ROWS = [
  { id: 1, icon: 'leaf', criterion: 'Plant Quality', local: 'Inconsistent, no quality checks', igo: 'Every plant checked before it ships', igoHighlight: 'checked', others: 'Quality varies by seller', visible: true, order: 1 },
  { id: 2, icon: 'pest', criterion: 'Pest Control', local: 'Pest issues common', igo: 'Pest-free before it leaves our nursery', igoHighlight: 'Pest-free', others: 'Rarely guaranteed', visible: true, order: 2 },
  { id: 3, icon: 'repot', criterion: 'Repotting', local: 'Often needs immediate repotting', igo: 'Ships repot-ready in the right container', igoHighlight: 'repot-ready', others: 'Depends on how it was packed', visible: true, order: 3 },
  { id: 4, icon: 'soil', criterion: 'Soil Quality', local: 'Standard, unlabelled soil', igo: 'Right soil mix for each plant type', igoHighlight: 'Right soil mix', others: 'Generic, one-size-fits-all soil', visible: true, order: 4 },
  { id: 5, icon: 'growing', criterion: 'Growing Conditions', local: 'Sourcing and origin unclear', igo: 'Grown and hardened in our own nursery', igoHighlight: 'hardened', others: 'Sourced from multiple third parties', visible: true, order: 5 },
  { id: 6, icon: 'health', criterion: 'Plant Health', local: 'No health guarantee', igo: 'Healthy on arrival, or we make it right', igoHighlight: 'Healthy', others: 'Limited or unclear guarantee', visible: true, order: 6 },
  { id: 7, icon: 'packaging', criterion: 'Packaging', local: 'Basic, prone to damage in transit', igo: 'Secure, moisture-safe packaging', igoHighlight: 'moisture-safe', others: 'Standard courier packaging', visible: true, order: 7 },
  { id: 8, icon: 'support', criterion: 'Customer Support', local: 'In-person only, no follow-up', igo: 'Real plant-care guidance after purchase', igoHighlight: 'plant-care guidance', others: 'Email or chat only', visible: true, order: 8 },
];

// Bolds a specific word/phrase inline within a row's IGO-column text.
const highlightText = (text, bold) => {
  if (!bold) return text;
  const parts = text.split(new RegExp(`(${bold.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === bold.toLowerCase() ? (
          <strong key={i}>{part}</strong>
        ) : (
          part
        )
      )}
    </>
  );
};

export default function ComparisonSection() {
  const { comparisonSection: cs } = useSiteContent();

  if (cs && cs.visible === false) return null;

  const eyebrow = cs?.eyebrow || 'WHY CHOOSE US';
  const heading = cs?.heading || 'How we compare to buying plants elsewhere.';
  const headingHighlight = cs?.headingHighlight || 'buying plants';
  const subtitle = cs?.subtitle || 'Better quality. Fresher plants. A healthier tomorrow.';
  const localTitle = cs?.localTitle || 'Local Nurseries';
  const othersTitle = cs?.othersTitle || 'Others (Online)';
  const igoTitle = cs?.igoTitle || 'IGO NURSERY';
  const igoSubtitle = cs?.igoSubtitle || 'Healthy plants. Happier homes.';
  const igoHeaderImage = cs?.igoHeaderImage || '/images/home-corners/living-room.jpg';
  const badgeEnabled = cs?.badgeEnabled !== false;
  const badgeText = cs?.badgeText || 'BEST CHOICE';
  const rows = (cs?.rows?.length ? cs.rows : DEFAULT_ROWS)
    .filter((r) => r.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Heading may not literally contain headingHighlight (an admin could
  // rewrite either independently) - fall back to showing the plain heading
  // rather than silently dropping the highlighted phrase.
  const headingParts = headingHighlight && heading.includes(headingHighlight)
    ? heading.split(headingHighlight)
    : null;

  const bgStyle = cs?.backgroundImage ? { backgroundImage: `url(${cs.backgroundImage})` } : undefined;

  // Real, admin-editable rows vs. the built-in DEFAULT_ROWS fallback used
  // when the admin has emptied cs.rows - hover controls need the index
  // into the section's actual `rows` array (same rawCards/rawItems pattern
  // used on every other card section), not the filtered/sorted local copy.
  const rawRows = cs?.rows?.length ? cs.rows : null;

  return (
    <section className="comparison-section">
      {/* Background container */}
      <div className="comparison-bg-layer" style={bgStyle} aria-hidden="true" />

      <div className="comparison-container">
        {/* Header Area */}
        <div className="comparison-header-area">
          <div className="comp-eyebrow-wrapper">
            <span className="comp-eyebrow-line"></span>
            <span className="comp-eyebrow">
              <LeafIcon />{' '}
              <EditableElement sectionKey="comparisonSection" field="eyebrow" type="text" label="Section Label">
                <span>{eyebrow}</span>
              </EditableElement>
            </span>
            <span className="comp-eyebrow-line"></span>
          </div>
          <EditableElement
            sectionKey="comparisonSection"
            field="__heading__"
            type="text_fields"
            label="Heading"
            hideDelete
            fields={[
              { field: 'heading', label: 'Heading' },
              { field: 'headingHighlight', label: 'Highlighted Text' },
            ]}
          >
            <h2 className="comp-title">
              {headingParts ? <>{headingParts[0]}<em className="comp-highlight">{headingHighlight}</em>{headingParts[1]}</> : heading}
            </h2>
          </EditableElement>
          <EditableElement sectionKey="comparisonSection" field="subtitle" type="text" label="Subtitle">
            <p className="comp-subtitle">{subtitle}</p>
          </EditableElement>
        </div>

        {/* Table Layout */}
        <div className="comparison-table">

          {/* Column 1: Features */}
          <div className="comp-col comp-col-features">
            <div className="comp-col-header comp-empty-header"></div>
            {rows.map((row) => {
              const rowIndex = rawRows ? rawRows.findIndex((r) => r.id === row.id) : -1;
              const cellEl = (
                <div className="comp-cell comp-feature-cell">
                  <span className="comp-feature-icon-wrapper">
                    {ROW_ICONS[row.icon] || <LeafIcon />}
                  </span>
                  <span className="comp-feature-label">{row.criterion}</span>
                </div>
              );
              if (rowIndex === -1) return <React.Fragment key={row.id}>{cellEl}</React.Fragment>;
              return (
                <CardHoverControls key={row.id} sectionKey="comparisonSection" arrayField="rows" index={rowIndex} itemLabel="Row">
                  {cellEl}
                </CardHoverControls>
              );
            })}
          </div>

          {/* Column 2: Local Nurseries */}
          <div className="comp-col comp-col-local">
            <div className="comp-col-header comp-local-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="comp-header-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <EditableElement sectionKey="comparisonSection" field="localTitle" type="text" label="Local Nurseries Column Title">
                <span>{localTitle}</span>
              </EditableElement>
            </div>
            {rows.map((row) => (
              <div key={row.id} className="comp-cell comp-value-cell">
                <span className="comp-status-icon comp-cross">
                  <CrossIcon />
                </span>
                <span className="comp-value-text">{row.local}</span>
              </div>
            ))}
          </div>

          {/* Column 3: IGO Nursery (BEST CHOICE) */}
          <div className="comp-col comp-col-igo">
            {badgeEnabled && (
              <div className="comp-best-choice-badge">
                <CheckIcon />{' '}
                <EditableElement sectionKey="comparisonSection" field="badgeText" type="text" label="Badge Text">
                  <span>{badgeText}</span>
                </EditableElement>{' '}
                <CheckIcon />
              </div>
            )}
            <div className="comp-col-header comp-igo-header">
              <div className="comp-igo-header-content">
                <LeafIcon />
                <EditableElement
                  sectionKey="comparisonSection"
                  field="__igoHeader__"
                  type="text_fields"
                  label="IGO Column Title"
                  hideDelete
                  fields={[
                    { field: 'igoTitle', label: 'Title' },
                    { field: 'igoSubtitle', label: 'Subtitle' },
                  ]}
                >
                  <div>
                    <span className="comp-igo-title">{igoTitle}</span>
                    <span className="comp-igo-subtitle">{igoSubtitle}</span>
                  </div>
                </EditableElement>
              </div>
              <EditableElement sectionKey="comparisonSection" field="igoHeaderImage" type="image" label="IGO Header Image" fill>
                <img src={igoHeaderImage} alt="" className="comp-igo-header-bg" />
              </EditableElement>
              <div className="comp-igo-header-overlay" />
            </div>
            {rows.map((row) => (
              <div key={row.id} className="comp-cell comp-value-cell comp-igo-cell">
                <span className="comp-status-icon comp-check">
                  <CheckIcon />
                </span>
                <span className="comp-value-text">{highlightText(row.igo, row.igoHighlight)}</span>
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
              <EditableElement sectionKey="comparisonSection" field="othersTitle" type="text" label="Others (Online) Column Title">
                <span>{othersTitle}</span>
              </EditableElement>
            </div>
            {rows.map((row) => (
              <div key={row.id} className="comp-cell comp-value-cell">
                <span className="comp-status-icon comp-minus">
                  <MinusIcon />
                </span>
                <span className="comp-value-text">{row.others}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
