'use client'
import type { Session, User } from '@supabase/supabase-js'
import type { PropsWithChildren } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'

import supabase from '../libs/supabase'

export interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
AuthContext.displayName = 'AuthContext'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const getSession = async () => {
      try {
        setIsLoading(true)

        const { data } = await supabase.auth.getSession()

        setSession(data.session)
        setUser(data.session?.user ?? null)
      } catch (error) {
        throw new Error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

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
      session,
      isLoading,
      isAuthenticated: !isLoading && !!user,
    }),
    [isLoading, session, user]
  )

  return (
    <AuthContext.Provider value={contextState}>{children}</AuthContext.Provider>
  )
}
