const SERVICES = [
  { title: 'Terrace Garden', desc: 'Turn an unused terrace into a shaded, plant-filled retreat — from layout to irrigation.' },
  { title: 'Balcony Garden', desc: 'Compact planting plans designed for railing planters, vertical racks and tight corners.' },
  { title: 'Landscaping', desc: 'Full outdoor landscaping for homes and offices, from lawn to layered plant beds.' },
  { title: 'Plant Maintenance', desc: 'Scheduled watering, pruning and pest checks so your garden stays healthy year-round.' },
];

function GardenServices() {
  return (
    <div className="garden-services-page">
      <p className="eyebrow">BEYOND PRODUCTS</p>
      <h1>Garden Services</h1>
      <p className="category-tagline">From terrace gardens to full landscaping, our team can help.</p>

      <div className="services-grid large">
        {SERVICES.map((service) => (
          <div className="service-card static" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
            <span>Learn more →</span>
          </div>
        ))}
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

export default GardenServices;
