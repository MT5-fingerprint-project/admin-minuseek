export const tenantAdminApiPaths = {
  tenants: '/organizations',
  tenant: (tenantSlug: string) => `/organizations/${tenantSlug}`,
  tenantUsers: (tenantSlug: string) => `/organizations/${tenantSlug}/users`,
  tenantUser: (tenantSlug: string, userId: string) => `/organizations/${tenantSlug}/users/${userId}`,
} as const
