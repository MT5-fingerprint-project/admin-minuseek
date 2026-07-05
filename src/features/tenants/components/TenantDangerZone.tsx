import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/features/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/ui/dialog'
import { Field, FieldDescription, FieldLabel } from '@/features/shared/ui/field'
import { Input } from '@/features/shared/ui/input'
import type { Tenant } from '@/features/tenants/types/tenant'

type TenantDangerZoneProps = {
  tenant: Tenant
  isDeleting: boolean
  onDelete: () => Promise<unknown>
}

export function TenantDangerZone({ tenant, isDeleting, onDelete }: TenantDangerZoneProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const isConfirmed = confirmation.trim() === tenant.slug

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen)
    if (!nextOpen) {
      setConfirmation('')
    }
  }

  async function handleDelete() {
    await onDelete()
    handleOpenChange(false)
  }

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive">{t('tenants.danger.title')}</CardTitle>
        <CardDescription>{t('tenants.danger.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-destructive/20 bg-background p-4">
          <div>
            <p className="text-sm font-medium">{t('tenants.danger.deleteTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('tenants.danger.deleteDescription', { slug: tenant.slug })}
            </p>
          </div>

          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="size-4" aria-hidden="true" />
                {t('tenants.danger.deleteButton')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('tenants.deleteDialog.title')}</DialogTitle>
                <DialogDescription>
                  {t('tenants.deleteDialog.description', {
                    name: tenant.displayName,
                    slug: tenant.slug,
                  })}
                </DialogDescription>
              </DialogHeader>

              <Field>
                <FieldLabel htmlFor="delete-tenant-confirmation">
                  {t('tenants.deleteDialog.confirmationLabel')}
                </FieldLabel>
                <Input
                  id="delete-tenant-confirmation"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  placeholder={tenant.slug}
                  disabled={isDeleting}
                />
                <FieldDescription>
                  {t('tenants.deleteDialog.confirmationHelp', { slug: tenant.slug })}
                </FieldDescription>
              </Field>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isDeleting}>
                    {t('common.actions.cancel')}
                  </Button>
                </DialogClose>
                <Button type="button" variant="destructive" disabled={!isConfirmed || isDeleting} onClick={handleDelete}>
                  <Trash2 className="size-4" aria-hidden="true" />
                  {isDeleting ? t('tenants.deleteDialog.deleting') : t('tenants.deleteDialog.confirm')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
