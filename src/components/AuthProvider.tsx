import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Define the types for your user and auth context
type User = {
  uid: string;
  email: string | null;
  fullName: string | null;
};

type AuthContextType = {
  user: User | null;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Create the initial context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ uid: user.uid, email: user.email, fullName: user.displayName });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, fullName: string) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's profile with full name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Create a new user document in Firestore
      const userRef = collection(db, "users");
      await addDoc(userRef, {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        fullName,
      });

      // Update the user state
      setUser({ uid: userCredential.user.uid, email: userCredential.user.email, fullName });
    } catch (error: any) {
      throw new Error(`Failed to register: ${(error as Error).message}`);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(`Failed to login: ${(error as Error).message}`);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(`Failed to logout: ${(error as Error).message}`);
    }
  };

  const authContextValue: AuthContextType = {
    user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
