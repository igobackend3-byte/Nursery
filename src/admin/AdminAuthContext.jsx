import { createContext, useContext, useState } from 'react';

// TEMPORARY auth, local-only. Once Firebase is connected (build plan
// Phase 2), this whole file gets replaced with real Firebase Auth
// (signInWithEmailAndPassword + a `staff` Firestore doc for the role) -
// nothing outside src/admin/ imports this, so that swap won't touch the
// storefront at all.
//
// Password lives here in plaintext because there is no backend yet to
// check it against - it is NOT real security, just a placeholder gate so
// the dashboard isn't wide open while you're still looking at it locally.
const TEMP_ADMIN_PASSWORD = 'igo-admin-2026';
const SESSION_KEY = 'igo-admin-session';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');

  function signIn(password) {
    if (password !== TEMP_ADMIN_PASSWORD) {
      return { ok: false, error: 'Incorrect password.' };
    }
    sessionStorage.setItem(SESSION_KEY, '1');
    setIsAuthed(true);
    return { ok: true };
  }

  function signOut() {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthed(false);
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthed, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}
