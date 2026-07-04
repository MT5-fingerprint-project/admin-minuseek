import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/features/shared/ui/button'
import { Skeleton } from '@/features/shared/ui/skeleton'
import type { Tenant } from '@/features/tenants/types/tenant'

type TenantListProps = {
  tenants: Tenant[]
  selectedSlug: string | null
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onSelect: (tenant: Tenant) => void
}

export function TenantList({ tenants, selectedSlug, isLoading, isError, onRetry, onSelect }: TenantListProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="grid gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-16 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{t('tenants.list.error')}</p>
        <Button className="mt-3" variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="size-4" aria-hidden="true" />
          {t('common.actions.retry')}
        </Button>
      </div>
    )
  }

  if (tenants.length === 0) {
    return <p className="rounded-2xl border bg-muted p-4 text-sm text-muted-foreground">{t('tenants.list.empty')}</p>
  }

  return (
    <div className="grid gap-2">
      {tenants.map((tenant) => {
        const isSelected = tenant.slug === selectedSlug
        return (
          <button
            key={tenant.id}
            type="button"
            className="rounded-2xl border bg-card px-4 py-3 text-left transition hover:bg-muted data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
            data-selected={isSelected}
            onClick={() => onSelect(tenant)}
          >
            <span className="block text-sm font-medium">{tenant.displayName}</span>
            <span className="mt-1 block text-xs opacity-70">{tenant.slug}</span>
          </button>
        )
      })}
    </div>
  )
}
