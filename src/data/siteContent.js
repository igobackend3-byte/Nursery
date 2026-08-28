// Real content, as it exists on the live homepage today - this is the
// starting point both the storefront and the admin's Content page render
// from (see lib/contentStore.js). Nothing here is placeholder copy.
import journalPottingMixImg from '../assets/journal-potting-mix.jpg';

export const DEFAULT_SITE_CONTENT = {
  hero: {
    tag: 'MUTTUKADU LAB ONLINE',
    titleLine1: 'NATURE',
    titleLine2: 'ENGINEERED.',
    description: 'IGO is not just a nursery. We are an AgriTech farm using IoT data and precision trials to grow the healthiest plant palette in India.',
    primaryButtonText: 'START GARDEN ASSISTANT ⚡',
    secondaryButtonText: 'SHOP PLANTS',
    secondaryButtonLink: '/category/indoor-plants',
    videoUrl: '/videos/hero-nursery-video.mp4',
  },
  offers: [
    { id: 1, qty: 4, price: 799, note: 'WITH GROW POT', image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?q=80&w=500&auto=format&fit=crop' },
    { id: 2, qty: 4, price: 999, note: 'WITH KRISH POT', image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=500&auto=format&fit=crop' },
    { id: 3, qty: 4, price: 1199, note: 'WITH LAGOS POT', image: 'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?q=80&w=500&auto=format&fit=crop' },
  ],
  journal: [
    { id: 1, title: 'How to choose your first indoor plant', to: '/blog', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=500&auto=format&fit=crop' },
    { id: 2, title: 'A simple guide to potting mix', to: '/blog', image: journalPottingMixImg },
    { id: 3, title: '3 ways to make a balcony feel greener', to: '/blog', image: 'https://images.unsplash.com/photo-1463154545680-d59320fd685d?q=80&w=500&auto=format&fit=crop' },
  ],
  gardenServices: [
    { id: 1, title: 'Terrace Garden', to: '/garden-services' },
    { id: 2, title: 'Balcony Garden', to: '/garden-services' },
    { id: 3, title: 'Landscaping', to: '/garden-services' },
    { id: 4, title: 'Plant Maintenance', to: '/garden-services' },
  ],
};
