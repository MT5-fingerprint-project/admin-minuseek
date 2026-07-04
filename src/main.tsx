import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/index.css'

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <section className="w-full max-w-xl rounded-lg border bg-card p-8 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Minuseek</p>
        <h1 className="mt-3 text-3xl font-semibold">Admin Minuseek</h1>
        <p className="mt-4 text-muted-foreground">
          Console interne de gestion des tenants et des utilisateurs.
        </p>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
