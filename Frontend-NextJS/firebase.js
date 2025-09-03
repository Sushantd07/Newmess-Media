// Firebase initialization and exports (modular SDK v9+)
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase web app config
const firebaseConfig = {
    apiKey: "AIzaSyBYIV5O9PFuLiOQNgJpagUWp1LQDw50dto",
    authDomain: "newmess-media.firebaseapp.com",
    projectId: "newmess-media",
    storageBucket: "newmess-media.firebasestorage.app",
    messagingSenderId: "934033261665",
    appId: "1:934033261665:web:504e34398e318b8ad09620",
    measurementId: "G-1MHX3NRBQ1"

};

const app = initializeApp(firebaseConfig);

// Auth (with persistent session)
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});
const googleProvider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

export { app, auth, db, googleProvider };


