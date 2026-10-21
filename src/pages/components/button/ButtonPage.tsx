import CodeBlock from '../../../lib/components/code/CodeBlock';
import Dropdown from '../../../lib/components/Dropdown';
import Switch from '../../../lib/components/Switch';
import { useTranslation } from "react-i18next";
import { useState } from 'react';

type ButtonToggleProps = { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void };

function ButtonToggle({ id, label, checked, onChange }: ButtonToggleProps) {
  const { t } = useTranslation();
  return (
    <div className="component-control">
      <span id={`${id}-label`} className="component-control-label">{label}</span>
      <div className="component-control-body">
        <button id={id} type="button" role="switch" aria-checked={checked} aria-labelledby={`${id}-label`} onClick={() => onChange(!checked)} className="component-toggle">
          <span className="component-toggle-thumb" aria-hidden="true" />
        </button>
        <span aria-hidden="true" className={checked ? 'text-site-accent' : 'text-site-muted'}>{t(checked ? 'on' : 'off')}</span>
      </div>
    </div>
  );
}

export default function ButtonPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [variant, setVariant] = useState<'primary' | 'secondary'>('primary');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [disabled, setDisabled] = useState(false);
  const [gradient, setGradient] = useState(false);
  const gradientVariant = variant === 'secondary' ? 'gradient-secondary' : 'gradient';
  const activeVariant = gradient ? gradientVariant : variant;
  const cancelVariant = gradient ? `border-${gradientVariant}` : 'outline';
  const [demoStatus, setDemoStatus] = useState('');
  const example = `<button
  className="site-button"
  data-variant="${activeVariant}"
  data-size="${size}"${disabled ? '\n  disabled' : ''}
>
  ${t("continue")}
</button>

<button
  className="site-button"
  data-variant="${cancelVariant}"
  data-size="${size}"${disabled ? '\n  disabled' : ''}
>
  ${t("cancel")}
</button>`;
  return (
    <main className="min-w-0 px-[6%] pt-9 pb-[50px] max-[581px]:py-[26px]">
      <div className="mb-5 font-mono text-[11px] text-site-muted">
        {t("componentCrumb")}
        <span data-doc-crumb="">
          <span>{t("button")}</span>
        </span>
      </div>
      <div className="component-heading">
        <h1
          data-doc-title=""
          className="text-[42px] font-medium leading-[1.1] tracking-[-1.5px] max-[581px]:text-4xl"
        >
          <span>{t("button")}</span>
        </h1>
        <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
          {t("demo")}
        </span>
      </div>
      <p
        data-doc-description=""
        className="m-0 text-[13px] text-site-muted max-w-[520px]"
      >
        <span>
          {t("buttonIntro")}
        </span>
      </p>
      <div className="mt-[26px] overflow-hidden rounded-[11px] border border-site-border shadow-[0_12px_45px_var(--site-shadow-soft)]">
        <div
          role="group"
          aria-label={t("componentExample")}
          className="flex gap-[22px] border-b border-site-border bg-site-panel px-[18px]"
        >
          <button
            data-doc-tab="preview"
            data-selected={tab === 'preview'}
            aria-pressed={tab === 'preview'}
            className="cursor-pointer touch-manipulation disabled:cursor-not-allowed disabled:opacity-40 border-0 border-b-2 border-transparent bg-transparent py-[13px] text-xs text-site-muted data-[selected=true]:border-site-accent data-[selected=true]:text-site-ink"
            type="button"
            onClick={() => setTab('preview')}
          >
            {t("preview")}
          </button>
          <button
            data-doc-tab="code"
            aria-pressed={tab === 'code'}
            className="cursor-pointer touch-manipulation disabled:cursor-not-allowed disabled:opacity-40 border-0 border-b-2 border-transparent bg-transparent py-[13px] text-xs text-site-muted data-[selected=true]:border-site-accent data-[selected=true]:text-site-ink"
            type="button"
            onClick={() => setTab('code')}
            data-selected={tab === 'code'}
          >
            {t("code")}
          </button>
        </div>
        <div
          data-playground=""
          className="flex min-h-[185px] flex-wrap items-center justify-center gap-[14px] bg-site-bg bg-[radial-gradient(ellipse_at_50%_60%,var(--site-soft),transparent_65%),radial-gradient(var(--site-border)_1px,transparent_1px)] bg-size-[auto,18px_18px] px-5 py-11 max-[581px]:px-4 max-[581px]:py-[30px]"
        >
          {tab === 'code' ? (
            <CodeBlock code={example} className="w-full text-left text-xs leading-[1.8] whitespace-pre-wrap [overflow-wrap:anywhere]" />
          ) : (
            <>
                <button
                  type="button"
                  className="site-button"
                  data-variant={activeVariant}
                  data-size={size}
                  disabled={disabled}
                  onClick={() =>
                    setDemoStatus('actionConfirmed')
                  }
                >
                  {t("continueAction")}
                </button>
                <button
                  type="button"
                  className="site-button"
                  data-variant={cancelVariant}
                  data-size={size}
                  disabled={disabled}
                  onClick={() => setDemoStatus('actionCancelled')}
                >
                  {t("cancel")}
                </button>
            </>
          )}
        </div>
        <div className="component-controls">
          <div className="component-control">
            <label htmlFor="button-variant" className="component-control-label">{t("variant")}</label>
            <Dropdown id="button-variant"
              label={t("variant")}
              value={variant}
              options={[{ value: 'primary', label: t("primary") }, { value: 'secondary', label: t("secondary") }]}
              onChange={(value) => { setVariant(value); setDemoStatus(''); }}
            />
          </div>
          <div className="component-control">
            <label htmlFor="button-size" className="component-control-label">{t("size")}</label>
            <Dropdown id="button-size"
              label={t("size")}
              value={size}
              options={[{ value: 'md', label: t("medium") }, { value: 'sm', label: t("small") }, { value: 'lg', label: t("large") }]}
              onChange={(value) => { setSize(value); setDemoStatus(''); }}
            />
          </div>
          <ButtonToggle id="button-gradient" label={t('gradient')} checked={gradient} onChange={(checked) => { setGradient(checked); setDemoStatus(''); }} />
          <div className="component-control component-control--disabled">
            <label htmlFor="button-disabled" className="component-control-label">{t("disabled")}</label>
            <div className="component-control-body">
              <Switch id="button-disabled"
                data-demo-disabled=""
                aria-label={t('disabled')}
                checked={disabled}
                onCheckedChange={(checked) => {
                  setDisabled(checked);
                  setDemoStatus('');
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        data-demo-status=""
        aria-live="polite"
        className="mt-3 min-h-[18px] text-[11px] text-site-accent"
      >
        {demoStatus ? t(demoStatus) : ""}
      </div>
      <h2 className="mt-8 mb-4 text-[21px] font-medium">{t("properties")}</h2>
      <table className="w-full table-fixed border-collapse text-left text-[11px]">
        <thead>
          <tr>
            <th className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere] text-site-muted">
              {t("prop")}
            </th>
            <th className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere] text-site-muted">
              {t("type")}
            </th>
            <th className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere] text-site-muted">
              {t("default")}
            </th>
          </tr>
        </thead>
        <tbody data-props="">
          <>
            <tr>
              <td className="border-b border-site-border px-2 py-[13px]"><code className="text-site-accent">className</code></td>
              <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">"site-button"</td>
              <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">"site-button"</td>
            </tr>
            <tr>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                <code className="text-[11px] text-site-accent">
                  data-variant
                </code>
              </td>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                "primary" | "secondary" | "outline" | "gradient" | "gradient-secondary" | "border-gradient" | "border-gradient-secondary"
              </td>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                "primary"
              </td>
            </tr>
            <tr>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                <code className="text-[11px] text-site-accent">data-size</code>
              </td>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                "sm" | "md" | "lg"
              </td>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                "md"
              </td>
            </tr>
            <tr>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                <code className="text-[11px] text-site-accent">
                  disabled
                </code>
              </td>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                boolean
              </td>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                false
              </td>
            </tr>
          </>
        </tbody>
      </table>
    </main>
  );
}
