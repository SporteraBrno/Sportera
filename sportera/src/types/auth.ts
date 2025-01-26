export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: 'google.com';
  createdAt: Date;
  lastLoginAt: Date;
  favorites?: string[]; // Pro budoucí funkcionalitu oblíbených míst
  ratings?: {
    [placeId: string]: {
      rating: number;
      timestamp: Date;
    };
  }; // Pro budoucí funkcionalitu hodnocení
}

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}