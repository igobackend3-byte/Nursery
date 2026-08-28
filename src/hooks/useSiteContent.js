import { useState } from 'react';
import { getSiteContent } from '../lib/contentStore';

// Reads current content once per mount. Since admin edits and storefront
// views happen on different routes (full remount in between), reading
// once on mount is enough to always show the latest saved content -
// no live cross-tab sync needed for this use case.
export function useSiteContent() {
  const [content] = useState(getSiteContent);
  return content;
}
