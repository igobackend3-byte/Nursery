import { useLanguage } from '../context/LanguageContext';
import { getBlogPostTranslation } from '../i18n/translations';

const POSTS = [
  { title: 'How to choose your first indoor plant', excerpt: 'Light, space and how much time you actually have — the three questions that matter most.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop' },
  { title: 'A simple guide to potting mix', excerpt: 'What goes into a good mix, and why the bag from the hardware store usually isn’t it.', image: 'https://images.unsplash.com/photo-1502394202744-021cfbb17454?q=80&w=600&auto=format&fit=crop' },
  { title: '3 ways to make a balcony feel greener', excerpt: 'Small-space layouts that work even with a few hours of direct sun.', image: 'https://images.unsplash.com/photo-1463154545680-d59320fd685d?q=80&w=600&auto=format&fit=crop' },
  { title: 'Stop guessing when to water', excerpt: 'A simple system for knowing exactly when each plant needs water.', image: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=600&auto=format&fit=crop' },
  { title: 'Bonsai care for beginners', excerpt: 'Pruning, watering and light basics to keep a bonsai thriving for years.', image: 'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?q=80&w=600&auto=format&fit=crop' },
  { title: 'Reading the signs of an overwatered plant', excerpt: 'Yellowing leaves and mushy stems explained, and how to recover.', image: 'https://images.unsplash.com/photo-1493957988430-a5f2e15f39a3?q=80&w=600&auto=format&fit=crop' },
];

function Blog() {
  const { t, language } = useLanguage();
  return (
    <div className="blog-page">
      <p className="eyebrow">{t('pages.blogEyebrow')}</p>
      <h1>{t('pages.blogTitle')}</h1>
      <p className="category-tagline">{t('pages.blogTagline')}</p>

      <div className="journal-grid large">
        {POSTS.map((post) => {
          const tr = getBlogPostTranslation(post.title, language);
          return (
            <article className="journal-card" key={post.title}>
              <div className="journal-media" style={{ backgroundImage: `url('${post.image}')` }} />
              <h3>{tr?.title ?? post.title}</h3>
              <p>{tr?.excerpt ?? post.excerpt}</p>
              <span>{t('pages.readGuide')}</span>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Blog;
