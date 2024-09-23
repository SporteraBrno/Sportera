import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Successfully signed in:", user);
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};