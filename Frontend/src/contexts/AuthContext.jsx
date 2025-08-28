import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext(null);

// Hardcoded admin emails (optional). You can also store these in Firestore.
const ADMIN_EMAILS = [
  // Project admins
  'indiacustomerhelp05@gmail.com',
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' | 'user' | null
  const [loading, setLoading] = useState(true);
  const FIRESTORE_ENABLED = (() => {
    try { return import.meta?.env?.VITE_FIRESTORE_ENABLED === '1'; } catch (_) { return false; }
  })();

  // Ensure a user doc exists with a role; if not, assign based on ADMIN_EMAILS
  const ensureUserDoc = async (firebaseUser) => {
    if (!firebaseUser) return null;
    // Fast path: determine role without any Firestore read to avoid Listen RPC
    const derivedRole = ADMIN_EMAILS.includes((firebaseUser.email || '').toLowerCase()) ? 'admin' : 'user';
    // Fire-and-forget write to persist role; do not block login
    if (FIRESTORE_ENABLED) {
      try {
        await setDoc(
          doc(db, 'users', firebaseUser.uid),
          {
            uid: firebaseUser.uid,
            email: firebaseUser.email || null,
            displayName: firebaseUser.displayName || null,
            role: derivedRole,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (_) {
        // ignore
      }
    }
    return derivedRole;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      setUser(firebaseUser);
      try {
        const currentRole = await ensureUserDoc(firebaseUser);
        setRole(currentRole);
      } catch (_) {
        setRole('user');
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signupWithEmail = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const assignedRole = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';
    if (FIRESTORE_ENABLED) {
      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email,
          displayName: displayName || null,
          role: assignedRole,
          createdAt: new Date().toISOString(),
        });
      } catch (_err) {
        // Ignore Firestore failure: account creation is still valid
      }
    }
    return cred.user;
  };

  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    try { await ensureUserDoc(cred.user); } catch (_) {}
    return cred.user;
  };

  const logout = () => signOut(auth);

  const value = useMemo(
    () => ({ user, role, loading, signupWithEmail, loginWithEmail, loginWithGoogle, logout }),
    [user, role, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};



