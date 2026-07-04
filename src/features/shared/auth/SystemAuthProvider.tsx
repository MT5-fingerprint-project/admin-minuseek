import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext, type AuthContextValue } from './auth-context'
import { getKeycloak, setActiveKeycloak } from './keycloak'

type SystemAuthProviderProps = {
  children: ReactNode
}

export function SystemAuthProvider({ children }: SystemAuthProviderProps) {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'connecting' | 'authenticated' | 'error'>('connecting')

  useEffect(() => {
    let isActive = true
    const { keycloak, initialization } = getKeycloak()

    initialization
      .then((authenticated) => {
        if (!authenticated) {
          void keycloak.login()
          return
        }
        setActiveKeycloak(keycloak)
        if (isActive) {
          setStatus('authenticated')
        }
      })
      .catch(() => {
        if (isActive) {
          setStatus('error')
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        {t(status === 'error' ? 'auth.error' : 'auth.connecting')}
      </div>
    )
  }

  const { keycloak } = getKeycloak()
  const value: AuthContextValue = {
    username: (keycloak.tokenParsed?.preferred_username as string | undefined) ?? undefined,
    email: (keycloak.tokenParsed?.email as string | undefined) ?? undefined,
    logout: () => {
      void keycloak.logout({ redirectUri: window.location.origin })
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
