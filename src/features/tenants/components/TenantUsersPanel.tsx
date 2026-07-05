import { startTransition, useState } from 'react'
import { ChevronLeft, ChevronRight, Clipboard, KeyRound, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/features/shared/ui/badge'
import { Button } from '@/features/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/features/shared/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/shared/ui/select'
import { Skeleton } from '@/features/shared/ui/skeleton'
import { TenantUserCreateForm } from '@/features/tenants/components/TenantUserCreateForm'
import {
  useCreateTenantUser,
  useDeleteTenantUser,
  useTenantUsers,
} from '@/features/tenants/hooks/useTenants'
import type {
  CreatedTenantUser,
  CreateTenantUserInput,
  Tenant,
  TenantUser,
} from '@/features/tenants/types/tenant'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

type TenantUsersPanelProps = {
  tenant: Tenant | null
}

export function TenantUsersPanel({ tenant }: TenantUsersPanelProps) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createdUserState, setCreatedUserState] = useState<{
    tenantSlug: string
    user: CreatedTenantUser
  } | null>(null)
  const createUser = useCreateTenantUser(tenant?.slug ?? null)
  const deleteUser = useDeleteTenantUser(tenant?.slug ?? null)
  const usersQuery = useTenantUsers(tenant?.slug ?? null, { page, limit })
  const activeTenantSlug = tenant?.slug ?? null
  const createdUser = createdUserState?.tenantSlug === activeTenantSlug ? createdUserState.user : null
  const users = usersQuery.data?.data ?? []
  const meta = usersQuery.data?.meta
  const pageCount = Math.max(meta?.pageCount ?? 1, 1)
  const displayedPage = Math.min(page, pageCount)

  function handleLimitChange(value: string) {
    const nextLimit = Number(value)
    startTransition(() => {
      setLimit(nextLimit)
      setPage(1)
    })
  }

  async function handleCreateUser(values: CreateTenantUserInput) {
    const user = await createUser.mutateAsync(values)
    if (tenant) {
      setCreatedUserState({ tenantSlug: tenant.slug, user })
      setPage(1)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t('tenantUsers.pagination.total', {
            count: meta?.itemCount ?? users.length,
          })}
        </p>
        <Button type="button" disabled={!tenant} onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          {t('tenantUsers.actions.create')}
        </Button>
      </div>

      {createdUser && <CreatedUserCredentials user={createdUser} />}

      {!tenant ? (
        <p className="rounded-2xl border bg-muted p-4 text-sm text-muted-foreground">
          {t('tenantUsers.list.noTenant')}
        </p>
      ) : usersQuery.isLoading ? (
        <TenantUsersTableSkeleton />
      ) : usersQuery.isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{t('tenantUsers.list.error')}</p>
          <Button className="mt-3" variant="outline" size="sm" onClick={() => usersQuery.refetch()}>
            <RefreshCw className="size-4" aria-hidden="true" />
            {t('common.actions.retry')}
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border bg-background">
          <div className="overflow-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/95 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">{t('tenantUsers.table.user')}</th>
                  <th className="px-4 py-3 font-medium">{t('tenantUsers.table.name')}</th>
                  <th className="px-4 py-3 font-medium">{t('tenantUsers.table.status')}</th>
                  <th className="px-4 py-3 text-right font-medium">{t('tenantUsers.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted-foreground" colSpan={4}>
                      {t('tenantUsers.list.empty')}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-3 align-middle">
                        <p className="font-medium">{user.email}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{user.username}</p>
                      </td>
                      <td className="px-4 py-3 align-middle text-muted-foreground">
                        {[user.firstName, user.lastName].filter(Boolean).join(' ') || t('tenantUsers.table.noName')}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={user.enabled ? 'default' : 'secondary'}>
                            {user.enabled ? t('tenantUsers.status.enabled') : t('tenantUsers.status.disabled')}
                          </Badge>
                          <Badge variant={user.emailVerified ? 'default' : 'outline'}>
                            {user.emailVerified ? t('tenantUsers.status.verified') : t('tenantUsers.status.unverified')}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right align-middle">
                        <TenantUserDeleteDialog
                          tenant={tenant}
                          user={user}
                          isDeleting={deleteUser.isPending && deleteUser.variables === user.id}
                          onDelete={async () => {
                            await deleteUser.mutateAsync(user.id)
                            if (users.length === 1 && page > 1) {
                              setPage((currentPage) => currentPage - 1)
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {t('tenantUsers.pagination.current', {
                page: displayedPage,
                pageCount,
              })}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('tenantUsers.pagination.pageSize')}</span>
              <Select value={String(limit)} onValueChange={handleLimitChange}>
                <SelectTrigger size="sm" className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={!meta?.hasPreviousPage || usersQuery.isFetching}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                <span className="sr-only">{t('tenantUsers.pagination.previous')}</span>
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={!meta?.hasNextPage || usersQuery.isFetching}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
                <span className="sr-only">{t('tenantUsers.pagination.next')}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <TenantUserCreateDialog
        tenant={tenant}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateUser}
      />
    </div>
  )
}

function TenantUsersTableSkeleton() {
  return (
    <div className="grid gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-14 rounded-2xl" />
      ))}
    </div>
  )
}

type TenantUserCreateDialogProps = {
  tenant: Tenant | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (values: CreateTenantUserInput) => Promise<void>
}

function TenantUserCreateDialog({ tenant, open, onOpenChange, onCreate }: TenantUserCreateDialogProps) {
  const { t } = useTranslation()

  async function handleSubmit(values: CreateTenantUserInput) {
    await onCreate(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('tenantUsers.form.title')}</DialogTitle>
          <DialogDescription>{t('tenantUsers.form.description')}</DialogDescription>
        </DialogHeader>
        <TenantUserCreateForm key={tenant?.slug ?? 'no-tenant'} tenant={tenant} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

type TenantUserDeleteDialogProps = {
  tenant: Tenant
  user: TenantUser
  isDeleting: boolean
  onDelete: () => Promise<unknown>
}

function TenantUserDeleteDialog({ tenant, user, isDeleting, onDelete }: TenantUserDeleteDialogProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  async function handleDelete() {
    await onDelete()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="destructive" size="sm" onClick={() => setIsOpen(true)}>
        <Trash2 className="size-4" aria-hidden="true" />
        {t('tenantUsers.actions.delete')}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('tenantUsers.deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('tenantUsers.deleteDialog.description', {
              email: user.email,
              tenant: tenant.displayName,
              slug: tenant.slug,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting}>
              {t('common.actions.cancel')}
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" disabled={isDeleting} onClick={handleDelete}>
            <Trash2 className="size-4" aria-hidden="true" />
            {isDeleting ? t('tenantUsers.deleteDialog.deleting') : t('tenantUsers.deleteDialog.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type CreatedUserCredentialsProps = {
  user: CreatedTenantUser
}

function CreatedUserCredentials({ user }: CreatedUserCredentialsProps) {
  const { t } = useTranslation()
  const [isCopied, setIsCopied] = useState(false)

  async function handleCopyPassword() {
    if (!user.temporaryPassword) {
      return
    }
    await navigator.clipboard.writeText(user.temporaryPassword)
    setIsCopied(true)
  }

  return (
    <div className="rounded-3xl border border-primary/25 bg-primary/10 p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <KeyRound className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{t('tenantUsers.credentials.title')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('tenantUsers.credentials.description', { email: user.email })}
          </p>
          {user.temporaryPassword ? (
            <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
              <code className="break-all text-sm font-semibold">{user.temporaryPassword}</code>
              <Button type="button" variant="outline" size="sm" onClick={handleCopyPassword}>
                <Clipboard className="size-4" aria-hidden="true" />
                {isCopied ? t('common.actions.copied') : t('common.actions.copy')}
              </Button>
            </div>
          ) : (
            <p className="mt-3 rounded-2xl bg-background p-3 text-sm text-muted-foreground">
              {t('tenantUsers.credentials.existingUser')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
