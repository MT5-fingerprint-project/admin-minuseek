import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { TenantAdminAPI } from '@/features/tenants/services/TenantAdminAPI.services'
import type {
  CreateTenantInput,
  CreateTenantUserInput,
  PaginatedResult,
  Tenant,
  TenantUser,
  TenantUsersPagination,
} from '@/features/tenants/types/tenant'

export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  detail: (slug: string) => [...tenantKeys.all, 'detail', slug] as const,
  usersRoot: (slug: string) => [...tenantKeys.detail(slug), 'users'] as const,
  users: (slug: string, pagination: TenantUsersPagination) =>
    [...tenantKeys.usersRoot(slug), pagination.page, pagination.limit] as const,
}

export function useTenants() {
  return useQuery({
    queryKey: tenantKeys.lists(),
    queryFn: () => TenantAdminAPI.listTenants(),
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (input: CreateTenantInput) => TenantAdminAPI.createTenant(input),
    onSuccess: (tenant) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() })
      queryClient.setQueryData(tenantKeys.detail(tenant.slug), tenant)
      toast.success(t('tenants.success.created'))
    },
  })
}

export function useDeleteTenant() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (tenantSlug: string) => TenantAdminAPI.deleteTenant(tenantSlug),
    onSuccess: (_, tenantSlug) => {
      queryClient.setQueryData<Tenant[]>(tenantKeys.lists(), (currentTenants) =>
        currentTenants?.filter((tenant) => tenant.slug !== tenantSlug) ?? []
      )
      queryClient.removeQueries({ queryKey: tenantKeys.detail(tenantSlug) })
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() })
      toast.success(t('tenants.success.deleted'))
    },
    onError: () => {
      toast.error(t('tenants.errors.deleteFailed'))
    },
  })
}

export function useTenantUsers(
  tenantSlug: string | null,
  pagination: TenantUsersPagination,
  enabled = true
) {
  return useQuery({
    queryKey: tenantSlug ? tenantKeys.users(tenantSlug, pagination) : tenantKeys.users('none', pagination),
    queryFn: () => TenantAdminAPI.listTenantUsers(tenantSlug ?? '', pagination),
    enabled: !!tenantSlug && enabled,
    placeholderData: (previousData) => previousData,
  })
}

export function useCreateTenantUser(tenantSlug: string | null) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (input: CreateTenantUserInput) => {
      if (!tenantSlug) {
        throw new Error(t('tenantUsers.errors.noTenant'))
      }
      return TenantAdminAPI.createTenantUser(tenantSlug, input)
    },
    onSuccess: () => {
      if (tenantSlug) {
        queryClient.invalidateQueries({ queryKey: tenantKeys.usersRoot(tenantSlug) })
      }
      toast.success(t('tenantUsers.success.created'))
    },
  })
}

export function useDeleteTenantUser(tenantSlug: string | null) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (userId: string) => {
      if (!tenantSlug) {
        throw new Error(t('tenantUsers.errors.noTenant'))
      }
      return TenantAdminAPI.deleteTenantUser(tenantSlug, userId)
    },
    onSuccess: (_, userId) => {
      if (tenantSlug) {
        queryClient.setQueriesData<PaginatedResult<TenantUser>>(
          { queryKey: tenantKeys.usersRoot(tenantSlug) },
          (currentPage) =>
            currentPage
              ? {
                  ...currentPage,
                  data: currentPage.data.filter((user) => user.id !== userId),
                  meta: {
                    ...currentPage.meta,
                    itemCount: Math.max(0, currentPage.meta.itemCount - 1),
                  },
                }
              : currentPage
        )
        queryClient.invalidateQueries({ queryKey: tenantKeys.usersRoot(tenantSlug) })
      }
      toast.success(t('tenantUsers.success.deleted'))
    },
    onError: () => {
      toast.error(t('tenantUsers.errors.deleteFailed'))
    },
  })
}
