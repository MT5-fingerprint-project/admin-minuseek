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

export interface TenantUser {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  enabled: boolean
  emailVerified: boolean
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
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
})

export type CreateTenantInput = z.infer<typeof createTenantSchema>
export type CreateTenantUserInput = z.infer<typeof createTenantUserSchema>
