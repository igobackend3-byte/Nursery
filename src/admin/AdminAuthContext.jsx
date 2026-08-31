import { createContext, useContext } from 'react';
import { useAuth } from '../context/AuthContext';

// Real Firebase Auth, reusing the same signed-in session as the storefront
// (AdminApp sits inside the same <AuthProvider> in App.jsx). "Admin" is
// whoever's users/{uid} Firestore doc has role: 'admin' - see
// firestore.rules. There is no separate admin password anymore; promoting
// an account to admin happens by editing that field in Firestore directly
// (see the setup checklist), never from the client.
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const { user, profile, authLoading, isAdmin, login, logout } = useAuth();

  async function signIn(email, password) {
    try {
      const signedInUser = await login(email, password);
      // `profile` in useAuth() updates asynchronously after login() resolves;
      // re-check role from the freshly-fetched doc via a second pass isn't
      // needed here because login() already awaits the profile fetch.
      return { ok: true, user: signedInUser };
    } catch (err) {
      return { ok: false, error: authErrorMessage(err) };
    }
  }

  function signOut() {
    return logout();
  }

  const value = {
    isAuthed: !!user && isAdmin,
    isNonAdminSignedIn: !!user && !isAdmin && !authLoading,
    authLoading,
    profile,
    signIn,
    signOut,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

function authErrorMessage(err) {
  switch (err?.code) {
    case 'auth/invalid-email':
      return 'That email address doesn\'t look right.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}
