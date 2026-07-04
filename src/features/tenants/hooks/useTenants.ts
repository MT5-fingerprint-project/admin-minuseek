import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { TenantAdminAPI } from '@/features/tenants/services/TenantAdminAPI.services'
import type {
  CreateTenantInput,
  CreateTenantUserInput,
} from '@/features/tenants/types/tenant'

export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  detail: (slug: string) => [...tenantKeys.all, 'detail', slug] as const,
  users: (slug: string) => [...tenantKeys.detail(slug), 'users'] as const,
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

export function useTenantUsers(tenantSlug: string | null) {
  return useQuery({
    queryKey: tenantSlug ? tenantKeys.users(tenantSlug) : tenantKeys.users('none'),
    queryFn: () => TenantAdminAPI.listTenantUsers(tenantSlug ?? ''),
    enabled: !!tenantSlug,
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
        queryClient.invalidateQueries({ queryKey: tenantKeys.users(tenantSlug) })
      }
      toast.success(t('tenantUsers.success.created'))
    },
  })
}
