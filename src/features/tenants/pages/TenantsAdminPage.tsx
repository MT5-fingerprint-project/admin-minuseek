import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminShell } from '@/features/tenants/components/AdminShell'
import { TenantCreateForm } from '@/features/tenants/components/TenantCreateForm'
import { TenantList } from '@/features/tenants/components/TenantList'
import { TenantUsersPanel } from '@/features/tenants/components/TenantUsersPanel'
import { useCreateTenant, useTenants } from '@/features/tenants/hooks/useTenants'
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
  const tenants = tenantsQuery.data ?? []
  const [selectedSlugOverride, setSelectedSlugOverride] = useState<string | null>(null)
  const selectedSlug = selectedSlugOverride ?? tenants[0]?.slug ?? null

  const selectedTenant = tenants.find((tenant) => tenant.slug === selectedSlug) ?? null

  async function handleCreateTenant(values: Parameters<typeof createTenant.mutateAsync>[0]) {
    const tenant = await createTenant.mutateAsync(values)
    setSelectedSlugOverride(tenant.slug)
  }

  function handleSelectTenant(tenant: Tenant) {
    setSelectedSlugOverride(tenant.slug)
  }

  return (
    <AdminShell>
      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-6 xl:grid-cols-[360px_1fr]">
        <section className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tenants.form.title')}</CardTitle>
              <CardDescription>{t('tenants.form.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <TenantCreateForm onSubmit={handleCreateTenant} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tenants.list.title')}</CardTitle>
              <CardDescription>{t('tenants.list.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <TenantList
                tenants={tenants}
                selectedSlug={selectedSlug}
                isLoading={tenantsQuery.isLoading}
                isError={tenantsQuery.isError}
                onRetry={() => tenantsQuery.refetch()}
                onSelect={handleSelectTenant}
              />
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>{selectedTenant?.displayName ?? t('tenants.detail.emptyTitle')}</CardTitle>
              <CardDescription>
                {selectedTenant ? t('tenants.detail.description') : t('tenants.detail.emptyDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTenant ? (
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
              ) : (
                <p className="text-sm text-muted-foreground">{t('tenants.detail.noSelection')}</p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('tenantUsers.list.title')}</CardTitle>
              <CardDescription>{t('tenantUsers.list.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <TenantUsersPanel tenant={selectedTenant} />
            </CardContent>
          </Card>
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
