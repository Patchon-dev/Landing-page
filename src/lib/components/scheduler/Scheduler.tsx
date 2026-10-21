import { useEffect, useId, useRef, useState, type TouchEvent } from 'react';
import { useTranslation } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventChangeArg } from '@fullcalendar/core';
import pt from '@fullcalendar/core/locales/pt';
import de from '@fullcalendar/core/locales/de';
import es from '@fullcalendar/core/locales/es';
import fr from '@fullcalendar/core/locales/fr';
import it from '@fullcalendar/core/locales/it';
import nl from '@fullcalendar/core/locales/nl';
import Modal from '../modal/Modal';
import Input from '../input/Input';
import Textarea from '../input/Textarea';
import DatePicker from '../date-picker/DatePicker';
import Dropdown from '../Dropdown';
import useMobile from '../../hooks/useMobile';
import { dayjs } from '../date-picker/dates';
import { eventDateFormat, parseSchedulerEvent, schedulerEventsInRange, upsertSchedulerEvent, urgencyLevels, type SchedulerEvent } from './events';
import './scheduler.css';

export interface SchedulerProps {
  events: SchedulerEvent[];
  onEventsChange: (events: SchedulerEvent[]) => void;
  initialDate?: string;
  readOnly?: boolean;
}

type View = 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth' | 'listWeek';
const viewLabels = { timeGridDay: 'schedulerDay', timeGridWeek: 'schedulerWeek', dayGridMonth: 'schedulerMonth', listWeek: 'schedulerList' } as const;

function EventFields({ event, onDelete }: { event: SchedulerEvent; onDelete?: () => void }) {
  const { t } = useTranslation();
  const urgencyId = useId();
  const [start, setStart] = useState(event.start);
  const [end, setEnd] = useState(event.end);
  const [urgency, setUrgency] = useState(event.urgency);
  return (
    <div className="scheduler-fields">
      <label>{t('schedulerEventTitle')}<Input name="title" defaultValue={event.title} required maxLength={120}
        onInput={(inputEvent) => inputEvent.currentTarget.setCustomValidity(inputEvent.currentTarget.value.trim() ? '' : t('schedulerTitleRequired'))} /></label>
      <div className="scheduler-date-fields">
        <DatePicker label={t('schedulerStart')} name="start" value={start} onChange={setStart} includeTime required />
        <DatePicker label={t('schedulerEnd')} name="end" value={end} onChange={setEnd} includeTime required min={start ? dayjs(start).add(1, 'minute').format(eventDateFormat) : undefined} />
      </div>
      <div className="scheduler-field">
        <label htmlFor={urgencyId}>{t('schedulerUrgency')}</label>
        <Dropdown id={urgencyId} label={t('schedulerUrgency')} name="urgency" value={urgency} onChange={setUrgency} className="site-input site-text-field"
          options={urgencyLevels.map((level) => ({ value: level, label: t(`schedulerUrgency_${level}`) }))} />
      </div>
      <label>{t('schedulerDescription')}<Textarea name="description" defaultValue={event.description} maxLength={4000} rows={3} /></label>
      {onDelete && <button type="button" className="scheduler-delete" onClick={onDelete}>{t('schedulerDelete')}</button>}
    </div>
  );
}

export default function Scheduler({ events, onEventsChange, initialDate, readOnly = false }: SchedulerProps) {
  const { t, i18n } = useTranslation();
  const schedulerId = useId();
  const isMobile = useMobile();
  const calendarRef = useRef<FullCalendar>(null);
  const touchRef = useRef<{ id: string; x: number; y: number; time: number; moved: boolean } | null>(null);
  const [view, setView] = useState<View>(isMobile ? 'timeGridDay' : 'timeGridWeek');
  const [period, setPeriod] = useState('');
  const [visibleRange, setVisibleRange] = useState<{ start: Date; end: Date } | null>(null);
  const [urgency, setUrgency] = useState('all');
  const [editor, setEditor] = useState<{ event: SchedulerEvent; isNew: boolean } | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    calendarRef.current?.getApi().changeView(isMobile ? 'timeGridDay' : 'timeGridWeek');
  }, [isMobile]);

  function createEvent(start: string, end: string) {
    if (readOnly) return;
    setEditor({ isNew: true, event: { id: crypto.randomUUID(), title: '', start, end, urgency: 'normal', description: '' } });
  }

  function selectTime(selection: DateSelectArg) {
    const start = dayjs(selection.start);
    const end = dayjs(selection.end);
    createEvent((selection.allDay ? start.hour(9) : start).format(eventDateFormat),
      (selection.allDay ? end.subtract(1, 'day').hour(10) : end).format(eventDateFormat));
    selection.view.calendar.unselect();
  }

  function moveEvent(change: EventChangeArg) {
    const previous = events.find((event) => event.id === change.event.id);
    const updated = parseSchedulerEvent({ ...previous, start: dayjs(change.event.start).format(eventDateFormat), end: dayjs(change.event.end).format(eventDateFormat) });
    if (!updated || readOnly) { change.revert(); return; }
    try {
      onEventsChange(upsertSchedulerEvent(events, updated));
      setStatus(t('schedulerMoved', { title: updated.title, date: dayjs(updated.start).toDate().toLocaleString(i18n.resolvedLanguage ?? 'en', { dateStyle: 'medium', timeStyle: 'short' }) }));
    } catch {
      change.revert();
      setStatus(t('schedulerUpdateFailed'));
    }
  }

  function startTouch(event: TouchEvent<HTMLDivElement>) {
    touchRef.current = null;
    if (readOnly || event.touches.length !== 1 || !(event.target instanceof Element) || event.target.closest('.fc-event-resizer')) return;
    const element = event.target.closest<HTMLElement>('[data-scheduler-id]');
    if (!element?.dataset.schedulerId) return;
    const point = event.touches[0];
    touchRef.current = { id: element.dataset.schedulerId, x: point.clientX, y: point.clientY, time: performance.now(), moved: false };
  }

  function finishTouch(event: TouchEvent<HTMLDivElement>) {
    const touch = touchRef.current;
    touchRef.current = null;
    if (!touch || readOnly || touch.moved || performance.now() - touch.time >= 400) return;
    const original = events.find((item) => item.id === touch.id);
    if (!original) return;
    // A selected FullCalendar event immediately starts a new touch drag. Handle
    // short taps before its preview can swallow the compatibility click.
    event.preventDefault();
    setEditor({ event: original, isNew: false });
  }

  const filteredEvents = events.filter((event) => urgency === 'all' || event.urgency === urgency);
  const visibleCount = visibleRange ? schedulerEventsInRange(filteredEvents, visibleRange.start, visibleRange.end).length : 0;
  const displayedEvents = filteredEvents.map((event) => ({
    id: event.id, title: event.title, start: event.start, end: event.end, allDay: false,
    extendedProps: { urgency: event.urgency }, classNames: ['scheduler-event', `scheduler-urgency-${event.urgency}`],
  }));

  return (
    <section className="scheduler" aria-label={t('scheduler')} data-view={view} data-readonly={readOnly}>
      <header className="scheduler-toolbar">
        <div className="scheduler-navigation">
          <button type="button" onClick={() => calendarRef.current?.getApi().prev()} aria-label={t('schedulerPrevious')}>‹</button>
          <button type="button" onClick={() => calendarRef.current?.getApi().today()}>{t('schedulerToday')}</button>
          <button type="button" onClick={() => calendarRef.current?.getApi().next()} aria-label={t('schedulerNext')}>›</button>
        </div>
        <h2 aria-live="polite" className="scheduler-period">{period}</h2>
        {!readOnly && <button type="button" className="site-button scheduler-add" data-variant="primary" onClick={() => {
          const start = dayjs(calendarRef.current?.getApi().getDate() ?? new Date()).hour(9).minute(0).second(0);
          createEvent(start.format(eventDateFormat), start.add(1, 'hour').format(eventDateFormat));
        }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg> {t('schedulerNewEvent')}</button>}
      </header>
      <div className="scheduler-options">
        <div className="scheduler-option"><label htmlFor={`${schedulerId}-view`}>{t('schedulerView')}</label>
          <Dropdown id={`${schedulerId}-view`} label={t('schedulerView')} value={view} onChange={(next) => calendarRef.current?.getApi().changeView(next)} options={(Object.keys(viewLabels) as View[]).map((key) => ({ value: key, label: t(viewLabels[key]) }))} />
        </div>
        <div className="scheduler-option"><label htmlFor={`${schedulerId}-filter`}>{t('schedulerUrgency')}</label>
          <Dropdown id={`${schedulerId}-filter`} label={t('schedulerUrgency')} value={urgency} onChange={setUrgency} options={[{ value: 'all', label: t('schedulerAllUrgencies') }, ...urgencyLevels.map((level) => ({ value: level, label: t(`schedulerUrgency_${level}`) }))]} />
        </div>
        <span className="scheduler-count">{t('schedulerCount', { count: visibleCount })}</span>
      </div>
      <ul className="scheduler-legend" aria-label={t('schedulerUrgency')}>
        {urgencyLevels.map((level) => <li key={level} className={`scheduler-urgency-${level}`}><span aria-hidden="true" />{t(`schedulerUrgency_${level}`)}</li>)}
      </ul>
      <div className="scheduler-calendar-wrap" onTouchStartCapture={startTouch} onTouchEndCapture={finishTouch}
        onTouchCancel={() => { touchRef.current = null; }} onTouchMoveCapture={(event) => {
          const touch = touchRef.current;
          const point = event.touches[0];
          if (touch && point && Math.hypot(point.clientX - touch.x, point.clientY - touch.y) > 8) touch.moved = true;
        }}>
        <div className="scheduler-calendar">
          <FullCalendar ref={calendarRef} plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
            initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'} initialDate={initialDate}
            locale={i18n.resolvedLanguage ?? 'en'} locales={[pt, de, es, fr, it, nl]} firstDay={0} headerToolbar={false}
            height={isMobile ? 560 : 680} allDaySlot={false} nowIndicator dayMaxEvents={3}
            slotDuration="00:30:00" snapDuration="00:15:00" scrollTime="08:00:00" slotMinTime="00:00:00" slotMaxTime="24:00:00"
            slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }} eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
            editable={!readOnly} selectable={!readOnly} selectMirror eventResizableFromStart eventInteractive={!readOnly}
            eventLongPressDelay={450} selectLongPressDelay={450} eventMinHeight={30} events={displayedEvents}
            select={selectTime} eventChange={moveEvent} datesSet={(range) => {
              setPeriod(range.view.title);
              setView(range.view.type as View);
              setVisibleRange((previous) => previous?.start.getTime() === range.start.getTime() && previous.end.getTime() === range.end.getTime()
                ? previous : { start: range.start, end: range.end });
            }}
            eventClick={({ event, jsEvent }) => {
              jsEvent.preventDefault();
              const original = events.find((item) => item.id === event.id);
              if (original && !readOnly) setEditor({ event: original, isNew: false });
            }}
            eventContent={({ event, timeText }) => <div className="scheduler-event-content">
              <strong>{event.title}</strong>
              <span className="scheduler-event-meta">{timeText} · {t(`schedulerUrgency_${event.extendedProps.urgency}`)}</span>
            </div>}
            eventDidMount={({ event, el }) => {
              const text = `${event.title} · ${dayjs(event.start).format('HH:mm')} – ${dayjs(event.end).format('HH:mm')} · ${t(`schedulerUrgency_${event.extendedProps.urgency}`)}`;
              el.title = text;
              el.dataset.schedulerId = event.id;
              el.setAttribute('aria-label', text);
            }} />
        </div>
      </div>
      <p className="scheduler-status" role="status">{status}</p>
      <p className="scheduler-help">{t(isMobile ? 'schedulerMobileHelp' : 'schedulerHelp')}</p>
      <Modal open={editor !== null} onOpenChange={(open) => { if (!open) setEditor(null); }} title={t(editor?.isNew ? 'schedulerNewEvent' : 'schedulerEditEvent')}
        submitLabel={t('schedulerSave')} onCancel={() => {}} onSuccess={(data) => {
          const event = parseSchedulerEvent({ id: editor?.event.id, title: data.get('title'), start: data.get('start'), end: data.get('end'), urgency: data.get('urgency'), description: data.get('description') });
          if (!event) throw new Error('Invalid event');
          onEventsChange(upsertSchedulerEvent(events, event));
          setStatus(t('schedulerSaved', { title: event.title }));
        }}>
        {editor && <EventFields event={editor.event} onDelete={editor.isNew ? undefined : () => {
          onEventsChange(events.filter((event) => event.id !== editor.event.id));
          setStatus(t('schedulerRemoved', { title: editor.event.title }));
          setEditor(null);
        }} />}
      </Modal>
    </section>
  );
}
