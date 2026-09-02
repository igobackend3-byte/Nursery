// Products & Categories, backed by Firestore (`products/{productId}`,
// `categories/{slug}`) instead of the static data/products.js array. Admin
// CRUD (Products/Categories/Inventory pages) reads and writes here now, so
// edits actually persist. The storefront still reads the static file for
// now - that's a separate, later migration (see the Firebase build plan).
import {
  collection, deleteDoc, doc, getDocs, onSnapshot, setDoc, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { PRODUCT_NAME_TRANSLATIONS } from '../data/productTranslations';

const PRODUCTS_COL = 'products';
const CATEGORIES_COL = 'categories';
const BATCH_SIZE = 450; // Firestore's write-batch limit is 500; leave headroom.

// Firestore rejects `undefined` field values outright (unlike a plain JS
// object) - several catalogue products have optional fields (e.g.
// `giftType`) that are `undefined` when not set. Strip those before writing.
function stripUndefined(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// One-time seed: pushes the built-in catalogue into Firestore, but only if
// the products collection is currently empty - so it's safe to call this on
// every admin load without re-seeding (or clobbering) real edits.
export async function seedCatalogueIfEmpty() {
  const existing = await getDocs(collection(db, PRODUCTS_COL));
  if (!existing.empty) return { seeded: false };

  for (let i = 0; i < PRODUCTS.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    PRODUCTS.slice(i, i + BATCH_SIZE).forEach((p) => {
      batch.set(doc(db, PRODUCTS_COL, String(p.id)), stripUndefined(p));
    });
    await batch.commit();
  }

  for (let i = 0; i < CATEGORIES.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    CATEGORIES.slice(i, i + BATCH_SIZE).forEach((c) => {
      batch.set(doc(db, CATEGORIES_COL, c.slug), stripUndefined(c));
    });
    await batch.commit();
  }

  return { seeded: true, products: PRODUCTS.length, categories: CATEGORIES.length };
}

export function subscribeProducts(callback) {
  return onSnapshot(collection(db, PRODUCTS_COL), (snap) => {
    callback(snap.docs.map((d) => d.data()));
  });
}

export function subscribeCategories(callback) {
  return onSnapshot(collection(db, CATEGORIES_COL), (snap) => {
    callback(snap.docs.map((d) => d.data()));
  });
}

export function updateProductDoc(id, patch) {
  return setDoc(doc(db, PRODUCTS_COL, String(id)), stripUndefined(patch), { merge: true });
}

export function deleteProductDoc(id) {
  return deleteDoc(doc(db, PRODUCTS_COL, String(id)));
}

export async function addProductDoc(product, allProducts) {
  const maxNum = allProducts.reduce((max, p) => {
    const n = Number(String(p.id).replace(/^p-/, ''));
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  const id = `p-${maxNum + 1}`;
  await setDoc(doc(db, PRODUCTS_COL, id), stripUndefined({ ...product, id }));
  return id;
}

// One-time (repeatable) sync: pushes the built-in name translations from
// data/productTranslations.js onto the *live* Firestore product docs that
// already exist (matched by exact English `name`), so the admin doesn't
// have to hand-type them into the per-product Translations panel one by
// one. Only ever merges the `translations.<lang>.name` field - never
// touches price/stock/description/anything else, and never overwrites a
// translation an admin already entered by hand for a language (existing
// entries win). Safe to re-run any time new entries are added to
// productTranslations.js - already-synced products are just re-merged
// with the same values.
export async function syncBuiltInProductTranslations(allProducts) {
  const toWrite = allProducts.filter((p) => PRODUCT_NAME_TRANSLATIONS[p.name]);
  let written = 0;
  for (let i = 0; i < toWrite.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    toWrite.slice(i, i + BATCH_SIZE).forEach((p) => {
      const incoming = PRODUCT_NAME_TRANSLATIONS[p.name];
      const merged = { ...p.translations };
      for (const [lang, name] of Object.entries(incoming)) {
        if (!merged[lang]?.name) merged[lang] = { ...merged[lang], name };
      }
      batch.set(doc(db, PRODUCTS_COL, String(p.id)), { translations: stripUndefined(merged) }, { merge: true });
      written += 1;
    });
    await batch.commit();
  }
  return { matched: toWrite.length, written };
}

export function updateCategoryDoc(slug, patch) {
  return setDoc(doc(db, CATEGORIES_COL, slug), stripUndefined(patch), { merge: true });
}

function slugify(label) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function addCategoryDoc(category, allCategories) {
  const slug = slugify(category.label);
  if (!slug) throw new Error('Category name is required.');
  if (allCategories.some((c) => c.slug === slug)) {
    throw new Error('A category with this name already exists.');
  }
  await setDoc(doc(db, CATEGORIES_COL, slug), stripUndefined({ ...category, slug }));
  return slug;
}

export function deleteCategoryDoc(slug) {
  return deleteDoc(doc(db, CATEGORIES_COL, slug));
}
