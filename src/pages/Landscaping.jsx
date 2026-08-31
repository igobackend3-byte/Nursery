const LANDSCAPING_SERVICES = [
  'Villa Landscaping', 'Balcony Garden', 'Terrace Garden', 'Rooftop Garden', 'Vertical Garden',
  'Courtyard Garden', 'Backyard Garden', 'Frontyard Landscaping', 'Farmhouse Landscaping',
  'Resort Landscaping', 'Hotel Landscaping', 'Apartment Landscaping', 'Gated Community Landscaping',
  'Office Landscaping', 'Commercial Landscaping', 'Corporate Landscaping', 'Industrial Landscaping',
  'Campus Landscaping', 'School Landscaping', 'Hospital Landscaping', 'Temple Landscaping',
  'Park Landscaping', 'Swimming Pool Landscaping', 'Entrance Landscaping', 'Driveway Landscaping',
  'Walkway Landscaping', 'Pergola Garden', 'Gazebo Garden', 'Rock Garden', 'Zen Garden',
  'Tropical Garden', 'Japanese Garden', 'Butterfly Garden', 'Fragrance Garden', 'Herbal Garden',
  'Edible Garden', 'Water Garden', 'Koi Pond Landscaping', 'Fountain Landscaping', 'Bonsai Garden',
  'Succulent Garden', 'Cactus Garden', 'Lawn Development', 'Indoor Green Decor', 'Living Wall',
  'Moss Wall', 'Biophilic Landscaping', 'Sustainable Landscaping', 'Xeriscape Landscaping',
  'Rain Garden', 'Smart Irrigation Landscaping',
];

// The photos in public/images/landscaping-services/ are numbered 01-32 in
// the same order as the first 32 services above (see
// Garden_Images_Separate, the source folder) - e.g. "01_Villa_Landscaping.png"
// for "Villa Landscaping". Only those first 32 services have a matching
// photo right now, so the remaining ones (Butterfly Garden onward) keep the
// original text-only card rather than showing a placeholder.
const SERVICE_IMAGE_COUNT = 32;
function serviceImage(title, index) {
  if (index >= SERVICE_IMAGE_COUNT) return null;
  const num = String(index + 1).padStart(2, '0');
  return `/images/landscaping-services/${num}_${title.replace(/ /g, '_')}.png`;
}

function Landscaping() {
  return (
    <div className="garden-services-page">
      <p className="eyebrow">BEYOND PRODUCTS</p>
      <h1>Landscaping</h1>
      <p className="category-tagline">
        End-to-end landscaping design and build - from a single balcony to a full campus. Browse the
        services below and reach out for a site visit and quote.
      </p>

      <div className="services-grid large landscaping-grid">
        {LANDSCAPING_SERVICES.map((title, index) => {
          const image = serviceImage(title, index);
          return (
            <div className={`service-card static compact${image ? ' has-image' : ''}`} key={title}>
              {image && <img src={image} alt={title} loading="lazy" />}
              <h3>{title}</h3>
            </div>
          );
        })}
      </div>

      <div className="plant-finder-band">
        <div>
          <p className="eyebrow light">GET STARTED</p>
          <h2>Tell us about your space</h2>
          <p>Share a few photos and dimensions, and our team will put together a plan and quote.</p>
        </div>
        <a href="mailto:hello@igonursery.com" className="btn-find-plant">Request a consultation</a>
      </div>
    </div>
  );
}

export default Landscaping;
