import { Fragment } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getBlogPostTranslation } from '../i18n/translations';
import { useSiteContent } from '../hooks/useSiteContent';
import EditableSection from '../admin/editor/EditableSection';
import EditableElement from '../admin/editor/EditableElement';
import CardHoverControls from '../admin/editor/CardHoverControls';

function Blog() {
  const { t, language } = useLanguage();
  const { blogPage: bp } = useSiteContent();

  const eyebrow = bp?.eyebrow || t('pages.blogEyebrow');
  const title = bp?.title || t('pages.blogTitle');
  const tagline = bp?.tagline || t('pages.blogTagline');

  const posts = (bp?.posts?.length ? bp.posts : [])
    .map((p) => ({ visible: true, ...p }))
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  
  const rawPosts = bp?.posts?.length ? bp.posts : null;

  return (
    <EditableSection sectionKey="blogPage" label="Blog Page">
      <div className="blog-page">
        <EditableElement sectionKey="blogPage" field="eyebrow" type="text" label="Eyebrow">
          <p className="eyebrow">{eyebrow}</p>
        </EditableElement>
        <EditableElement sectionKey="blogPage" field="title" type="text" label="Title">
          <h1>{title}</h1>
        </EditableElement>
        <EditableElement sectionKey="blogPage" field="tagline" type="text" label="Tagline">
          <p className="category-tagline">{tagline}</p>
        </EditableElement>

        <div className="journal-grid large">
          {posts.map((post) => {
            const tr = getBlogPostTranslation(post.title, language);
            const rawIndex = rawPosts ? rawPosts.findIndex((p) => p.id === post.id) : -1;
            
            const cardEl = (
              <article className="journal-card">
                <div className="journal-media" style={{ backgroundImage: `url('${post.image}')` }} />
                <h3>{tr?.title ?? post.title}</h3>
                <p>{tr?.excerpt ?? post.excerpt}</p>
                <span>{post.linkText || t('pages.readGuide')}</span>
              </article>
            );

            if (rawIndex === -1) {
              return <Fragment key={post.id || post.title}>{cardEl}</Fragment>;
            }

            return (
              <CardHoverControls key={post.id} sectionKey="blogPage" arrayField="posts" index={rawIndex} itemLabel="Blog Card">
                {cardEl}
              </CardHoverControls>
            );
          })}
        </div>
      </div>
    </EditableSection>
  );
}

export default Blog;
