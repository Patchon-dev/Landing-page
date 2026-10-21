import CodeBlock from '../../../lib/components/code/CodeBlock';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Charts from '../../../lib/components/charts/Charts';
import Dropdown from '../../../lib/components/Dropdown';

export default function ChartsPage() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [variant, setVariant] = useState<'primary' | 'secondary'>('primary');
  const [appearance, setAppearance] = useState<'solid' | 'soft'>('solid');
  const lineLabels = Array.from({ length: 6 }, (_, index) => new Intl.DateTimeFormat(i18n.resolvedLanguage, { month: 'short' }).format(new Date(2026, index, 1)));
  const lineValues = [24, 38, 31, 56, 48, 72];
  const additionalSeries = [
    { label: t('chartsDesign'), values: [18, 26, 42, 35, 58, 64] },
    { label: t('chartsSupport'), values: [12, 20, 17, 30, 26, 42] },
  ];
  const doughnutLabels = [t('chartsDevelopment'), t('chartsDesign'), t('chartsSupport'), t('chartsResearch')];
  const example = `<Charts
  type="line"
  label="Activity"
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  values={[24, 38, 31, 56, 48, 72]}
  additionalSeries={[
    { label: 'Design', values: [18, 26, 42, 35, 58, 64] },
    { label: 'Support', values: [12, 20, 17, 30, 26, 42] },
  ]}
  variant="${variant}"
  appearance="${appearance}"
/>

<Charts
  type="doughnut"
  label="Work distribution"
  labels={['Development', 'Design', 'Support', 'Research']}
  values={[42, 28, 18, 12]}
  variant="${variant}"
  appearance="${appearance}"
/>`;
  const properties = [
    ['type', "'line' | 'doughnut'", '—'],
    ['labels', 'string[]', '—'],
    ['values', 'number[]', '—'],
    ['label', 'string', '—'],
    ['additionalSeries', '{ label: string; values: number[] }[]', '[]'],
    ['variant', "'primary' | 'secondary'", 'primary'],
    ['appearance', "'solid' | 'soft'", 'solid'],
  ];

  return (
    <main className="min-w-0 px-[6%] pt-9 pb-[50px] max-[581px]:py-[26px]">
      <div className="mb-5 font-mono text-[11px] text-site-muted">{t('componentCrumb')}{t('charts')}</div>
      <div className="component-heading">
        <h1 className="text-[42px] font-medium leading-[1.1] tracking-[-1.5px] max-[581px]:text-4xl">{t('charts')}</h1>
        <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">{t('demo')}</span>
      </div>
      <p className="max-w-[600px] text-[13px] text-site-muted">{t('chartsIntro')}</p>
      <div className="mt-[26px] overflow-hidden rounded-[11px] border border-site-border shadow-[0_12px_45px_var(--site-shadow-soft)]">
        <div role="group" aria-label={t('componentExample')} className="flex gap-[22px] border-b border-site-border bg-site-panel px-[18px]">
          {(['preview', 'code'] as const).map((item) => <button key={item} type="button" data-selected={tab === item} aria-pressed={tab === item} onClick={() => setTab(item)}
            className="cursor-pointer border-0 border-b-2 border-transparent bg-transparent py-[13px] text-xs text-site-muted data-[selected=true]:border-site-accent data-[selected=true]:text-site-ink">{t(item)}</button>)}
        </div>
        <div className="flex min-h-[210px] items-center justify-center bg-site-bg bg-[radial-gradient(ellipse_at_50%_60%,var(--site-soft),transparent_65%),radial-gradient(var(--site-border)_1px,transparent_1px)] bg-size-[auto,18px_18px] px-5 py-11 max-[581px]:px-4">
          {tab === 'code' ? <CodeBlock code={example} className="w-full text-xs leading-[1.8] whitespace-pre-wrap [overflow-wrap:anywhere]" />
            : <div className="grid w-full min-w-0 grid-cols-2 gap-5 max-[1000px]:grid-cols-1">
              <article className="min-w-0 rounded-xl border border-site-border bg-site-panel p-4"><h2 className="mb-5 text-sm font-medium">{t('chartsLine')}</h2><Charts type="line" label={t('chartsLine')} labels={lineLabels} values={lineValues} additionalSeries={additionalSeries} variant={variant} appearance={appearance} /></article>
              <article className="min-w-0 rounded-xl border border-site-border bg-site-panel p-4"><h2 className="mb-5 text-sm font-medium">{t('chartsDoughnut')}</h2><Charts type="doughnut" label={t('chartsDoughnut')} labels={doughnutLabels} values={[42, 28, 18, 12]} variant={variant} appearance={appearance} /></article>
            </div>}
        </div>
        <div className="component-controls">
          <div className="component-control"><label htmlFor="charts-variant" className="component-control-label">{t('chartsPalette')}</label><Dropdown id="charts-variant" label={t('chartsPalette')} value={variant} onChange={setVariant} options={[{value: 'primary', label: t('primary')}, {value: 'secondary', label: t('secondary')}]} /></div>
          <div className="component-control"><label htmlFor="charts-style" className="component-control-label">{t('chartsStyle')}</label><Dropdown id="charts-style" label={t('chartsStyle')} value={appearance} onChange={setAppearance} options={[{value: 'solid', label: t('chartsSolid')}, {value: 'soft', label: t('chartsSoft')}]} /></div>
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
