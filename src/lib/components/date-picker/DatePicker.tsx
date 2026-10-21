import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Popover, Portal } from '@skeletonlabs/skeleton-react';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';
import useMobile from '../../hooks/useMobile';
import Input from '../input/Input';
import TimeFields from './TimeFields';
import { calendarDays, dayjs, fromNativeValue, parsePickerValue, pickerTimeInRange, startOfPickerWeek, toPickerValue, type PickerMode } from './dates';
import './date-picker.css';

export interface DatePickerProps {
  id?: string;
  name?: string;
  label: string;
  mode?: PickerMode;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  minYear?: number;
  maxYear?: number;
  /** Adds local hours and minutes in day mode (YYYY-MM-DDTHH:mm). */
  includeTime?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
}

type View = 'day' | 'month' | 'year';

function CalendarIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>;
}

function ClockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}

export default function DatePicker({ id, name, label, mode = 'day', value, onChange, disabled = false, variant = 'primary', size = 'md', minYear = 1900, maxYear = 2100, includeTime = false, required = false, min, max }: DatePickerProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'en';
  const isMobile = useMobile();
  const withTime = includeTime && mode === 'day';
  const hasTime = withTime || mode === 'time';
  const selected = parsePickerValue(value, mode, withTime);
  const initialDate = selected ?? dayjs();
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(initialDate.startOf('month'));
  const [view, setView] = useState<View>(mode === 'week' || mode === 'time' ? 'day' : mode);
  const [focused, setFocused] = useState(initialDate.format('YYYY-MM-DD'));
  const [draftDate, setDraftDate] = useState(initialDate.format('YYYY-MM-DD'));
  const [draftTime, setDraftTime] = useState(initialDate.format('HH:mm'));
  const [portalTarget, setPortalTarget] = useState<HTMLElement>();
  const grid = useRef<HTMLDivElement>(null);
  const timeFields = useRef<HTMLDivElement>(null);
  const validationInput = useRef<HTMLInputElement>(null);
  const visibleInput = useRef<HTMLInputElement>(null);
  const focusPending = useRef(false);

  useEffect(() => {
    if (focusPending.current) {
      grid.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus();
      focusPending.current = false;
    }
  }, [focused, cursor, view]);

  const format = (date: Dayjs, options: Intl.DateTimeFormatOptions) => date.toDate().toLocaleDateString(locale, options);
  const displayValue = !selected ? '' : mode === 'year' || mode === 'time' ? value
    : mode === 'week' ? `${t('pickerWeek')} ${Number(value.slice(-2))} · ${value.slice(0, 4)}`
      : withTime ? selected.toDate().toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })
        : format(selected, mode === 'month' ? { month: 'long', year: 'numeric' } : { day: '2-digit', month: '2-digit', year: 'numeric' });
  const minimum = min ? parsePickerValue(min, mode, withTime) : null;
  const maximum = max ? parsePickerValue(max, mode, withTime) : null;
  const inBounds = (date: Dayjs, calendarCell = false) => {
    if (mode === 'time') return pickerTimeInRange(date.format('HH:mm'), min, max);
    const year = mode === 'week' ? Number(toPickerValue(date, 'week').slice(0, 4)) : date.year();
    const unit = calendarCell ? 'day' : 'minute';
    return year >= minYear && year <= maxYear
      && (!minimum || !date.isBefore(minimum, unit)) && (!maximum || !date.isAfter(maximum, unit));
  };
  const invalid = Boolean(value && (!selected || !inBounds(selected)));
  const draft = mode === 'time' ? parsePickerValue(draftTime, 'time') : parsePickerValue(`${draftDate}T${draftTime}`, 'day', true);
  const allowedTime = (time: string) => {
    const date = mode === 'time' ? parsePickerValue(time, 'time') : parsePickerValue(`${draftDate}T${time}`, 'day', true);
    return Boolean(date && inBounds(date));
  };

  useEffect(() => {
    validationInput.current?.setCustomValidity(invalid ? t('pickerInvalid') : '');
  }, [invalid, t, isMobile]);

  function changeOpen(next: boolean) {
    if (next && disabled) return;
    if (next) {
      // Keep the popup inside its parent dialog's accessibility and focus scope.
      setPortalTarget(visibleInput.current?.closest<HTMLElement>('[data-scope="dialog"][data-part="content"]') ?? undefined);
      const anchor = inBounds(initialDate) ? initialDate : minimum ?? maximum ?? dayjs(`${minYear}-01-01`);
      setCursor(anchor.startOf('month'));
      setFocused(anchor.format('YYYY-MM-DD'));
      setDraftDate(anchor.format('YYYY-MM-DD'));
      setDraftTime(anchor.format('HH:mm'));
      setView(mode === 'week' || mode === 'time' ? 'day' : mode);
    }
    setOpen(next);
  }

  function choose(date: Dayjs) {
    if (!canChoose(date)) return;
    if (view === 'year' && mode !== 'year') {
      setCursor(date);
      setView('month');
    } else if (view === 'month' && (mode === 'day' || mode === 'week')) {
      setCursor(date);
      setView('day');
    } else {
      if (withTime) {
        setDraftDate(date.format('YYYY-MM-DD'));
      } else {
        onChange(toPickerValue(date, mode));
        setOpen(false);
      }
    }
  }

  const yearStart = Math.floor(cursor.year() / 12) * 12;
  const cells = view === 'day' ? calendarDays(cursor) : view === 'month'
    ? Array.from({ length: 12 }, (_, month) => cursor.startOf('year').month(month))
    : Array.from({ length: 12 }, (_, index) => cursor.startOf('year').year(yearStart + index));
  const columns = view === 'day' ? 7 : 3;
  const heading = view === 'day' ? format(cursor, { month: 'long', year: 'numeric' })
    : view === 'month' ? String(cursor.year()) : `${yearStart} – ${yearStart + 11}`;
  const canChoose = (date: Dayjs) => view === 'day' ? inBounds(date, true)
    : date.year() >= minYear && date.year() <= maxYear
      && (!minimum || !date.endOf(view).isBefore(minimum))
      && (!maximum || !date.startOf(view).isAfter(maximum));
  const focusDate = cells.find((date) => date.format('YYYY-MM-DD') === focused && canChoose(date))
    ?? cells.find((date) => canChoose(date) && (view !== 'day' || date.month() === cursor.month()))
    ?? cells.find(canChoose);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, date: Dayjs) {
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns };
    let target: Dayjs;
    if (event.key in offsets) target = date.add(offsets[event.key], view);
    else if (event.key === 'Home') target = view === 'day' ? startOfPickerWeek(date) : cells[0];
    else if (event.key === 'End') target = view === 'day' ? startOfPickerWeek(date).add(6, 'day') : cells[cells.length - 1];
    else if (event.key === 'PageUp' || event.key === 'PageDown') target = date.add(event.key === 'PageUp' ? -1 : 1, view === 'day' ? 'month' : 'year');
    else return;
    event.preventDefault();
    if (!canChoose(target)) return;
    focusPending.current = true;
    const next = view === 'day' ? target : target.startOf(view);
    setFocused(next.format('YYYY-MM-DD'));
    setCursor(next.startOf('month'));
  }

  function shift(amount: number) {
    setCursor(cursor.add(amount * (view === 'year' ? 12 : 1), view === 'day' ? 'month' : 'year'));
  }

  const previousDisabled = view === 'day' ? cursor.startOf('month').year() <= minYear && cursor.month() === 0
    : view === 'month' ? cursor.year() <= minYear : yearStart <= minYear;
  const nextDisabled = view === 'day' ? cursor.year() >= maxYear && cursor.month() === 11
    : view === 'month' ? cursor.year() >= maxYear : yearStart + 11 >= maxYear;
  const fieldClass = 'site-input period-picker-field';
  const formValue = <input type="hidden" name={name} value={value} disabled={disabled} />;

  if (isMobile && mode === 'time') {
    return <div className="period-picker">
      <label htmlFor={inputId} className="period-picker-label">{label}</label>
      <Input id={inputId} className="period-picker-field" variant={variant} size={size} type="time" step={60} value={value} min={min} max={max} required={required} disabled={disabled} aria-invalid={invalid || undefined}
        onChange={(event) => onChange(fromNativeValue(event.target.value, 'time', 'time'))} />
      {formValue}
    </div>;
  }

  if (isMobile) {
    // Native week inputs always use ISO Monday-first weeks. A native date
    // picker lets mobile users choose the same Sunday-first period as desktop.
    const preferredType = withTime ? 'datetime-local' : mode === 'day' || mode === 'week' ? 'date' : mode;
    const probe = document.createElement('input');
    probe.type = preferredType;
    const nativeType = probe.type === preferredType ? preferredType : 'date';
    const nativeFallback = mode === 'week' || (mode !== 'year' && nativeType !== preferredType);
    const nativeValue = nativeFallback && selected ? selected.format('YYYY-MM-DD') : value;
    const firstDay = mode === 'week' ? parsePickerValue(`${minYear}-W01`, 'week')! : dayjs(`${minYear}-01-01`);
    const lastWeek = parsePickerValue(`${maxYear}-W53`, 'week') ?? parsePickerValue(`${maxYear}-W52`, 'week');
    const lastDay = mode === 'week' ? lastWeek!.add(6, 'day') : dayjs(`${maxYear}-12-31`);
    const nativeMin = minimum && inBounds(minimum) ? (nativeType === 'date' ? minimum.format('YYYY-MM-DD') : min)
      : withTime ? `${minYear}-01-01T00:00` : nativeType === 'date' ? firstDay.format('YYYY-MM-DD') : mode === 'month' ? `${minYear}-01` : `${minYear}-W01`;
    const nativeMax = maximum && inBounds(maximum) ? (nativeType === 'date' ? maximum.format('YYYY-MM-DD') : max)
      : withTime ? `${maxYear}-12-31T23:59` : nativeType === 'date' ? lastDay.format('YYYY-MM-DD') : mode === 'month' ? `${maxYear}-12` : toPickerValue(lastDay, 'week');
    return (
      <div className="period-picker">
        <label htmlFor={inputId} className="period-picker-label">{label}</label>
        {mode === 'year' ? (
          <select id={inputId} className={fieldClass} data-variant={variant} data-size={size} value={value} disabled={disabled} required={required} onChange={(event) => onChange(event.target.value)}>
            <option value="">{t('pickerEmpty')}</option>
            {Array.from({ length: Math.max(0, maxYear - minYear + 1) }, (_, index) => minYear + index).map((year) => <option key={year} value={year} disabled={!inBounds(dayjs(`${year}-01-01`))}>{year}</option>)}
          </select>
        ) : (
          <Input id={inputId} className="period-picker-field" variant={variant} size={size} type={nativeType} value={nativeValue} min={nativeMin} max={nativeMax} step={withTime ? 60 : undefined} disabled={disabled} required={required} aria-invalid={invalid || undefined} aria-describedby={nativeFallback ? `${inputId}-hint` : undefined}
            onChange={(event) => {
              onChange(fromNativeValue(event.target.value, mode, nativeType, withTime));
            }} />
        )}
        {nativeFallback && <p id={`${inputId}-hint`} className="period-picker-hint">{t(mode === 'week' ? 'pickerNativeWeekHint' : 'pickerNativeMonthHint')}</p>}
        {formValue}
      </div>
    );
  }

  return (
    <div className="period-picker">
      <label htmlFor={inputId} className="period-picker-label">{label}</label>
      <Popover ids={{ content: `${inputId}-dialog` }} open={open && !disabled} onOpenChange={({ open: next }) => changeOpen(next)} positioning={{ placement: 'bottom-start', gutter: 8, strategy: 'fixed', sameWidth: mode === 'time' }}
        initialFocusEl={() => (mode === 'time' ? timeFields : grid).current?.querySelector<HTMLButtonElement>('[tabindex="0"]') ?? null}>
        <Popover.Anchor>
          <div className={`${fieldClass} period-picker-control`} data-variant={variant} data-size={size} data-disabled={disabled}>
            <input ref={visibleInput} id={inputId} type="text" readOnly value={displayValue} disabled={disabled} aria-required={required || undefined} aria-invalid={invalid || undefined} placeholder={t('pickerEmpty')} aria-haspopup="dialog" aria-expanded={open && !disabled} aria-controls={`${inputId}-dialog`}
              onClick={() => changeOpen(true)} onKeyDown={(event) => {
                if (['Enter', ' ', 'ArrowDown'].includes(event.key)) { event.preventDefault(); changeOpen(true); }
              }} />
            <Popover.Trigger className="period-picker-trigger" disabled={disabled} aria-label={t('pickerOpen', { label })}>{mode === 'time' ? <ClockIcon /> : <CalendarIcon />}</Popover.Trigger>
          </div>
        </Popover.Anchor>
        <Portal target={portalTarget}>
          <Popover.Positioner className="period-picker-positioner">
            <Popover.Content className="period-picker-panel" data-mode={mode} aria-label={label}>
              {mode !== 'time' && <>
                <header className="period-picker-header">
                  <button type="button" onClick={() => shift(-1)} disabled={previousDisabled} aria-label={t('pickerPrevious')}>‹</button>
                  <button type="button" className="period-picker-heading" disabled={view === 'year'} onClick={() => setView(view === 'day' ? 'month' : 'year')} aria-live="polite">{heading}</button>
                  <button type="button" onClick={() => shift(1)} disabled={nextDisabled} aria-label={t('pickerNext')}>›</button>
                </header>
                {view === 'day' && <div className="period-picker-weekdays" aria-hidden="true">{cells.slice(0, 7).map((date) => <span key={date.day()}>{format(date, { weekday: 'short' })}</span>)}</div>}
                <div ref={grid} role="grid" aria-label={heading} className="period-picker-grid" data-view={view}>
                  {Array.from({ length: cells.length / columns }, (_, row) => (
                    <div role="row" key={row}>
                      {cells.slice(row * columns, (row + 1) * columns).map((date) => {
                        const activeDate = withTime ? dayjs(draftDate) : selected;
                        const active = Boolean(activeDate && (view === 'day' && mode === 'week' ? toPickerValue(date, 'week') === value : date.isSame(activeDate, view)));
                        const dateKey = date.format('YYYY-MM-DD');
                        return <div role="gridcell" aria-selected={active} key={dateKey}>
                          <button type="button" data-date={dateKey} data-selected={active} data-outside={view === 'day' && date.month() !== cursor.month()} data-today={view === 'day' && date.isSame(dayjs(), 'day')}
                            tabIndex={focusDate?.isSame(date, 'day') ? 0 : -1} disabled={!canChoose(date)} aria-label={format(date, view === 'day' ? { dateStyle: 'full' } : view === 'month' ? { month: 'long', year: 'numeric' } : { year: 'numeric' })}
                            onKeyDown={(event) => navigate(event, date)} onFocus={() => setFocused(dateKey)} onClick={() => choose(date)}>
                            {view === 'day' ? date.date() : view === 'month' ? format(date, { month: 'short' }) : date.year()}
                          </button>
                        </div>;
                      })}
                    </div>
                  ))}
                </div>
              </>}
              {hasTime && open && <TimeFields ref={timeFields} id={`${inputId}-time`} value={draftTime} onChange={setDraftTime} isAllowed={allowedTime} />}
              {hasTime && draft && !inBounds(draft) && <p className="period-picker-hint" role="status">{t('pickerInvalid')}</p>}
              <footer className="period-picker-footer">
                <button type="button" disabled={!value} onClick={() => { onChange(''); setOpen(false); }}>{t('pickerClear')}</button>
                <button type="button" disabled={!inBounds(dayjs())} onClick={() => { onChange(toPickerValue(dayjs(), mode, withTime)); setOpen(false); }}>{t('pickerCurrent')}</button>
                {hasTime && <button type="button" disabled={!draft || !inBounds(draft)} onClick={() => {
                  if (draft && inBounds(draft)) { onChange(toPickerValue(draft, mode, withTime)); setOpen(false); }
                }}>{t('pickerApply')}</button>}
              </footer>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover>
      <input ref={validationInput} className="period-picker-validation" tabIndex={-1} aria-hidden="true" value={value} onChange={() => {}} required={required} disabled={disabled}
        onInvalid={(event) => {
          event.preventDefault();
          if (event.currentTarget.form && event.currentTarget.form.querySelector('input:invalid, select:invalid, textarea:invalid') !== event.currentTarget) return;
          visibleInput.current?.focus();
          changeOpen(true);
        }} />
      {formValue}
    </div>
  );
}
