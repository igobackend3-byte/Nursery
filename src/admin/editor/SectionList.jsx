import React from 'react';
import { useVisualEditor } from './VisualEditorContext';

// Small inline leaf SVG (data: URI) used whenever a section has no real
// image to show as a thumbnail - never hotlinks an external placeholder
// image, so it can never show up broken.
const LEAF_PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="%23eef5ee"/><path d="M32 50V26" stroke="%232f6b3a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 26c0-10-8-16-16-16 0 10 6 16 16 16Z" fill="%234f9a5c"/><path d="M32 26c0-10 8-16 16-16 0 10-6 16-16 16Z" fill="%232f6b3a"/></svg>'
);

// Picks the most representative image for a section's thumbnail, straight
// from its own real content - never a generic hotlinked stock photo.
const getSectionThumbnail = (sectionKey, draftContent) => {
  const sectionData = draftContent && draftContent[sectionKey];
  if (!sectionData) return LEAF_PLACEHOLDER;

  if (sectionData.image) return sectionData.image;
  if (sectionData.backgroundImage) return sectionData.backgroundImage;
  if (sectionData.founderImage) return sectionData.founderImage;
  if (sectionData.igoHeaderImage) return sectionData.igoHeaderImage;

  // Sections whose real image lives on their first card/item.
  const arrayField = sectionData.items || sectionData.cards || sectionData.tiles || sectionData.posts || sectionData.steps;
  if (Array.isArray(arrayField)) {
    const withImage = arrayField.find((it) => it && it.image);
    if (withImage) return withImage.image;
  }

  return LEAF_PLACEHOLDER;
};

const getSectionDescription = (sectionKey) => {
  const descriptions = {
    hero: 'Hero banner section with main heading, description and CTA buttons.',
    ourStory: 'Our story and introduction section.',
    offers: 'Special offers and deals section.',
    statsStrip: 'Key statistics and highlights strip.',
    shopByCategory: 'Categories section with plant categories.',
    homeCorners: 'Featured categories for different spaces.',
    plantsPeopleLove: 'Best selling and popular plants.',
    justIn: 'New arrivals and latest plants.',
    completeGarden: 'Accessories and add-ons section.',
    gardenServices: 'Our services section.',
    nurseryJourney: 'Delivery and logistics section.',
    whyIgo: 'Technology and quality section.',
    ourStoryBand: 'Second story section.',
    comparisonSection: 'Comparison section.',
    plantFinder: 'Guidance section.',
    gardenJournal: 'Blog/articles section.',
    giftingBand: 'Gifts section.',
    newsletter: 'Newsletter subscription section.',
    faq: 'Support/Help section.',
    aboutHero: 'Hero banner with breadcrumb, heading, description and CTA button.',
    aboutStory: 'Our Story block with circular image, heading, description and Learn More button.',
    aboutStats: 'Animated stat counters - each number, label and icon individually editable.',
    aboutVisionMission: 'Vision and Mission cards - each icon, label, title, description and image individually editable.',
    aboutOffer: 'What We Offer cards - each image, icon, title, description and link individually editable.',
    plantsHubHero: 'Hero banner with small label, heading, description and background image.',
    plantsHubExplore: "Category circle row - each card's image, name and visibility individually editable.",
    plantsHubPopular: 'Popular plants grid, pulled live from your catalogue - each product individually editable.',
    seedsHubHero: 'Hero banner with small label, heading, description and background image.',
    seedsHubExplore: "Category circle row - each card's image, name and visibility individually editable.",
    seedsHubPopular: 'Popular seeds grid, pulled live from your catalogue - each product individually editable.',
    potsHubHero: 'Hero banner with small label, heading, description and background image.',
    potsHubExplore: "Category circle row - each card's image, name and visibility individually editable.",
    potsHubPopular: 'Popular products grid, pulled live from your catalogue - each product individually editable.',
    plantCareHubHero: 'Hero banner with small label, heading, description and background image.',
    plantCareHubExplore: "Category circle row - each card's image, name and visibility individually editable.",
    plantCareHubPopular: 'Popular products grid, pulled live from your catalogue - each product individually editable.',
    contactHero: 'Hero banner with heading, description and background image.',
    contactInfoCards: 'Phone, Email, Location and Business Hours info cards.',
    contactForm: "'Send Us a Message' form - heading, side image, field labels and submit button.",
    contactTrust: 'Support/trust strip - three perk columns.',
    contactFarm: 'Find Our Farm section - heading, description, Get Directions button and map.',
    contactWhatsapp: 'WhatsApp Quick Help banner - heading, description, number and background image.',
  };
  return descriptions[sectionKey] || 'Manage content for this section.';
};

// This list is reused for every page's Visual Editor screen, not just
// the Home Page - `pageId` (from the route, e.g. "about") picks the right
// title/subtitle instead of always saying "Home Page".
const PAGE_META = {
  home: { title: 'Home Page', noun: 'home page' },
  about: { title: 'About Page', noun: 'About page' },
  plants: { title: 'Plants Page', noun: 'Plants page' },
  seeds: { title: 'Seeds Page', noun: 'Seeds page' },
  'pots-planters': { title: 'Pots & Planters Page', noun: 'Pots & Planters page' },
  'plant-care': { title: 'Plant Care Page', noun: 'Plant Care page' },
  contact: { title: 'Contact Page', noun: 'Contact page' },
};

export default function SectionList({ pageId }) {
  const { pageSections, activeSection, setActiveSection, draftContent } = useVisualEditor();
  const pageMeta = PAGE_META[pageId] || PAGE_META.home;

  return (
    <div className="section-list-container">
      <div className="section-list-header">
        <h2 className="section-list-title">{pageMeta.title}</h2>
        <p className="section-list-subtitle">Manage and edit sections of your {pageMeta.noun}. Click on any section to edit its content directly.</p>
      </div>

      <div className="section-list">
        {pageSections.map((section, index) => {
          const isActive = activeSection === section.key;
          const thumbnail = getSectionThumbnail(section.key, draftContent);
          const description = getSectionDescription(section.key);

          return (
            <div
              key={section.key}
              className={`section-list-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSection(section.key)}
            >
              <div className="section-drag-handle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              </div>

              <div className="section-number">{index + 1}</div>

              <div className="section-thumbnail">
                <img
                  src={thumbnail}
                  alt={section.label}
                  onError={(e) => { e.currentTarget.src = LEAF_PLACEHOLDER; }}
                />
              </div>

              <div className="section-info">
                <div className="section-name">{section.label}</div>
                <div className="section-desc">{description}</div>
              </div>

              <div className="section-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
