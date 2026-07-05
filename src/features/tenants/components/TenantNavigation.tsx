import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/features/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/ui/dialog'
import { TenantCreateForm } from '@/features/tenants/components/TenantCreateForm'
import { TenantList } from '@/features/tenants/components/TenantList'
import type { CreateTenantInput, Tenant } from '@/features/tenants/types/tenant'

type TenantNavigationProps = {
  tenants: Tenant[]
  selectedSlug: string | null
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onSelect: (tenant: Tenant) => void
  onCreate: (values: CreateTenantInput) => Promise<unknown> | unknown
}

export function TenantNavigation({
  tenants,
  selectedSlug,
  isLoading,
  isError,
  onRetry,
  onSelect,
  onCreate,
}: TenantNavigationProps) {
  const { t } = useTranslation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  async function handleCreateTenant(values: CreateTenantInput) {
    await onCreate(values)
    setIsCreateOpen(false)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t('tenants.sidebar.eyebrow')}
        </p>
        <h2 className="mt-2 text-base font-semibold">{t('tenants.sidebar.title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('tenants.sidebar.description')}</p>
      </div>

      <div className="-mx-2 mt-4 min-h-0 flex-1 overflow-y-auto px-2">
        <TenantList
          tenants={tenants}
          selectedSlug={selectedSlug}
          isLoading={isLoading}
          isError={isError}
          onRetry={onRetry}
          onSelect={onSelect}
        />
      </div>

      <div className="mt-4 border-t pt-4">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="size-4" aria-hidden="true" />
              {t('tenants.sidebar.createTenant')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('tenants.createDialog.title')}</DialogTitle>
              <DialogDescription>{t('tenants.createDialog.description')}</DialogDescription>
            </DialogHeader>
            <TenantCreateForm onSubmit={handleCreateTenant} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
