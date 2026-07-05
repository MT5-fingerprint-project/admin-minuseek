import { apiClient } from '@/features/shared/lib/apiClient'
import type {
  CreatedTenantUser,
  CreateTenantInput,
  CreateTenantUserInput,
  PageMeta,
  PaginatedResult,
  Tenant,
  TenantUser,
  TenantUsersPagination,
} from '@/features/tenants/types/tenant'
import { tenantAdminApiPaths } from './tenantAdminApiPaths'

interface TenantDTO {
  id?: string
  slug: string
  displayName?: string
  display_name?: string
  databaseName?: string
  database_name?: string
  identityProviderRealm?: string
  identity_provider_realm?: string
  realm?: string
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
}

interface TenantUserDTO {
  id: string
  username: string
  email: string
  firstName?: string | null
  first_name?: string | null
  lastName?: string | null
  last_name?: string | null
  enabled: boolean
  emailVerified?: boolean
  email_verified?: boolean
  temporaryPassword?: string | null
  temporary_password?: string | null
}

interface ListResponseDTO<T> {
  data: T[]
}

interface PageMetaDTO {
  page?: number
  limit?: number
  itemCount?: number
  item_count?: number
  pageCount?: number
  page_count?: number
  hasPreviousPage?: boolean
  has_previous_page?: boolean
  hasNextPage?: boolean
  has_next_page?: boolean
}

interface PaginatedResponseDTO<T> {
  data: T[]
  meta: PageMetaDTO
}

function unwrapList<T>(payload: T[] | ListResponseDTO<T>): T[] {
  return Array.isArray(payload) ? payload : payload.data
}

function toTenant(dto: TenantDTO): Tenant {
  const createdAt = dto.createdAt ?? dto.created_at
  const updatedAt = dto.updatedAt ?? dto.updated_at

  return {
    id: dto.id ?? dto.slug,
    slug: dto.slug,
    displayName: dto.displayName ?? dto.display_name ?? dto.slug,
    databaseName: dto.databaseName ?? dto.database_name ?? '',
    identityProviderRealm:
      dto.identityProviderRealm ?? dto.identity_provider_realm ?? dto.realm ?? '',
    createdAt: createdAt ? new Date(createdAt) : new Date(),
    updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
  }
}

function toTenantUser(dto: TenantUserDTO): TenantUser {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    firstName: dto.firstName ?? dto.first_name ?? undefined,
    lastName: dto.lastName ?? dto.last_name ?? undefined,
    enabled: dto.enabled,
    emailVerified: dto.emailVerified ?? dto.email_verified ?? false,
  }
}

function toCreatedTenantUser(dto: TenantUserDTO): CreatedTenantUser {
  return {
    ...toTenantUser(dto),
    temporaryPassword: dto.temporaryPassword ?? dto.temporary_password ?? null,
  }
}

function toPageMeta(dto: PageMetaDTO | undefined, fallbackItemCount: number, pagination: TenantUsersPagination): PageMeta {
  const itemCount = dto?.itemCount ?? dto?.item_count ?? fallbackItemCount
  const page = dto?.page ?? pagination.page
  const limit = dto?.limit ?? pagination.limit
  const pageCount = dto?.pageCount ?? dto?.page_count ?? Math.ceil(itemCount / limit)

  return {
    page,
    limit,
    itemCount,
    pageCount,
    hasPreviousPage: dto?.hasPreviousPage ?? dto?.has_previous_page ?? page > 1,
    hasNextPage: dto?.hasNextPage ?? dto?.has_next_page ?? page < pageCount,
  }
}

function toTenantUserPage(
  payload: TenantUserDTO[] | PaginatedResponseDTO<TenantUserDTO>,
  pagination: TenantUsersPagination
): PaginatedResult<TenantUser> {
  if (Array.isArray(payload)) {
    return {
      data: payload.map(toTenantUser),
      meta: toPageMeta(undefined, payload.length, pagination),
    }
  }

  return {
    data: payload.data.map(toTenantUser),
    meta: toPageMeta(payload.meta, payload.data.length, pagination),
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
      displayName: input.displayName,
    })
    return toTenant(response.data)
  },

  async deleteTenant(tenantSlug: string): Promise<void> {
    await apiClient.delete(tenantAdminApiPaths.tenant(tenantSlug))
  },

  async listTenantUsers(
    tenantSlug: string,
    pagination: TenantUsersPagination
  ): Promise<PaginatedResult<TenantUser>> {
    const response = await apiClient.get<TenantUserDTO[] | PaginatedResponseDTO<TenantUserDTO>>(
      tenantAdminApiPaths.tenantUsers(tenantSlug),
      { params: pagination }
    )
    return toTenantUserPage(response.data, pagination)
  },

  async createTenantUser(tenantSlug: string, input: CreateTenantUserInput): Promise<CreatedTenantUser> {
    const response = await apiClient.post<TenantUserDTO>(tenantAdminApiPaths.tenantUsers(tenantSlug), {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
    })
    return toCreatedTenantUser(response.data)
  },

  async deleteTenantUser(tenantSlug: string, userId: string): Promise<void> {
    await apiClient.delete(tenantAdminApiPaths.tenantUser(tenantSlug, userId))
  },
}
