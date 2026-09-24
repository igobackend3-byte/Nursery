import io

ROOT = "/sessions/rcw-013juftdpvoovh6j5geqfaq3/mnt/Nursery project/igo-nursery-website/nursery-store"

def apply(path, replacements):
    with io.open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        count = content.count(old)
        if count != 1:
            raise SystemExit(f"FAIL: {path}: expected 1 occurrence, found {count}\n---OLD---\n{old[:300]}")
        content = content.replace(old, new, 1)
    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {path} ({len(replacements)} edits)")


# ---------- siteContent.js ----------
apply(f"{ROOT}/src/data/siteContent.js", [
(
"""  gardenJournal: {
    visible: true,
    eyebrow: 'LEARN • GROW • THRIVE',
    heading: 'Garden journal',
    seeAllEnabled: true,
    seeAllText: 'See all →',
    seeAllLink: '/blog',
    readGuideText: 'Read guide →',
    backgroundColor: '',
    textColor: '',
    paddingY: '',
    posts: [
      { id: 1, title: 'How to choose your first indoor plant', imageAlt: 'How to choose your first indoor plant', linkUrl: '/blog', linkTarget: '_self', image: '/images/journal/How to choose your first indoor plant.png', visible: true, order: 1 },
      { id: 2, title: 'A simple guide to potting mix', imageAlt: 'A simple guide to potting mix', linkUrl: '/blog', linkTarget: '_self', image: '/images/journal/a simple guide to potting mix.png', visible: true, order: 2 },
      { id: 3, title: '3 ways to make a balcony feel greener', imageAlt: '3 ways to make a balcony feel greener', linkUrl: '/blog', linkTarget: '_self', image: '/images/journal/3 ways to make a balcony feel greener.png', visible: true, order: 3 },
    ],
  },""",
"""  gardenJournal: {
    visible: true,
    eyebrow: 'LEARN • GROW • THRIVE',
    heading: 'Garden journal',
    seeAllEnabled: true,
    seeAllText: 'See all →',
    seeAllLink: '/blog',
    readGuideText: 'Read guide →',
    backgroundColor: '',
    backgroundImage: '',
    textColor: '',
    paddingY: '',
    posts: [
      { id: 1, title: 'How to choose your first indoor plant', imageAlt: 'How to choose your first indoor plant', linkUrl: '/blog', linkTarget: '_self', linkText: '', image: '/images/journal/How to choose your first indoor plant.png', visible: true, order: 1 },
      { id: 2, title: 'A simple guide to potting mix', imageAlt: 'A simple guide to potting mix', linkUrl: '/blog', linkTarget: '_self', linkText: '', image: '/images/journal/a simple guide to potting mix.png', visible: true, order: 2 },
      { id: 3, title: '3 ways to make a balcony feel greener', imageAlt: '3 ways to make a balcony feel greener', linkUrl: '/blog', linkTarget: '_self', linkText: '', image: '/images/journal/3 ways to make a balcony feel greener.png', visible: true, order: 3 },
    ],
  },"""
),
])

# ---------- sectionSchemas.js ----------
apply(f"{ROOT}/src/admin/editor/sectionSchemas.js", [
(
"""  gardenJournal: {
    text: [
      { field: 'eyebrow', label: 'Eyebrow' },
      { field: 'heading', label: 'Heading' },
      { field: 'seeAllText', label: 'See All Link Text' },
      { field: 'seeAllLink', label: 'See All Link URL' },
    ],
    cards: {
      field: 'posts',
      label: 'Journal Posts',
      itemLabel: 'Article',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'linkUrl', label: 'Link URL', type: 'text' },
      ],
    },
    settings: true,
    reset: true,
  },""",
"""  gardenJournal: {
    // No standalone "Replace Background Image" quick action - offered as a
    // Solid/Image choice inside Section Settings instead, same pattern as
    // plantFinder (see backgroundImage below).
    backgroundImage: { field: 'backgroundImage', label: 'Background Image' },
    text: [
      { field: 'eyebrow', label: 'Section Label' },
      { field: 'heading', label: 'Heading' },
    ],
    // "See all ->" gets its own "Edit See All Link" Quick Action (same
    // reusable pattern as Plant Finder's CTA button) rather than being
    // folded into schema.text, since it has its own URL + show/hide.
    button: {
      label: 'See All Link',
      fields: [
        { field: 'seeAllText', label: 'Link Text' },
        { field: 'seeAllLink', label: 'Link URL' },
        { field: 'seeAllEnabled', label: 'Show link on live site', type: 'checkbox' },
      ],
    },
    cards: {
      field: 'posts',
      label: 'Blog Cards',
      itemLabel: 'Blog Card',
      itemTitleFields: ['title'],
      itemFields: [
        { field: 'image', label: 'Image', type: 'image' },
        { field: 'title', label: 'Title', type: 'text' },
        { field: 'linkText', label: 'Link Text (optional, defaults to "Read guide ->")', type: 'text' },
        { field: 'linkUrl', label: 'Link URL', type: 'text' },
        { field: 'order', label: 'Display Order', type: 'number' },
        { field: 'visible', label: 'Active (shown on live site)', type: 'checkbox' },
      ],
    },
    settings: true,
    reset: true,
  },"""
),
])

# ---------- VisualEditorContext.jsx ----------
apply(f"{ROOT}/src/admin/editor/VisualEditorContext.jsx", [
(
"""  const deleteArrayItem = useCallback((sectionKey, arrayField, index) => {
    setDraftContent(prev => {
      const arr = prev[sectionKey]?.[arrayField] || [];
      const newArr = [...arr];
      newArr.splice(index, 1);
      const newSection = { ...prev[sectionKey], [arrayField]: newArr };
      return { ...prev, [sectionKey]: newSection };
    });
    setHasUnsavedChanges(true);
  }, []);""",
"""  const deleteArrayItem = useCallback((sectionKey, arrayField, index) => {
    setDraftContent(prev => {
      const arr = prev[sectionKey]?.[arrayField] || [];
      const newArr = [...arr];
      newArr.splice(index, 1);
      const newSection = { ...prev[sectionKey], [arrayField]: newArr };
      return { ...prev, [sectionKey]: newSection };
    });
    setHasUnsavedChanges(true);
  }, []);

  // Inserts an exact copy of one array item (new id, same field values)
  // directly after the original - used by CardHoverControls' "Duplicate"
  // action so an admin can clone a card/row/item and then edit the copy.
  const duplicateArrayItem = useCallback((sectionKey, arrayField, index) => {
    setDraftContent(prev => {
      const arr = prev[sectionKey]?.[arrayField] || [];
      const source = arr[index];
      if (!source) return prev;
      const copy = { ...source, id: Date.now().toString() };
      const newArr = [...arr];
      newArr.splice(index + 1, 0, copy);
      const newSection = { ...prev[sectionKey], [arrayField]: newArr };
      return { ...prev, [sectionKey]: newSection };
    });
    setHasUnsavedChanges(true);
  }, []);"""
),
(
"""        addArrayItem,
        updateArrayItem,
        deleteArrayItem,
        deleteContent,""",
"""        addArrayItem,
        updateArrayItem,
        deleteArrayItem,
        duplicateArrayItem,
        deleteContent,"""
),
(
"""    addArrayItem: () => {},
    updateArrayItem: () => {},
    deleteArrayItem: () => {},
    deleteContent: () => {},""",
"""    addArrayItem: () => {},
    updateArrayItem: () => {},
    deleteArrayItem: () => {},
    duplicateArrayItem: () => {},
    deleteContent: () => {},"""
),
])

# ---------- CardHoverControls.jsx ----------
apply(f"{ROOT}/src/admin/editor/CardHoverControls.jsx", [
(
"""export default function CardHoverControls({ sectionKey, arrayField, index, itemLabel, children }) {
  const { isEditorMode, setActiveElement, deleteArrayItem } = useVisualEditor();""",
"""export default function CardHoverControls({ sectionKey, arrayField, index, itemLabel, children }) {
  const { isEditorMode, setActiveElement, deleteArrayItem, duplicateArrayItem } = useVisualEditor();"""
),
(
"""        <button
          type="button"
          className="card-hover-btn card-hover-btn-danger"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm(`Delete this ${(itemLabel || 'item').toLowerCase()}?`)) {
              deleteArrayItem(sectionKey, arrayField, index);
            }
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>
      </div>
    </div>
  );
}""",
"""        <button
          type="button"
          className="card-hover-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            duplicateArrayItem(sectionKey, arrayField, index);
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Duplicate
        </button>
        <button
          type="button"
          className="card-hover-btn card-hover-btn-danger"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm(`Delete this ${(itemLabel || 'item').toLowerCase()}?`)) {
              deleteArrayItem(sectionKey, arrayField, index);
            }
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>
      </div>
    </div>
  );
}"""
),
])

# ---------- Home.jsx ----------
apply(f"{ROOT}/src/pages/Home.jsx", [
(
"""function GardenJournal() {
  const { gardenJournal: gj } = useSiteContent();
  const { t, language } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);

  if (gj && gj.visible === false) return null;

  const eyebrow = gj?.eyebrow || t('home.learnGrowThrive');
  const heading = gj?.heading || t('home.gardenJournal');
  const seeAllEnabled = gj?.seeAllEnabled !== false;
  const seeAllText = gj?.seeAllText || t('home.seeAll');
  const seeAllLink = gj?.seeAllLink || '/blog';
  const readGuideText = gj?.readGuideText || t('home.readGuide');
  // Older saved posts used `to` for the link - normalize to `linkUrl` so an
  // older save still opens and links correctly here.
  const posts = (gj?.posts?.length ? gj.posts : [])
    .map((p) => ({ linkUrl: p.to || p.linkUrl, linkTarget: '_self', visible: true, ...p }))
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (posts.length === 0) return null;

  const sectionStyle = {};
  if (gj?.backgroundColor) sectionStyle.backgroundColor = gj.backgroundColor;
  if (gj?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = gj.paddingY;
  const headingStyle = gj?.textColor ? { color: gj.textColor } : undefined;

  return (
    <section ref={ref} className={`garden-journal reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 style={headingStyle}>{heading}</h2>
        </div>
        {seeAllEnabled && <Link to={seeAllLink} className="see-all">{seeAllText}</Link>}
      </div>
      <div className="journal-grid">
        {posts.map((post) => {
          const title = getBlogPostTranslation(post.title, language)?.title ?? post.title;
          return (
            <Link
              to={post.linkUrl}
              target={post.linkTarget === '_blank' ? '_blank' : undefined}
              rel={post.linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
              key={post.id}
              className="journal-card"
            >
              {post.image ? (
                <img src={post.image} alt={post.imageAlt || title} className="journal-media" loading="lazy" />
              ) : (
                <span className="journal-media journal-media-fallback" aria-hidden="true"><LeafGlyph /></span>
              )}
              <h3>{title}</h3>
              <span>{readGuideText}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}""",
"""function GardenJournal() {
  const { gardenJournal: gj } = useSiteContent();
  const { t, language } = useLanguage();
  const [ref, visible] = useScrollReveal(0.1);

  if (gj && gj.visible === false) return null;

  const eyebrow = gj?.eyebrow || t('home.learnGrowThrive');
  const heading = gj?.heading || t('home.gardenJournal');
  const seeAllEnabled = gj?.seeAllEnabled !== false;
  const seeAllText = gj?.seeAllText || t('home.seeAll');
  const seeAllLink = gj?.seeAllLink || '/blog';
  const readGuideText = gj?.readGuideText || t('home.readGuide');
  // Older saved posts used `to` for the link - normalize to `linkUrl` so an
  // older save still opens and links correctly here.
  const posts = (gj?.posts?.length ? gj.posts : [])
    .map((p) => ({ linkUrl: p.to || p.linkUrl, linkTarget: '_self', visible: true, ...p }))
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  // Raw (unfiltered/unsorted) array so hover controls can target the real
  // post by id, same pattern as ComparisonSection/TrustBenefits/Faq.
  const rawPosts = gj?.posts?.length ? gj.posts : null;

  if (posts.length === 0) return null;

  const sectionStyle = {};
  if (gj?.backgroundColor) sectionStyle.backgroundColor = gj.backgroundColor;
  if (gj?.backgroundImage) {
    sectionStyle.backgroundImage = `url(${gj.backgroundImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  }
  if (gj?.paddingY) sectionStyle.paddingTop = sectionStyle.paddingBottom = gj.paddingY;
  const headingStyle = gj?.textColor ? { color: gj.textColor } : undefined;

  const seeAllFields = getSectionSchema('gardenJournal').button?.fields;

  return (
    <section ref={ref} className={`garden-journal reveal-section${visible ? ' is-visible' : ''}`} style={sectionStyle}>
      <div className="section-heading">
        <div>
          <EditableElement sectionKey="gardenJournal" field="eyebrow" type="text" label="Section Label">
            <p className="eyebrow">{eyebrow}</p>
          </EditableElement>
          <EditableElement sectionKey="gardenJournal" field="heading" type="text" label="Heading" hideDelete>
            <h2 style={headingStyle}>{heading}</h2>
          </EditableElement>
        </div>
        {seeAllEnabled && (
          <EditableElement sectionKey="gardenJournal" field="__button__" type="text_fields" label="See All Link" hideDelete fields={seeAllFields}>
            <Link to={seeAllLink} className="see-all">{seeAllText}</Link>
          </EditableElement>
        )}
      </div>
      <div className="journal-grid">
        {posts.map((post) => {
          const title = getBlogPostTranslation(post.title, language)?.title ?? post.title;
          const rawIndex = rawPosts ? rawPosts.findIndex((p) => p.id === post.id) : -1;
          const cardEl = (
            <Link
              to={post.linkUrl}
              target={post.linkTarget === '_blank' ? '_blank' : undefined}
              rel={post.linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
              className="journal-card"
            >
              {post.image ? (
                <img src={post.image} alt={post.imageAlt || title} className="journal-media" loading="lazy" />
              ) : (
                <span className="journal-media journal-media-fallback" aria-hidden="true"><LeafGlyph /></span>
              )}
              <h3>{title}</h3>
              <span>{post.linkText || readGuideText}</span>
            </Link>
          );
          if (rawIndex === -1) {
            return <Fragment key={post.id}>{cardEl}</Fragment>;
          }
          return (
            <CardHoverControls key={post.id} sectionKey="gardenJournal" arrayField="posts" index={rawIndex} itemLabel="Blog Card">
              {cardEl}
            </CardHoverControls>
          );
        })}
      </div>
    </section>
  );
}"""
),
])

print("ALL EDITS APPLIED")
