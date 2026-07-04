import { UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/features/shared/ui/button'
import { Field, FieldError, FieldLabel } from '@/features/shared/ui/field'
import { Input } from '@/features/shared/ui/input'
import { useCreateTenantUserForm } from '@/features/tenants/hooks/useCreateTenantUserForm'
import type { CreateTenantUserInput } from '@/features/tenants/types/tenant'

type TenantUserCreateFormProps = {
  disabled: boolean
  onSubmit: (values: CreateTenantUserInput) => Promise<unknown> | unknown
}

export function TenantUserCreateForm({ disabled, onSubmit }: TenantUserCreateFormProps) {
  const { t } = useTranslation()
  const { form, submitError } = useCreateTenantUserForm({ onSubmit })

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
        name="email"
        children={(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>{t('tenantUsers.form.fields.email.label')}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder={t('tenantUsers.form.fields.email.placeholder')}
                aria-invalid={isInvalid}
                disabled={disabled}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <form.Field
          name="firstName"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{t('tenantUsers.form.fields.firstName.label')}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder={t('tenantUsers.form.fields.firstName.placeholder')}
                disabled={disabled}
              />
            </Field>
          )}
        />

        <form.Field
          name="lastName"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{t('tenantUsers.form.fields.lastName.label')}</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder={t('tenantUsers.form.fields.lastName.placeholder')}
                disabled={disabled}
              />
            </Field>
          )}
        />
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <Button type="submit" disabled={disabled || isSubmitting}>
            <UserPlus className="size-4" aria-hidden="true" />
            {isSubmitting ? t('tenantUsers.form.submitting') : t('tenantUsers.form.submit')}
          </Button>
        )}
      />
    </form>
  )
}
