// Local, no-backend content store. Both the storefront (Home.jsx,
// OffersSection.jsx, ...) and the admin's Content page read/write through
// this exact same interface - `getSiteContent()` / `saveSiteContent()`.
//
// Today it's backed by localStorage so edits made in /admin actually show
// up on the live site immediately, with zero server. When Firestore is
// connected (build plan Phase 2-3), only the two functions in this file
// change to read/write Firestore instead - nothing that calls them, in
// either the admin or the storefront, needs to change at all.
import { DEFAULT_SITE_CONTENT } from '../data/siteContent';

const STORAGE_KEY = 'igo-site-content-v1';

export function getSiteContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const saved = JSON.parse(raw);
    // Shallow-merge per top-level section so a site update that adds a
    // brand-new section (e.g. a future "about" block) still shows its
    // default even if an older save was made before that section existed.
    return { ...DEFAULT_SITE_CONTENT, ...saved };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function resetSiteContent() {
  localStorage.removeItem(STORAGE_KEY);
}
