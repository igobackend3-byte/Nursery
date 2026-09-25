import React from 'react';
import { Link } from 'react-router-dom';
import { FileIcon } from '../adminIcons';

const PAGES = [
  { id: 'home', title: 'Home', description: 'The main landing page of the nursery.' },
  { id: 'about', title: 'About Us', description: 'Our story, values, and journey.' },
  { id: 'plants', title: 'Plants', description: 'Main plants category landing page.' },
  { id: 'seeds', title: 'Seeds', description: 'Seeds category landing page.' },
  { id: 'pots-planters', title: 'Pots & Planters', description: 'Pots and planters landing page.' },
  { id: 'plant-care', title: 'Plant Care', description: 'Plant care category landing page.' },
  { id: 'garden-services', title: 'Garden Services', description: 'Garden services landing page.' },
  { id: 'landscaping', title: 'Landscaping', description: 'Landscaping services landing page.' },
  { id: 'gifting', title: 'Gifting', description: 'Gifting category landing page.' },
  { id: 'corporate-gifting', title: 'Corporate Gifting', description: 'Corporate Gifting category landing page.' },
  { id: 'blog', title: 'Blog', description: 'Garden journal and care guides.' },
  { id: 'contact', title: 'Contact Us', description: 'Contact page - info cards, message form, map and WhatsApp banner.' }
];

export default function PagesList() {
  return (
    <div className="admin-panel" style={{ padding: '24px' }}>
      <div className="admin-header" style={{ marginBottom: '24px' }}>
        <h1 className="admin-title">Pages</h1>
        <p className="admin-sub">Select a page to visually edit its content exactly as it appears on the live site.</p>
      </div>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {PAGES.map(page => (
          <Link 
            key={page.id} 
            to={`/admin/pages/${page.id}`} 
            className="admin-cat-card" 
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', padding: '20px', gap: '8px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--admin-bg-hover)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileIcon width="20" height="20" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{page.title}</h3>
            </div>
            <p className="admin-cell-sub" style={{ margin: 0, marginTop: '8px' }}>{page.description}</p>
            <div style={{ marginTop: 'auto', paddingTop: '12px', fontSize: '0.9rem', color: 'var(--admin-primary)', fontWeight: 500 }}>
              Edit visually →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
