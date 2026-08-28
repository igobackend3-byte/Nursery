import { useEffect, useState } from 'react';
import '../styles/indoor-plant-filters.css';
import { FILTER_ICONS, SlidersIcon, ChevronIcon, CloseIcon } from './filterIcons';

// Small visual indicator next to each color option (any category with a
// `hasSwatch` color-like group gets this, not just plants).
const COLOR_SWATCHES = {
  Green: '#3f7a4e',
  Pink: '#e79cc2',
  Red: '#c0392b',
  White: '#f5f5f0',
  Yellow: '#e8c547',
  Purple: '#8e6bb5',
  Orange: '#e08a3c',
  Multicolor: 'conic-gradient(#e79cc2, #e8c547, #3f7a4e, #8e6bb5)',
  Variegated: 'conic-gradient(#e79cc2, #e8c547, #3f7a4e, #8e6bb5)',
  Terracotta: '#c76b3f',
  Black: '#2a2a2a',
  Grey: '#9a9a9a',
  Brown: '#7a5230',
  Natural: '#c9a876',
};

// Categories collapse to this many visible options before "Show More".
const VISIBLE_OPTION_LIMIT = 7;

function fieldValues(product, key, isArray) {
  const val = product[key];
  if (val == null) return [];
  return isArray ? val : [val];
}

function buildOptionCounts(products, key, isArray) {
  const counts = new Map();
  products.forEach((p) => {
    fieldValues(p, key, isArray).forEach((val) => {
      counts.set(val, (counts.get(val) ?? 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

function toggleValue(filters, key, value) {
  const current = filters[key] ?? [];
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  return { ...filters, [key]: next };
}

export function countActiveFilters(filters, groups) {
  let n = 0;
  groups.forEach(({ key, isPrice }) => {
    if (isPrice) return;
    n += (filters[key] ?? []).length;
  });
  if (filters.priceFrom != null || filters.priceTo != null) n += 1;
  return n;
}

// Single source of truth for whether a product matches the current filter
// selection, for whichever `groups` config the current category resolved
// to (see data/filterConfig.js) - used both for the real product grid
// (CategoryPage) and for every live count inside the filter drawer.
export function matchesFilters(product, filters, groups) {
  if (filters.priceFrom != null && product.price < filters.priceFrom) return false;
  if (filters.priceTo != null && product.price > filters.priceTo) return false;
  return groups.every(({ key, isPrice, isArray }) => {
    if (isPrice) return true;
    const selected = filters[key];
    if (!selected || selected.length === 0) return true;
    const productValues = fieldValues(product, key, isArray);
    return selected.some((v) => productValues.includes(v));
  });
}

function PriceGroup({ filters, priceBounds, onApply }) {
  const [from, setFrom] = useState(filters.priceFrom ?? '');
  const [to, setTo] = useState(filters.priceTo ?? '');

  useEffect(() => {
    setFrom(filters.priceFrom ?? '');
    setTo(filters.priceTo ?? '');
  }, [filters.priceFrom, filters.priceTo]);

  function apply() {
    onApply({
      priceFrom: from === '' ? null : Number(from),
      priceTo: to === '' ? null : Number(to),
    });
  }

  function clear() {
    setFrom('');
    setTo('');
    onApply({ priceFrom: null, priceTo: null });
  }

  return (
    <div className="ip-price-block">
      <div className="ip-price-inputs">
        <label>
          <span>From ₹</span>
          <input type="number" min={priceBounds.min} max={priceBounds.max} placeholder={String(priceBounds.min)}
            value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          <span>To ₹</span>
          <input type="number" min={priceBounds.min} max={priceBounds.max} placeholder={String(priceBounds.max)}
            value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      <div className="ip-price-actions">
        <button type="button" className="ip-btn-ghost" onClick={clear}>Clear</button>
        <button type="button" className="ip-btn-primary small" onClick={apply}>Apply</button>
      </div>
    </div>
  );
}

function FilterGroupOptions({ group, options, filters, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? options : options.slice(0, VISIBLE_OPTION_LIMIT);
  const hasMore = options.length > VISIBLE_OPTION_LIMIT;

  return (
    <>
      <ul className="ip-filter-options">
        {visible.map(({ value, count }) => (
          <li key={value}>
            <label>
              <input
                type="checkbox"
                checked={(filters[group.key] ?? []).includes(value)}
                onChange={() => onToggle(group.key, value)}
              />
              {group.hasSwatch && (
                <span className="ip-color-swatch" style={{ background: COLOR_SWATCHES[value] ?? '#ccc' }} aria-hidden="true" />
              )}
              <span>{value}</span>
              <em>{count}</em>
            </label>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button type="button" className="ip-show-more" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </>
  );
}

function FilterAccordion({ groups, products, filters, openKeys, onToggleOpen, onToggle, onPriceApply, priceBounds }) {
  return (
    <div className="ip-filter-groups">
      {groups.map((group) => {
        const isOpen = openKeys.includes(group.key);
        const options = group.isPrice ? null : buildOptionCounts(products, group.key, group.isArray);
        if (!group.isPrice && options.length === 0) return null;
        const Icon = FILTER_ICONS[group.icon ?? group.key] ?? FILTER_ICONS.default;
        const selectedCount = group.isPrice
          ? (filters.priceFrom != null || filters.priceTo != null ? 1 : 0)
          : (filters[group.key] ?? []).length;
        return (
          <div className="ip-filter-group" key={group.key}>
            <button
              type="button"
              className="ip-filter-group-header"
              onClick={() => onToggleOpen(group.key)}
              aria-expanded={isOpen}
            >
              <span className="ip-filter-icon"><Icon /></span>
              <span className="ip-filter-group-title">{group.title}</span>
              {selectedCount > 0 && <span className="ip-filter-selected-badge">{selectedCount}</span>}
              <ChevronIcon className={`ip-filter-chevron${isOpen ? ' open' : ''}`} aria-hidden="true" />
            </button>
            <div className={`ip-filter-group-body${isOpen ? ' open' : ''}`}>
              {group.isPrice ? (
                <PriceGroup filters={filters} priceBounds={priceBounds} onApply={onPriceApply} />
              ) : (
                <FilterGroupOptions group={group} options={options} filters={filters} onToggle={onToggle} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActiveChips({ groups, filters, onRemoveValue, onRemovePrice }) {
  const chips = [];
  groups.forEach(({ key, isPrice }) => {
    if (isPrice) return;
    (filters[key] ?? []).forEach((value) => {
      chips.push({ id: `${key}:${value}`, label: value, onRemove: () => onRemoveValue(key, value) });
    });
  });
  if (filters.priceFrom != null || filters.priceTo != null) {
    const label = `₹${filters.priceFrom ?? 0} – ₹${filters.priceTo ?? '∞'}`;
    chips.push({ id: 'price', label, onRemove: onRemovePrice });
  }
  if (chips.length === 0) return null;
  return (
    <div className="ip-chip-section">
      <p className="ip-chip-heading">Selected Filters</p>
      <div className="ip-chip-row">
        {chips.map((chip) => (
          <span className="ip-chip" key={chip.id}>
            {chip.label}
            <button type="button" onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter`}>✕</button>
          </span>
        ))}
      </div>
    </div>
  );
}

// The reusable filter sidebar/drawer used by every product listing page.
// `groups` (from data/filterConfig.js) decides which filter categories and
// options actually show for the current category/subcategory - this
// component itself has no category-specific knowledge at all.
function CategoryFilters({ products, groups, filters, setFilters, resultCount, priceBounds }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);

  const activeCount = countActiveFilters(filters, groups);

  function openDrawer() {
    setOpenKeys([]);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function removeValue(key, value) {
    setFilters((prev) => toggleValue(prev, key, value));
  }

  function removePrice() {
    setFilters((prev) => ({ ...prev, priceFrom: null, priceTo: null }));
  }

  useEffect(() => {
    if (!drawerOpen) return undefined;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    // A single wrapping element - CategoryPage's grid only ever sees one
    // item here, since the drawer itself is a fixed overlay that would
    // otherwise land as a stray extra grid child.
    <div className="ip-filter-root">
      <div className="ip-toolbar">
        <p className="ip-toolbar-count">{resultCount} products</p>
        <button type="button" className="ip-filter-trigger" onClick={openDrawer}>
          <SlidersIcon />
          Filter
          {activeCount > 0 && <span className="ip-trigger-badge">{activeCount}</span>}
        </button>
      </div>

      {drawerOpen && (
        <div className="ip-drawer-overlay" onClick={closeDrawer}>
          <div className="ip-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Filters">
            <div className="ip-drawer-handle" aria-hidden="true" />
            <div className="ip-drawer-header">
              <div>
                <h3>Filter</h3>
                <p className="ip-drawer-count">{resultCount} products</p>
              </div>
              <div className="ip-drawer-header-actions">
                {activeCount > 0 && (
                  <button type="button" className="ip-clear-all" onClick={() => setFilters({})}>Clear All</button>
                )}
                <button type="button" className="ip-drawer-close" onClick={closeDrawer} aria-label="Close filters">
                  <CloseIcon />
                </button>
              </div>
            </div>
            <div className="ip-drawer-body">
              {/* Every category writes straight to the real, applied filter
                  state - selecting an option updates the product grid (and
                  every count in this drawer) immediately. */}
              <ActiveChips groups={groups} filters={filters} onRemoveValue={removeValue} onRemovePrice={removePrice} />
              <FilterAccordion
                groups={groups}
                products={products}
                filters={filters}
                openKeys={openKeys}
                onToggleOpen={(key) => setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))}
                onToggle={(key, value) => setFilters((prev) => toggleValue(prev, key, value))}
                onPriceApply={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
                priceBounds={priceBounds}
              />
            </div>
            <div className="ip-drawer-footer">
              <button type="button" className="ip-btn-full" onClick={closeDrawer}>
                Show {resultCount} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryFilters;
