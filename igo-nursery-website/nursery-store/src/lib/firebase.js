// Single Firebase app instance for the whole site (storefront + admin).
// Config comes from Vite env vars (see .env / .env.example) - never
// hardcoded, per the project's Firebase integration plan.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard against re-initializing during Vite's dev HMR.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

// NOTE: Firebase Storage is intentionally not initialized yet - it requires
// the Blaze billing plan, which hasn't been approved. Add
// `import { getStorage } from 'firebase/storage'; export const storage = getStorage(app);`
// here once that's turned on.
