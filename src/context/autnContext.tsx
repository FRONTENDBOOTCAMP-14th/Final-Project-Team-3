'use client'
import type { Session, User } from '@supabase/supabase-js'
import type { PropsWithChildren, SetStateAction } from 'react'
import React, { createContext, useEffect, useMemo, useState } from 'react'

import type { Profile } from '../libs/supabase'
import supabase from '../libs/supabase/client'

export interface AuthContextValue {
  user: User | null
  profile: Profile | null
  session: Session | null
  isAuthenticated: boolean
  setUser: React.Dispatch<SetStateAction<User | null>>
  setProfile: React.Dispatch<SetStateAction<Profile | null>>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
AuthContext.displayName = 'AuthContext'

export function AuthProvider({
  children,
  user: initialUser,
}: PropsWithChildren<Pick<AuthContextValue, 'user'>>) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        const currentUser = session?.user

        if (!currentUser) {
          setProfile(null)
          return
        }
        const { data: profileData, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (profileError) {
          setProfile(null)
          throw new Error(profileError.message)
        }

        setProfile(profileData)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [setSession, setUser, setProfile])

  const contextState: AuthContextValue = useMemo(
    () => ({
      user,
      profile,
      setUser,
      session,
      isAuthenticated: !!user,
      setProfile,
    }),
    [profile, session, user]
  )

  return (
    <AuthContext.Provider value={contextState}>{children}</AuthContext.Provider>
  )
}
