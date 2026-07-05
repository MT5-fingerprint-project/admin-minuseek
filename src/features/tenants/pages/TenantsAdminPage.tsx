import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminShell } from '@/features/tenants/components/AdminShell'
import { TenantDangerZone } from '@/features/tenants/components/TenantDangerZone'
import { TenantNavigation } from '@/features/tenants/components/TenantNavigation'
import { TenantUsersPanel } from '@/features/tenants/components/TenantUsersPanel'
import { useCreateTenant, useDeleteTenant, useTenants } from '@/features/tenants/hooks/useTenants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/ui/card'
import type { Tenant } from '@/features/tenants/types/tenant'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default function TenantsAdminPage() {
  const { t } = useTranslation()
  const tenantsQuery = useTenants()
  const createTenant = useCreateTenant()
  const deleteTenant = useDeleteTenant()
  const tenants = tenantsQuery.data ?? []
  const [selectedSlugOverride, setSelectedSlugOverride] = useState<string | null>(null)
  const selectedTenant = tenants.find((tenant) => tenant.slug === selectedSlugOverride) ?? tenants[0] ?? null
  const selectedSlug = selectedTenant?.slug ?? null

  async function handleCreateTenant(values: Parameters<typeof createTenant.mutateAsync>[0]) {
    const tenant = await createTenant.mutateAsync(values)
    setSelectedSlugOverride(tenant.slug)
    return tenant
  }

  function handleSelectTenant(tenant: Tenant) {
    setSelectedSlugOverride(tenant.slug)
  }

  async function handleDeleteTenant(tenant: Tenant) {
    await deleteTenant.mutateAsync(tenant.slug)
    setSelectedSlugOverride(null)
  }

  return (
    <AdminShell
      sidebarNavigation={
        <TenantNavigation
          tenants={tenants}
          selectedSlug={selectedSlug}
          isLoading={tenantsQuery.isLoading}
          isError={tenantsQuery.isError}
          onRetry={() => tenantsQuery.refetch()}
          onSelect={handleSelectTenant}
          onCreate={handleCreateTenant}
        />
      }
    >
      <main className="mx-auto grid max-w-5xl gap-6 px-5 py-6">
        <section className="grid gap-6">
          {selectedTenant ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{selectedTenant.displayName}</CardTitle>
                  <CardDescription>{t('tenants.detail.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-4 md:grid-cols-2">
                    <TenantDetailItem label={t('tenants.fields.slug')} value={selectedTenant.slug} />
                    <TenantDetailItem label={t('tenants.fields.databaseName')} value={selectedTenant.databaseName} />
                    <TenantDetailItem
                      label={t('tenants.fields.realm')}
                      value={selectedTenant.identityProviderRealm}
                    />
                    <TenantDetailItem
                      label={t('tenants.fields.createdAt')}
                      value={dateFormatter.format(selectedTenant.createdAt)}
                    />
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('tenantUsers.list.title')}</CardTitle>
                  <CardDescription>
                    {t('tenantUsers.list.description', {
                      tenant: selectedTenant.displayName,
                      slug: selectedTenant.slug,
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TenantUsersPanel key={selectedTenant.slug} tenant={selectedTenant} />
                </CardContent>
              </Card>

              <TenantDangerZone
                tenant={selectedTenant}
                isDeleting={deleteTenant.isPending && deleteTenant.variables === selectedTenant.slug}
                onDelete={() => handleDeleteTenant(selectedTenant)}
              />
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('tenants.detail.emptyTitle')}</CardTitle>
                <CardDescription>{t('tenants.detail.emptyDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t('tenants.detail.noSelection')}</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </AdminShell>
  )
}

function TenantDetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-muted/40 p-4">
      <dt className="text-xs uppercase text-muted-foreground">{label}</dt>
      <dd className="mt-2 break-words text-sm font-medium">{value}</dd>
    </div>
  )
}
