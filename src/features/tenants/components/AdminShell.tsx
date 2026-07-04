import type { ReactNode } from 'react'
import { Building2, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/features/shared/auth/auth-context'
import { Button } from '@/features/shared/ui/button'

type AdminShellProps = {
  children: ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const { t } = useTranslation()
  const { email, username, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card px-5 py-6 lg:flex lg:flex-col">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Building2 className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t('app.title')}</p>
            <p className="text-xs text-muted-foreground">{t('app.eyebrow')}</p>
          </div>
        </div>

        <nav className="mt-10">
          <div className="rounded-2xl bg-muted px-3 py-2 text-sm font-medium">{t('navigation.tenants')}</div>
        </nav>

        <div className="mt-auto border-t pt-5">
          <p className="truncate text-sm font-medium">{username ?? t('auth.unknownUser')}</p>
          <p className="truncate text-xs text-muted-foreground">{email ?? t('auth.systemRealm')}</p>
          <Button className="mt-4 w-full justify-start" variant="outline" onClick={logout}>
            <LogOut className="size-4" aria-hidden="true" />
            {t('auth.logout')}
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b bg-background/95 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">{t('app.eyebrow')}</p>
              <h1 className="text-xl font-semibold">{t('navigation.tenants')}</h1>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="size-4" aria-hidden="true" />
              {t('auth.logout')}
            </Button>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
