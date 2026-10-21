import CodeBlock from '../../../lib/components/code/CodeBlock';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import Scheduler from '../../../lib/components/scheduler/Scheduler';
import { eventDateFormat, type SchedulerEvent } from '../../../lib/components/scheduler/events';
import { dayjs } from '../../../lib/components/date-picker/dates';

function initialEvents(t: TFunction): SchedulerEvent[] {
  const today = dayjs().startOf('day');
  return [
    { id: 'scheduler-planning', title: t('schedulerSamplePlanning'), day: 0, hour: 9, duration: 1, urgency: 'normal' as const },
    { id: 'scheduler-review', title: t('schedulerSampleReview'), day: 0, hour: 11, duration: 1.5, urgency: 'high' as const },
    { id: 'scheduler-research', title: t('schedulerSampleResearch'), day: 0, hour: 14, duration: 1, urgency: 'low' as const },
    { id: 'scheduler-release', title: t('schedulerSampleRelease'), day: 1, hour: 10, duration: 2, urgency: 'critical' as const },
  ].map((item) => {
    const start = today.add(item.day, 'day').hour(item.hour);
    return { id: item.id, title: item.title, start: start.format(eventDateFormat), end: start.add(item.duration * 60, 'minute').format(eventDateFormat), urgency: item.urgency, description: '' };
  });
}

export default function SchedulerPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [events, setEvents] = useState<SchedulerEvent[]>(() => initialEvents(t));
  useEffect(() => {
    // Remove demo data left by versions that persisted preview events.
    try { localStorage.removeItem('component-scheduler-events-v1'); }
    catch { /* The preview also works when browser storage is blocked. */ }
  }, []);
  const example = `const [events, setEvents] = useState<SchedulerEvent[]>([
  {
    id: 'event-1',
    title: '${t('schedulerSamplePlanning')}',
    start: '${dayjs().format('YYYY-MM-DD')}T09:00',
    end: '${dayjs().format('YYYY-MM-DD')}T10:00',
    urgency: 'normal',
    description: '',
  },
]);

<Scheduler
  events={events}
  onEventsChange={setEvents}
/>`;
  const properties = [
    ['events', 'SchedulerEvent[]', '—'],
    ['onEventsChange', '(events: SchedulerEvent[]) => void', '—'],
    ['initialDate', 'string', t('schedulerToday')],
    ['readOnly', 'boolean', 'false'],
  ];
  return (
    <main className="min-w-0 px-[6%] pt-9 pb-[50px] max-[581px]:py-[26px]">
      <div className="mb-5 font-mono text-[11px] text-site-muted">{t('componentCrumb')}{t('scheduler')}</div>
      <div className="component-heading">
        <h1 className="text-[42px] font-medium leading-[1.1] tracking-[-1.5px] max-[581px]:text-4xl">{t('scheduler')}</h1>
        <span className="rounded-[5px] border border-site-border px-2 py-1 text-[10px] text-site-muted">{t('demo')}</span>
      </div>
      <p className="max-w-[650px] text-[13px] text-site-muted">{t('schedulerIntro')}</p>
      <div role="group" aria-label={t('componentExample')} className="mt-[26px] mb-4 flex gap-[22px] border-b border-site-border">
        {(['preview', 'code'] as const).map((item) => <button key={item} type="button" data-selected={tab === item} aria-pressed={tab === item} onClick={() => setTab(item)} className="cursor-pointer border-0 border-b-2 border-transparent bg-transparent py-[13px] text-xs text-site-muted data-[selected=true]:border-site-accent data-[selected=true]:text-site-ink">{t(item)}</button>)}
      </div>
      {tab === 'code' ? <CodeBlock code={example} className="rounded-[11px] border border-site-border bg-site-panel p-5 text-xs leading-[1.8] whitespace-pre-wrap [overflow-wrap:anywhere]" />
        : <Scheduler events={events} onEventsChange={setEvents} />}
      <p className="mt-4 text-[11px] text-site-muted">{t('schedulerPreviewNote')}</p>
      <h2 className="mt-8 mb-4 text-[21px] font-medium">{t('properties')}</h2>
      <table className="w-full table-fixed border-collapse text-left text-[11px]">
        <thead><tr>{['prop', 'type', 'default'].map((key) => <th key={key} className="border-b border-site-border px-2 py-[13px] font-normal text-site-muted">{t(key)}</th>)}</tr></thead>
        <tbody>{properties.map(([property, type, defaultValue]) => <tr key={property}>
          <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]"><code className="text-site-accent whitespace-normal [overflow-wrap:anywhere]">{property}</code></td>
          <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">{type}</td>
          <td className="border-b border-site-border px-2 py-[13px] [overflow-wrap:anywhere]">{defaultValue}</td>
        </tr>)}</tbody>
      </table>
    </main>
  );
}
