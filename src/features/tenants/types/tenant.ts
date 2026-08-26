import { z } from 'zod'
import i18n from '@/features/shared/lib/i18n'

export interface Tenant {
  id: string
  slug: string
  displayName: string
  databaseName: string
  identityProviderRealm: string
  createdAt: Date
  updatedAt: Date
}

export const TENANT_USER_ROLES = ['ADMIN', 'OPERATOR', 'EXPERT'] as const

export type TenantUserRole = (typeof TENANT_USER_ROLES)[number]

/** EXPERT reste en base mais ne s'attribue plus : le mode expert se déclare sur un dossier. */
export const CREATABLE_TENANT_USER_ROLES = ['ADMIN', 'OPERATOR'] as const satisfies readonly TenantUserRole[]

export interface TenantUser {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  role?: TenantUserRole
  enabled: boolean
  emailVerified: boolean
}

export interface CreatedTenantUser extends TenantUser {
  temporaryPassword: string | null
}

export interface PageMeta {
  page: number
  limit: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  meta: PageMeta
}

export interface TenantUsersPagination {
  page: number
  limit: number
}

export const createTenantSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, i18n.t('tenants.validation.slugRequired'))
    .regex(/^[a-z0-9][a-z0-9-]*$/, i18n.t('tenants.validation.slugInvalid')),
  displayName: z.string().trim().min(1, i18n.t('tenants.validation.displayNameRequired')),
})

export const createTenantUserSchema = z.object({
  email: z.string().trim().email(i18n.t('tenantUsers.validation.emailInvalid')),
  firstName: z.string().trim().min(1, i18n.t('tenantUsers.validation.firstNameRequired')),
  lastName: z.string().trim().min(1, i18n.t('tenantUsers.validation.lastNameRequired')),
  role: z.enum(CREATABLE_TENANT_USER_ROLES, { message: i18n.t('tenantUsers.validation.roleRequired') }),
  grade: z.string().trim().min(1, i18n.t('tenantUsers.validation.gradeRequired')),
  serviceNumber: z.string().trim().min(1, i18n.t('tenantUsers.validation.serviceNumberRequired')),
})

export type CreateTenantInput = z.infer<typeof createTenantSchema>
export type CreateTenantUserInput = z.infer<typeof createTenantUserSchema>

/** Le formulaire part sans rôle choisi, ce que le schéma refuse : les deux types diffèrent sur ce seul champ. */
export type CreateTenantUserFormValues = Omit<CreateTenantUserInput, 'role'> & {
  role: CreateTenantUserInput['role'] | ''
}
