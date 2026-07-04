import { apiClient } from '@/features/shared/lib/apiClient'
import type {
  CreateTenantInput,
  CreateTenantUserInput,
  Tenant,
  TenantUser,
} from '@/features/tenants/types/tenant'
import { tenantAdminApiPaths } from './tenantAdminApiPaths'

interface TenantDTO {
  id: string
  slug: string
  display_name: string
  database_name: string
  identity_provider_realm: string
  created_at: string
  updated_at: string
}

interface TenantUserDTO {
  id: string
  username: string
  email: string
  first_name?: string | null
  last_name?: string | null
  enabled: boolean
  email_verified: boolean
}

interface ListResponseDTO<T> {
  data: T[]
}

function unwrapList<T>(payload: T[] | ListResponseDTO<T>): T[] {
  return Array.isArray(payload) ? payload : payload.data
}

function toTenant(dto: TenantDTO): Tenant {
  return {
    id: dto.id,
    slug: dto.slug,
    displayName: dto.display_name,
    databaseName: dto.database_name,
    identityProviderRealm: dto.identity_provider_realm,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  }
}

function toTenantUser(dto: TenantUserDTO): TenantUser {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    firstName: dto.first_name ?? undefined,
    lastName: dto.last_name ?? undefined,
    enabled: dto.enabled,
    emailVerified: dto.email_verified,
  }
}

export const TenantAdminAPI = {
  async listTenants(): Promise<Tenant[]> {
    const response = await apiClient.get<TenantDTO[] | ListResponseDTO<TenantDTO>>(tenantAdminApiPaths.tenants)
    return unwrapList(response.data).map(toTenant)
  },

  async createTenant(input: CreateTenantInput): Promise<Tenant> {
    const response = await apiClient.post<TenantDTO>(tenantAdminApiPaths.tenants, {
      slug: input.slug,
      display_name: input.displayName,
    })
    return toTenant(response.data)
  },

  async listTenantUsers(tenantSlug: string): Promise<TenantUser[]> {
    const response = await apiClient.get<TenantUserDTO[] | ListResponseDTO<TenantUserDTO>>(
      tenantAdminApiPaths.tenantUsers(tenantSlug)
    )
    return unwrapList(response.data).map(toTenantUser)
  },

  async createTenantUser(tenantSlug: string, input: CreateTenantUserInput): Promise<TenantUser> {
    const response = await apiClient.post<TenantUserDTO>(tenantAdminApiPaths.tenantUsers(tenantSlug), {
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName,
    })
    return toTenantUser(response.data)
  },
}
