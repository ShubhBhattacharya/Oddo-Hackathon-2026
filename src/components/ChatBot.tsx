import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

declare global {
  interface Window {
    chatbase?: {
      (...args: unknown[]): void
      q: unknown[]
      getState(): string
    }
  }
}

export default function ChatBot() {
  const { user } = useAuth()

  useEffect(() => {
    if (user && window.chatbase) {
      // Identify the user with ChatBase
      // Note: For full JWT-based authentication, you'll need a backend endpoint
      // to generate signed tokens. This is a basic client-side implementation.
      window.chatbase('identify', {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      })
    }
  }, [user])

  return null // This component doesn't render anything
}
