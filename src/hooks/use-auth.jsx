"use client"

import { useState, useEffect, createContext, useContext } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../lib/firebase"

const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email, password, rememberMe = false) => {
    // Set the persistence type based on the rememberMe checkbox
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistenceType)
    return await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email, password, displayName) => {
    // For new sign ups, we'll use session persistence by default
    await setPersistence(auth, browserSessionPersistence)

    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update the user's profile with display name
      await updateProfile(user, {
        displayName: displayName,
      })

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
        provider: "email",
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        // Add any other user metadata you want to store
        preferences: {
          theme: "light",
          notifications: true,
          newsletter: false,
        },
        profile: {
          firstName: displayName.split(" ")[0] || "",
          lastName: displayName.split(" ").slice(1).join(" ") || "",
          company: "",
          role: "",
          phone: "",
        },
        subscription: {
          plan: "free",
          status: "active",
          billingCycle: "monthly",
          createdAt: new Date(),
        },
        invoices: [],
      })

      return userCredential
    } catch (error) {
      console.error("Error during sign up:", error)
      throw error
    }
  }

  const signInWithGoogle = async (rememberMe = false) => {
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistenceType)

    try {
      const provider = new GoogleAuthProvider()
      // Request additional scopes if needed
      provider.addScope("profile")
      provider.addScope("email")

      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if this is a new user or existing user
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        // New user - save their data to Firestore
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
          updatedAt: new Date(),
          provider: "google",
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          preferences: {
            theme: "light",
            notifications: true,
            newsletter: false,
          },
          profile: {
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
            company: "",
            role: "",
            phone: user.phoneNumber || "",
          },
          subscription: {
            plan: "free",
            status: "active",
            billingCycle: "monthly",
            createdAt: new Date(),
          },
          invoices: [],
        })
      } else {
        // Existing user - update their last login and any changed info
        await setDoc(
          userDocRef,
          {
            lastLoginAt: new Date(),
            updatedAt: new Date(),
            // Update display name and photo if they changed
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
          },
          { merge: true },
        )
      }

      return result
    } catch (error) {
      console.error("Error during Google sign in:", error)
      throw error
    }
  }

  const signInWithGithub = async (rememberMe = false) => {
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistenceType)

    try {
      const provider = new GithubAuthProvider()
      provider.addScope("user:email")

      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if this is a new user or existing user
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        // New user - save their data to Firestore
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
          updatedAt: new Date(),
          provider: "github",
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          preferences: {
            theme: "light",
            notifications: true,
            newsletter: false,
          },
          profile: {
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
            company: "",
            role: "",
            phone: "",
          },
          subscription: {
            plan: "free",
            status: "active",
            billingCycle: "monthly",
            createdAt: new Date(),
          },
          invoices: [],
        })
      } else {
        // Existing user - update their last login
        await setDoc(
          userDocRef,
          {
            lastLoginAt: new Date(),
            updatedAt: new Date(),
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
          },
          { merge: true },
        )
      }

      return result
    } catch (error) {
      console.error("Error during GitHub sign in:", error)
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        return userDoc.data()
      }
      return null
    } catch (error) {
      console.error("Error getting user profile:", error)
      return null
    }
  }

  const updateUserProfile = async (uid, profileData) => {
    try {
      await setDoc(
        doc(db, "users", uid),
        {
          ...profileData,
          updatedAt: new Date(),
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    logout,
    getUserProfile,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
