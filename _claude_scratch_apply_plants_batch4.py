import io

ROOT = "/sessions/rcw-013juftdpvoovh6j5geqfaq3/mnt/Nursery project/igo-nursery-website/nursery-store"
PATH = f"{ROOT}/src/admin/pages/Content.jsx"

with io.open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

START_ANCHOR = "      {page === 'plants' && (() => {"
END_ANCHOR = "      {page === 'home' && activeMeta && ("

start_idx = content.find(START_ANCHOR)
end_idx = content.find(END_ANCHOR)

if start_idx == -1:
    raise SystemExit("FAIL: start anchor not found")
if end_idx == -1:
    raise SystemExit("FAIL: end anchor not found")
if end_idx <= start_idx:
    raise SystemExit("FAIL: end anchor comes before start anchor")

# Sanity-check the span we're about to remove is exactly what we expect
# (both legacy panels, nothing else) before replacing it.
old_span = content[start_idx:end_idx]
if old_span.count("(() => {") != 2 or "SectionActions" not in old_span:
    raise SystemExit(f"FAIL: unexpected span contents (len={len(old_span)})")

NEW_SPAN = """      {page === 'plants' && (() => {
        const hub = content.plantsHub;
        const allPlantCategories = PLANTS_NAV_CATEGORY_SLUGS.map((slug) => categories.find((c) => c.slug === slug)).filter(Boolean);
        return (
          <div className="admin-panel">
            <p className="admin-panel-title">Plants Page &amp; Navbar</p>
            <div className="admin-mock-banner" style={{ marginBottom: 18 }}>
              The Plants page's hero banner, "Explore Plant Categories" row and "Popular Plants" grid are now fully
              editable - including per-card image and text - from the Visual Editor (Admin → Pages → Plants). This
              panel now only controls the "Plants ▾" navbar dropdown, which isn't part of that page.
            </div>

            <p className="admin-panel-title" style={{ marginTop: 4 }}>
              Navbar "Plants" dropdown ({hub.navbarCategorySlugs.length} of 5 selected)
            </p>
            <p className="admin-page-sub" style={{ marginTop: -10, marginBottom: 14 }}>
              Pick exactly the categories shown in the Plants navbar dropdown. Order here is the order shown.
            </p>
            {hub.navbarCategorySlugs.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {hub.navbarCategorySlugs.map((slug, i) => {
                  const cat = categories.find((c) => c.slug === slug);
                  if (!cat) return null;
                  return (
                    <div key={slug} className="admin-content-item">
                      <span style={{ fontSize: '0.86rem' }}>{cat.label}</span>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <button type="button" className="admin-icon-btn" onClick={() => moveNavbarCategory(i, -1)} aria-label="Move up">↑</button>
                        <button type="button" className="admin-icon-btn" onClick={() => moveNavbarCategory(i, 1)} aria-label="Move down">↓</button>
                        <button type="button" className="admin-icon-btn danger" onClick={() => toggleNavbarCategory(slug)} aria-label="Remove">
                          <TrashIcon width="14" height="14" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid var(--admin-border)', borderRadius: 8, padding: 8 }}>
              {allPlantCategories.filter((c) => !hub.navbarCategorySlugs.includes(c.slug)).map((c) => (
                <label key={c.slug} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px', fontSize: '0.86rem' }}>
                  <input type="checkbox" checked={false} onChange={() => toggleNavbarCategory(c.slug)} />
                  {c.label}
                </label>
              ))}
            </div>

            <SectionActions
              onSave={handleSave}
              onPublish={handleSave}
              onReset={() => {
                if (!confirm('Reset the Plants navbar dropdown back to the site default? This discards your edits.')) return;
                setContent((prev) => ({ ...prev, plantsHub: DEFAULT_SITE_CONTENT.plantsHub }));
                setSaved(false);
              }}
              onCancel={cancelSectionEdits}
            />
          </div>
        );
      })()}

      {['seeds', 'pots', 'plantcare'].includes(page) && (() => {
        const config = { seeds: SECTION_HUBS.seeds, pots: SECTION_HUBS.potsPlanters, plantcare: SECTION_HUBS.plantCare }[page];
        return (
          <div className="admin-panel">
            <p className="admin-panel-title">{config.navLabel} Page</p>
            <div className="admin-mock-banner">
              The {config.navLabel} page (hero, categories and popular products) is now fully editable from the
              Visual Editor - go to Admin → Pages → {config.navLabel} to edit its hero text/background, each
              category card's image and name, and the curated product list, with the exact same live preview as the
              real page.
            </div>
          </div>
        );
      })()}

"""

content = content[:start_idx] + NEW_SPAN + content[end_idx:]
with io.open(PATH, 'w', encoding='utf-8') as f:
    f.write(content)
print("OK: Content.jsx legacy plants/seeds/pots/plantcare panels trimmed")
