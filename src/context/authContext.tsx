'use client'
import type { Session, User } from '@supabase/supabase-js'
import type { PropsWithChildren, SetStateAction } from 'react'
import React, { createContext, useEffect, useMemo, useState } from 'react'

import supabase from '@/libs/supabase/client'

export interface AuthContextValue {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  setUser: React.Dispatch<SetStateAction<User | null>>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
AuthContext.displayName = 'AuthContext'

export function AuthProvider({
  children,
  user: initialUser,
}: PropsWithChildren<Pick<AuthContextValue, 'user'>>) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const contextState: AuthContextValue = useMemo(
    () => ({
      user,
      setUser,
      session,
      isAuthenticated: !!user,
    }),
    [session, user]
  )

  return (
    <AuthContext.Provider value={contextState}>{children}</AuthContext.Provider>
  )
}
