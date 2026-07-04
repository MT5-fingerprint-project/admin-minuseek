import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'
import {
  createTenantSchema,
  type CreateTenantInput,
} from '@/features/tenants/types/tenant'

const DEFAULT_VALUES: CreateTenantInput = {
  slug: '',
  displayName: '',
}

type UseCreateTenantFormArgs = {
  onSubmit: (values: CreateTenantInput) => Promise<unknown> | unknown
  onSuccess?: () => void
}

export function useCreateTenantForm({ onSubmit, onSuccess }: UseCreateTenantFormArgs) {
  const { t } = useTranslation()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    validators: {
      onSubmit: createTenantSchema,
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
