import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { TenantAdminAPI } from '@/features/tenants/services/TenantAdminAPI.services'
import type { CreateTenantInput } from '@/features/tenants/types/tenant'

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
