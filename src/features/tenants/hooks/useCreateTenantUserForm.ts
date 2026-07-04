import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'
import {
  createTenantUserSchema,
  type CreateTenantUserInput,
} from '@/features/tenants/types/tenant'

const DEFAULT_VALUES: CreateTenantUserInput = {
  email: '',
  firstName: '',
  lastName: '',
}

type UseCreateTenantUserFormArgs = {
  onSubmit: (values: CreateTenantUserInput) => Promise<unknown> | unknown
  onSuccess?: () => void
}

export function useCreateTenantUserForm({ onSubmit, onSuccess }: UseCreateTenantUserFormArgs) {
  const { t } = useTranslation()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onSubmit: createTenantUserSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setSubmitError(null)
        await onSubmit(value)
        form.reset()
        onSuccess?.()
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : t('common.errors.generic'))
      }
    },
  })

  return { form, submitError }
}
