import CodeBlock from '../../../lib/components/code/CodeBlock';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Switch from '../../../lib/components/Switch';
import UserForm from './UserForm';

export default function FormsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [simulateError, setSimulateError] = useState(false);
  const example = `const formik = useFormik({
  initialValues: { name: '', email: '' },
  validationSchema: yup.object({
    name: yup.string().trim().min(2).required(),
    email: yup.string().email().required(),
  }),
  onSubmit: async (values, helpers) => {
    try {
      // Call your API here.
      helpers.setStatus({ kind: 'success', message: 'User created' });
    } catch (error) {
      helpers.setStatus({ kind: 'error', message: String(error) });
    }
  },
});

<form noValidate onSubmit={formik.handleSubmit}>
  <Input
    {...formik.getFieldProps('name')}
    aria-label="Name"
    aria-invalid={Boolean(formik.touched.name && formik.errors.name)}
    aria-describedby="name-error"
  />
  {formik.touched.name && formik.errors.name && (
    <p id="name-error">{formik.errors.name}</p>
  )}
  <Input
    {...formik.getFieldProps('email')}
    aria-label="Email"
    aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
    aria-describedby="email-error"
  />
  {formik.touched.email && formik.errors.email && (
    <p id="email-error">{formik.errors.email}</p>
  )}
  {formik.status && <p role="status">{formik.status.message}</p>}
  <button type="submit" disabled={formik.isSubmitting}>Submit</button>
</form>`;
  const properties = [
    ['initialValues', 'UserFormValues', '—'],
    ['validationSchema', 'yup.ObjectSchema', '—'],
    ['onSubmit', '(values, helpers) => Promise<void>', '—'],
    ['errors / touched', 'FormikErrors / FormikTouched', '{}'],
    ['status / setStatus', 'unknown / (status) => void', '—'],
    ['isSubmitting', 'boolean', 'false'],
  ];

  return (
    <main className="min-w-0 px-[6%] pt-9 pb-[50px] max-[581px]:py-[26px]">
      <div className="mb-5 font-mono text-[11px] text-site-muted">{t('componentCrumb')}{t('forms')}</div>
      <div className="component-heading">
        <h1 className="text-[42px] font-medium leading-[1.1] tracking-[-1.5px] max-[581px]:text-4xl">{t('forms')}</h1>
        <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">{t('demo')}</span>
      </div>
      <p className="max-w-[600px] text-[13px] text-site-muted">{t('formsIntro')}</p>
      <div className="mt-[26px] overflow-hidden rounded-[11px] border border-site-border shadow-[0_12px_45px_var(--site-shadow-soft)]">
        <div role="group" aria-label={t('componentExample')} className="flex gap-[22px] border-b border-site-border bg-site-panel px-[18px]">
          {(['preview', 'code'] as const).map((item) => <button key={item} type="button" data-selected={tab === item} aria-pressed={tab === item} onClick={() => setTab(item)}
            className="cursor-pointer border-0 border-b-2 border-transparent bg-transparent py-[13px] text-xs text-site-muted data-[selected=true]:border-site-accent data-[selected=true]:text-site-ink">{t(item)}</button>)}
        </div>
        <div className="flex min-h-[210px] items-center justify-center bg-site-bg bg-[radial-gradient(ellipse_at_50%_60%,var(--site-soft),transparent_65%),radial-gradient(var(--site-border)_1px,transparent_1px)] bg-size-[auto,18px_18px] px-5 py-11 max-[581px]:px-4">
          {tab === 'code' ? <CodeBlock code={example} className="w-full text-xs leading-[1.8] whitespace-pre-wrap [overflow-wrap:anywhere]" />
            : <UserForm simulateError={simulateError} />}
        </div>
        <div className="component-controls">
          <div className="component-control">
            <label htmlFor="forms-simulate-error" className="component-control-label">{t('formsSimulateError')}</label>
            <div className="component-control-body"><Switch id="forms-simulate-error" aria-label={t('formsSimulateError')} checked={simulateError} onCheckedChange={setSimulateError} /></div>
          </div>
        </div>
      </div>
      <h2 className="mt-8 mb-4 text-[21px] font-medium">{t('properties')}</h2>
      <table className="w-full table-fixed border-collapse text-left text-[11px]">
        <thead><tr>{['prop', 'type', 'default'].map((key) => <th key={key} className="border-b border-site-border px-2 py-[13px] font-normal text-site-muted">{t(key)}</th>)}</tr></thead>
        <tbody>{properties.map(([property, type, defaultValue]) => <tr key={property}>
          <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]"><code className="text-site-accent">{property}</code></td>
          <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">{type}</td>
          <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">{defaultValue}</td>
        </tr>)}</tbody>
      </table>
    </main>
  );
}
