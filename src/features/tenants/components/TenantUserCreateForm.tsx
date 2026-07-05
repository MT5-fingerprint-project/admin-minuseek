import { UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/features/shared/ui/button'
import { Field, FieldError, FieldLabel } from '@/features/shared/ui/field'
import { Input } from '@/features/shared/ui/input'
import { useCreateTenantUserForm } from '@/features/tenants/hooks/useCreateTenantUserForm'
import type { CreateTenantUserInput, Tenant } from '@/features/tenants/types/tenant'

type TenantUserCreateFormProps = {
  tenant: Tenant | null
  onSubmit: (values: CreateTenantUserInput) => Promise<unknown> | unknown
}

export function TenantUserCreateForm({ tenant, onSubmit }: TenantUserCreateFormProps) {
  const { t } = useTranslation()
  const isDisabled = !tenant

  async function handleSubmit(values: CreateTenantUserInput) {
    if (!tenant) {
      throw new Error(t('tenantUsers.errors.noTenant'))
    }
    await onSubmit(values)
  }

  const { form, submitError } = useCreateTenantUserForm({ onSubmit: handleSubmit })

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
      {tenant ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {t('tenantUsers.form.activeTenant')}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">{tenant.displayName}</p>
            <code className="rounded-3xl bg-background px-2 py-1 text-xs font-medium text-foreground">
              {tenant.slug}
            </code>
          </div>
        </div>
      ) : (
        <p className="rounded-2xl border bg-background p-3 text-sm text-muted-foreground">
          {t('tenantUsers.form.locked')}
        </p>
      )}

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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
              />
            </Field>
          )}
        />
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <Button type="submit" disabled={isDisabled || isSubmitting}>
            <UserPlus className="size-4" aria-hidden="true" />
            {isSubmitting ? t('tenantUsers.form.submitting') : t('tenantUsers.form.submit')}
          </Button>
        )}
      />
    </form>
  )
}
