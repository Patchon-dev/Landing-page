import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import Input from '../../../lib/components/input/Input';
import Textarea from '../../../lib/components/input/Textarea';
import Switch from '../../../lib/components/Switch';
import { createUserSchema, initialUserValues } from './schema';
import './forms.css';

interface SubmitStatus { kind: 'success' | 'error'; message: string; details: string[] }

export default function UserForm({ simulateError }: { simulateError: boolean }) {
  const { t } = useTranslation();
  const form = useRef<HTMLFormElement>(null);
  const focusedSubmission = useRef(0);
  const formik = useFormik({
    initialValues: initialUserValues,
    validationSchema: createUserSchema(t),
    onSubmit: async (values, helpers) => {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 400));
      if (simulateError) {
        helpers.setFieldError('email', t('formsServerEmail'));
        helpers.setStatus({ kind: 'error', message: t('formsSubmitError'), details: [t('formsSimulatedReason'), t('formsServerEmail')] } satisfies SubmitStatus);
        return;
      }
      helpers.setStatus({ kind: 'success', message: t('formsSuccess', { name: values.name.trim() }), details: [t('formsSuccessEmail', { email: values.email.trim() })] } satisfies SubmitStatus);
    },
  });
  const labels = { name: t('name'), email: t('email'), password: t('formsPassword'), confirmPassword: t('formsConfirmPassword'), bio: t('formsBio'), accepted: t('formsAccepted') };
  const invalid = (field: keyof typeof labels) => Boolean(formik.touched[field] && formik.errors[field]);
  const errors = (Object.keys(labels) as (keyof typeof labels)[]).filter(invalid);
  const status = formik.status as SubmitStatus | undefined;

  useEffect(() => {
    if (!formik.isValidating && !formik.isSubmitting && formik.submitCount > focusedSubmission.current) {
      focusedSubmission.current = formik.submitCount;
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [formik.isValidating, formik.isSubmitting, formik.submitCount, formik.errors]);

  const attributes = (field: keyof typeof labels) => ({
    id: `user-form-${field}`,
    'aria-invalid': invalid(field) || undefined,
    'aria-describedby': invalid(field) ? `user-form-${field}-error` : field === 'password' ? 'user-form-password-hint' : undefined,
  });
  const error = (field: keyof typeof labels) => invalid(field) && <p id={`user-form-${field}-error`} className="user-form-field-error">{formik.errors[field]}</p>;

  return <form ref={form} className="user-form" noValidate onSubmit={formik.handleSubmit} aria-busy={formik.isSubmitting}
    onChangeCapture={() => { if (formik.status) formik.setStatus(undefined); }}>
    <header><h2>{t('formsUserTitle')}</h2><p>{t('formsUserIntro')}</p></header>
    {formik.submitCount > 0 && errors.length > 0 && status?.kind !== 'error' && <div className="user-form-result" data-kind="error" role="alert">
      <strong>{t('formsValidationError')}</strong><ul>{errors.map((field) => <li key={field}><a href={`#user-form-${field}`} onClick={(event) => { event.preventDefault(); document.getElementById(`user-form-${field}`)?.focus(); }}>{labels[field]}: {formik.errors[field]}</a></li>)}</ul>
    </div>}
    {status && <div className="user-form-result" data-kind={status.kind} role={status.kind === 'error' ? 'alert' : 'status'}>
      <strong>{status.message}</strong><ul>{status.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
    </div>}
    <fieldset disabled={formik.isSubmitting} className="user-form-fields">
      <div className="user-form-field"><label htmlFor="user-form-name">{labels.name} *</label><Input {...formik.getFieldProps('name')} {...attributes('name')} autoComplete="name" required />{error('name')}</div>
      <div className="user-form-field"><label htmlFor="user-form-email">{labels.email} *</label><Input {...formik.getFieldProps('email')} {...attributes('email')} type="email" autoComplete="email" required />{error('email')}</div>
      <div className="user-form-field"><label htmlFor="user-form-password">{labels.password} *</label><Input {...formik.getFieldProps('password')} {...attributes('password')} type="password" autoComplete="new-password" required /><p id="user-form-password-hint" className="user-form-hint">{t('formsPasswordHint')}</p>{error('password')}</div>
      <div className="user-form-field"><label htmlFor="user-form-confirmPassword">{labels.confirmPassword} *</label><Input {...formik.getFieldProps('confirmPassword')} {...attributes('confirmPassword')} type="password" autoComplete="new-password" required />{error('confirmPassword')}</div>
      <div className="user-form-field user-form-wide"><label htmlFor="user-form-bio">{labels.bio}</label><Textarea {...formik.getFieldProps('bio')} {...attributes('bio')} rows={3} />{error('bio')}</div>
      <div className="user-form-field user-form-wide"><div className="user-form-accept"><Switch {...attributes('accepted')} aria-label={labels.accepted} checked={formik.values.accepted}
        onBlur={() => { void formik.setFieldTouched('accepted', true); }} onCheckedChange={(checked) => { formik.setStatus(undefined); void formik.setFieldValue('accepted', checked); }} /><label htmlFor="user-form-accepted">{labels.accepted} *</label></div>{error('accepted')}</div>
    </fieldset>
    <footer><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { focusedSubmission.current = 0; formik.resetForm(); }} className="site-button" data-variant="outline" disabled={formik.isSubmitting}>{t('formsReset')}</button><button type="submit" className="site-button" data-variant="primary" disabled={formik.isSubmitting}>{t(formik.isSubmitting ? 'formsSubmitting' : 'formsSubmit')}</button></footer>
    <p className="user-form-hint">{t('formsPreviewNote')}</p>
  </form>;
}
