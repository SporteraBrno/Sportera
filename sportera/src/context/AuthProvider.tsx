// src/context/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AuthContextType, UserProfile } from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Načtení nebo vytvoření uživatelského profilu
        const userDoc = doc(db, 'users', firebaseUser.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          // Aktualizace lastLoginAt
          const userData = userSnapshot.data() as UserProfile;
          await setDoc(userDoc, { lastLoginAt: serverTimestamp() }, { merge: true });
          setUser(userData);
        } else {
          // Vytvoření nového profilu
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            provider: 'google.com',
            createdAt: new Date(),
            lastLoginAt: new Date(),
            favorites: [],
            ratings: {}
          };
          await setDoc(userDoc, newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Nastavení vlastností pro popup
      provider.setCustomParameters({
        prompt: 'select_account'  // Vždy zobrazí výběr účtu
      });
      
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Lepší zpracování chyb
      if (error.code === 'auth/popup-blocked') {
        alert('Prosím povolte vyskakovací okna pro tuto stránku');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Uživatel zavřel popup, nemusíme nic dělat
      } else if (error.code === 'auth/unauthorized-domain') {
        alert('Tato doména není povolena pro přihlášení. Kontaktujte správce.');
      } else {
        alert('Přihlášení selhalo. Zkuste to prosím později.');
      }
      
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;