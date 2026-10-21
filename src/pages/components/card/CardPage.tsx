import CodeBlock from '../../../lib/components/code/CodeBlock';
import Dropdown from '../../../lib/components/Dropdown';
import Switch from '../../../lib/components/Switch';
import Avatar from '../../../lib/components/Avatar';
import { useTranslation } from "react-i18next";
import { useState } from 'react';

export default function CardPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [variant, setVariant] = useState<'primary' | 'secondary'>('primary');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [disabled, setDisabled] = useState(false);
  const [demoStatus, setDemoStatus] = useState('');
  return (
    <main className="min-w-0 px-[6%] pt-9 pb-[50px] max-[581px]:py-[26px]">
      <div className="mb-5 font-mono text-[11px] text-site-muted">
        {t("componentCrumb")}
        <span data-doc-crumb="">
          <span>{t("card")}</span>
        </span>
      </div>
      <div className="component-heading">
        <h1
          data-doc-title=""
          className="text-[42px] font-medium leading-[1.1] tracking-[-1.5px] max-[581px]:text-4xl"
        >
          <span>{t("card")}</span>
        </h1>
        <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">
          {t("demo")}
        </span>
      </div>
      <p
        data-doc-description=""
        className="m-0 text-[13px] text-site-muted max-w-[520px]"
      >
        <span>{t("cardIntro")}</span>
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
            <CodeBlock className="w-full text-left text-xs leading-[1.8] whitespace-pre-wrap [overflow-wrap:anywhere]" code={`<Card variant="${variant}"${disabled ? ' disabled' : ''}>
  <div className="mb-[9px] flex items-center gap-3">
    <div role="img" aria-label="Daniel Lopes" className="shrink-0">
      <Avatar user={{ name: "Daniel Lopes" }} size="sm" />
    </div>
    <CardTitle>${t("goodIdea")}</CardTitle>
  </div>
  <CardDescription>${t("startsNow")}</CardDescription>
</Card>`} />
          ) : (
            <>
              <div className="w-[250px] max-w-full rounded-[10px] border border-site-border bg-site-panel p-5">
                <div className="mb-[9px] flex items-center gap-3">
                  <div role="img" aria-label="Daniel Lopes" className="shrink-0">
                    <Avatar user={{ name: 'Daniel Lopes' }} size="sm" />
                  </div>
                  <h3 className="text-lg font-medium tracking-[-.5px]">{t("goodIdea")}</h3>
                </div>
                <p className="text-[13px] text-site-muted">
                  {t("cardBody")}
                </p>
                <div className="mt-[18px]">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer touch-manipulation items-center justify-center gap-2.5 rounded-lg border text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 motion-safe:transition-[transform,background-color] motion-safe:duration-180 motion-safe:hover:-translate-y-0.5 data-[variant=primary]:border-site-fill data-[variant=primary]:bg-site-fill data-[variant=primary]:text-site-on data-[variant=primary]:shadow-[0_5px_20px_var(--site-fill-shadow)] data-[variant=secondary]:border-site-border data-[variant=secondary]:bg-transparent data-[variant=secondary]:text-site-ink data-[size=sm]:px-3 data-[size=sm]:py-[7px] data-[size=md]:px-[18px] data-[size=md]:py-[11px] data-[size=lg]:px-6 data-[size=lg]:py-[15px]"
                    data-variant={variant}
                    data-size={size}
                    disabled={disabled}
                    onClick={() => setDemoStatus('cardActivated')}
                  >
                    {t("exploreAction")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="component-controls">
          <div className="component-control">
            <label htmlFor="card-variant" className="component-control-label">{t("variant")}</label>
            <Dropdown id="card-variant"
              label={t("variant")}
              value={variant}
              options={[{ value: 'primary', label: t("primary") }, { value: 'secondary', label: t("secondary") }]}
              onChange={(value) => { setVariant(value); setDemoStatus(''); }}
            />
          </div>
          <div className="component-control">
            <label htmlFor="card-size" className="component-control-label">{t("size")}</label>
            <Dropdown id="card-size"
              label={t("size")}
              value={size}
              options={[{ value: 'md', label: t("medium") }, { value: 'sm', label: t("small") }, { value: 'lg', label: t("large") }]}
              onChange={(value) => { setSize(value); setDemoStatus(''); }}
            />
          </div>
          <div className="component-control component-control--disabled">
            <label htmlFor="card-disabled" className="component-control-label">{t("disabled")}</label>
            <div className="component-control-body">
              <Switch id="card-disabled"
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
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                <code className="text-[11px] text-site-accent">
                  variant
                </code>
              </td>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                "primary" | "secondary"
              </td>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                "primary"
              </td>
            </tr>
            <tr>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                <code className="text-[11px] text-site-accent">
                  children
                </code>
              </td>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                ReactNode
              </td>
              <td className="border-b border-site-border px-2 py-[13px] font-normal [overflow-wrap:anywhere]">
                —
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
