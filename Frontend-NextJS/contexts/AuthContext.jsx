import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  'newmess1231@gmail.com',
  'abhishekuniyal282@gmail.com',
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
    
    const userEmail = firebaseUser.email || '';
    const lowerEmail = userEmail.toLowerCase();
    const derivedRole = ADMIN_EMAILS.includes(lowerEmail) ? 'admin' : 'user';
    
    console.log('[AuthContext] ensureUserDoc:', {
      email: userEmail,
      lowerEmail,
      isAdminEmail: ADMIN_EMAILS.includes(lowerEmail),
      derivedRole,
      adminEmails: ADMIN_EMAILS
    });
    
    // Fire-and-forget write to persist role; do not block login
    if (FIRESTORE_ENABLED) {
      try {
        await setDoc(
          doc(db, 'users', firebaseUser.uid),
          {
            uid: firebaseUser.uid,
            email: userEmail,
            displayName: firebaseUser.displayName || null,
            role: derivedRole,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log('[AuthContext] User doc saved to Firestore');
      } catch (error) {
        console.error('[AuthContext] Error saving user doc to Firestore:', error);
      }
    }
    
    return derivedRole;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthContext] Auth state changed:', firebaseUser?.email);
      
      if (!firebaseUser) {
        console.log('[AuthContext] No user, clearing state');
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      
      console.log('[AuthContext] User found, setting user state');
      setUser(firebaseUser);
      
      try {
        console.log('[AuthContext] Ensuring user doc and role...');
        const currentRole = await ensureUserDoc(firebaseUser);
        console.log('[AuthContext] Role assigned:', currentRole);
        setRole(currentRole);
      } catch (error) {
        console.error('[AuthContext] Error ensuring user doc:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    });
    // Handle redirect sign-in result (if popup blocked)
    (async () => {
      try {
        const res = await getRedirectResult(auth);
        if (res?.user) {
          console.log('[AuthContext] Redirect result found:', res.user.email);
          const role = await ensureUserDoc(res.user);
          console.log('[AuthContext] Redirect user role assigned:', role);
        }
      } catch (error) {
        console.error('[AuthContext] Error handling redirect result:', error);
      }
    })();
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
    try {
      // Check if popup is likely to be blocked
      const isPopupBlocked = () => {
        try {
          // Test if we can open a popup
          const testPopup = window.open('', '_blank', 'width=1,height=1');
          if (testPopup) {
            testPopup.close();
            return false;
          }
          return true;
        } catch {
          return true;
        }
      };

      // Check for COOP policy or popup blocking
      const shouldUseRedirect = isPopupBlocked() || 
        window.navigator.userAgent.includes('Safari') || // Safari has stricter COOP
        window.navigator.userAgent.includes('Firefox'); // Firefox has COOP issues

      if (shouldUseRedirect) {
        console.log('[AuthContext] Using redirect flow (popup likely blocked or COOP issue)');
        await signInWithRedirect(auth, googleProvider);
        return null; // Will be handled by redirect result
      }

      // Try popup with better error handling
      try {
        const cred = await signInWithPopup(auth, googleProvider);
        console.log('[AuthContext] Google sign-in successful:', cred.user.email);
        try { 
          const role = await ensureUserDoc(cred.user);
          console.log('[AuthContext] User role assigned:', role);
        } catch (error) {
          console.error('[AuthContext] Error ensuring user doc:', error);
        }
        return cred.user;
      } catch (popupError) {
        console.error('[AuthContext] Google popup failed:', popupError);
        
        // Check if it's a COOP or popup blocked error
        const isPopupBlockedError = popupError.code === 'auth/popup-blocked' || 
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.message.includes('Cross-Origin-Opener-Policy') ||
          popupError.message.includes('COOP');
        
        if (isPopupBlockedError) {
          console.log('[AuthContext] Popup blocked, falling back to redirect');
          await signInWithRedirect(auth, googleProvider);
          return null; // Will be handled by redirect result
        }
        
        throw popupError;
      }
    } catch (error) {
      console.error('[AuthContext] Google authentication failed:', error);
      
      // Final fallback to redirect
      if (error.code !== 'auth/popup-closed-by-user') {
        try {
          console.log('[AuthContext] Final fallback to redirect');
          await signInWithRedirect(auth, googleProvider);
          return null;
        } catch (redirectError) {
          console.error('[AuthContext] All Google auth methods failed:', redirectError);
          throw error; // Throw original error
        }
      }
      
      throw error;
    }
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



