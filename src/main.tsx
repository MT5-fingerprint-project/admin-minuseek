import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useTranslation } from 'react-i18next'
import './assets/css/index.css'
import './features/shared/lib/i18n'
import { SystemAuthProvider } from '@/features/shared/auth/SystemAuthProvider'
import { useAuth } from '@/features/shared/auth/auth-context'
import { queryClient } from '@/features/shared/lib/queryClient'
import { Button } from '@/features/shared/ui/button'
import { Toaster } from '@/features/shared/ui/sonner'

function AdminHomePage() {
  const { t } = useTranslation()
  const { logout } = useAuth()

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <section className="w-full max-w-xl rounded-lg border bg-card p-8 shadow-sm">
        <p className="text-sm uppercase text-muted-foreground">{t('app.eyebrow')}</p>
        <h1 className="mt-3 text-3xl font-semibold">{t('app.title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('app.description')}</p>
        <Button className="mt-6" variant="outline" onClick={logout}>
          {t('auth.logout')}
        </Button>
      </section>
    </main>
  )
}

const router = createBrowserRouter([{ path: '*', element: <AdminHomePage /> }])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SystemAuthProvider>
        <RouterProvider router={router} />
      </SystemAuthProvider>
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  </StrictMode>
)
