import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './assets/css/index.css'
import './features/shared/lib/i18n'
import { SystemAuthProvider } from '@/features/shared/auth/SystemAuthProvider'
import { queryClient } from '@/features/shared/lib/queryClient'
import { Toaster } from '@/features/shared/ui/sonner'
import TenantsAdminPage from '@/features/tenants/pages/TenantsAdminPage'

const router = createBrowserRouter([{ path: '*', element: <TenantsAdminPage /> }])

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
