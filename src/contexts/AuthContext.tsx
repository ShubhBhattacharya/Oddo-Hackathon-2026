import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              ...docSnap.data(),
            } as User)
          } else {
            // If no user doc doesn't exist, still create a minimal user object
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'FleetManager',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            })
          }
        } catch (error) {
          console.error('Error getting user document:', error)
          // Fallback to minimal user object
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: 'FleetManager',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
