import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/features/shared/ui/button'
import { Field, FieldError, FieldLabel } from '@/features/shared/ui/field'
import { Input } from '@/features/shared/ui/input'
import { useCreateTenantForm } from '@/features/tenants/hooks/useCreateTenantForm'
import type { CreateTenantInput } from '@/features/tenants/types/tenant'

type TenantCreateFormProps = {
  onSubmit: (values: CreateTenantInput) => Promise<unknown> | unknown
}

export function TenantCreateForm({ onSubmit }: TenantCreateFormProps) {
  const { t } = useTranslation()
  const { form, submitError } = useCreateTenantForm({ onSubmit })

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="slug"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t('tenants.form.fields.slug.label')}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder={t('tenants.form.fields.slug.placeholder')}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />

      <form.Field
        name="displayName"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t('tenants.form.fields.displayName.label')}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder={t('tenants.form.fields.displayName.placeholder')}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting}>
            <Plus className="size-4" aria-hidden="true" />
            {isSubmitting ? t('tenants.form.submitting') : t('tenants.form.submit')}
          </Button>
        )}
      />
    </form>
  )
}
