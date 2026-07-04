import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/features/shared/ui/badge'
import { Button } from '@/features/shared/ui/button'
import { Skeleton } from '@/features/shared/ui/skeleton'
import { TenantUserCreateForm } from '@/features/tenants/components/TenantUserCreateForm'
import {
  useCreateTenantUser,
  useTenantUsers,
} from '@/features/tenants/hooks/useTenants'
import type { Tenant } from '@/features/tenants/types/tenant'

type TenantUsersPanelProps = {
  tenant: Tenant | null
}

export function TenantUsersPanel({ tenant }: TenantUsersPanelProps) {
  const { t } = useTranslation()
  const usersQuery = useTenantUsers(tenant?.slug ?? null)
  const createUser = useCreateTenantUser(tenant?.slug ?? null)
  const users = usersQuery.data ?? []

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        {!tenant ? (
          <p className="rounded-2xl border bg-muted p-4 text-sm text-muted-foreground">
            {t('tenantUsers.list.noTenant')}
          </p>
        ) : usersQuery.isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : usersQuery.isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{t('tenantUsers.list.error')}</p>
            <Button className="mt-3" variant="outline" size="sm" onClick={() => usersQuery.refetch()}>
              <RefreshCw className="size-4" aria-hidden="true" />
              {t('common.actions.retry')}
            </Button>
          </div>
        ) : users.length === 0 ? (
          <p className="rounded-2xl border bg-muted p-4 text-sm text-muted-foreground">{t('tenantUsers.list.empty')}</p>
        ) : (
          <div className="grid gap-2">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border bg-card px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{user.username}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={user.enabled ? 'default' : 'secondary'}>
                      {user.enabled ? t('tenantUsers.status.enabled') : t('tenantUsers.status.disabled')}
                    </Badge>
                    <Badge variant={user.emailVerified ? 'default' : 'outline'}>
                      {user.emailVerified ? t('tenantUsers.status.verified') : t('tenantUsers.status.unverified')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-muted/40 p-4">
        <h3 className="text-sm font-medium">{t('tenantUsers.form.title')}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t('tenantUsers.form.description')}</p>
        <div className="mt-4">
          <TenantUserCreateForm
            disabled={!tenant}
            onSubmit={(values) => createUser.mutateAsync(values)}
          />
        </div>
      </div>
    </div>
  )
}
