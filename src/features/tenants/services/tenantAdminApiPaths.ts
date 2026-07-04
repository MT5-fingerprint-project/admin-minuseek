export const tenantAdminApiPaths = {
  tenants: '/tenants',
  tenantUsers: (tenantSlug: string) => `/tenants/${tenantSlug}/users`,
} as const
