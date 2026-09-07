import { useLanguage } from '../context/LanguageContext';

// Real nursery/landscaping photos are not uploaded yet - this page is
// deliberately left as a genuine empty state (no stock/placeholder images)
// until real photos are provided. Once available, add them to a GALLERY
// array here (id, image, caption) and map it below - the layout and
// styling are already built for that.
const GALLERY_PHOTOS = [];

function Gallery() {
  const { t } = useLanguage();
  return (
    <div className="gallery-page">
      <p className="eyebrow">{t('pages.galleryEyebrow')}</p>
      <h1>{t('pages.galleryTitle')}</h1>
      <p className="category-tagline">{t('pages.galleryTagline')}</p>

      {GALLERY_PHOTOS.length > 0 ? (
        <div className="gallery-grid">
          {GALLERY_PHOTOS.map((photo) => (
            <figure className="gallery-item" key={photo.id}>
              <img src={photo.image} alt={photo.caption} loading="lazy" />
              {photo.caption && <figcaption>{photo.caption}</figcaption>}
            </figure>
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <p>{t('pages.galleryComingSoon')}</p>
        </div>
      )}
    </div>
  );
}

export default Gallery;
