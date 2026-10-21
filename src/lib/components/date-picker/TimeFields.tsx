import { useEffect, useRef, type KeyboardEvent, type Ref } from 'react';
import { useTranslation } from 'react-i18next';

interface TimeFieldsProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  isAllowed: (value: string) => boolean;
  ref?: Ref<HTMLDivElement>;
}

const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

export default function TimeFields({ id, value, onChange, isAllowed, ref }: TimeFieldsProps) {
  const { t } = useTranslation();
  const hourList = useRef<HTMLDivElement>(null);
  const minuteList = useRef<HTMLDivElement>(null);
  const [hour, minute] = value.split(':');

  useEffect(() => {
    for (const list of [hourList.current, minuteList.current]) {
      const selected = list?.querySelector<HTMLElement>('[aria-selected="true"]');
      if (list && selected) list.scrollTop = selected.offsetTop - (list.clientHeight - selected.offsetHeight) / 2;
    }
  }, [value]);

  function hourValue(nextHour: string) {
    return minutes.find((nextMinute) => nextMinute === minute && isAllowed(`${nextHour}:${nextMinute}`))
      ?? minutes.find((nextMinute) => isAllowed(`${nextHour}:${nextMinute}`));
  }
  const hourOptions = hours.map((item) => ({ hour: item, minute: hourValue(item) }));
  const hourTabStop = hourOptions.find((item) => item.hour === hour && item.minute !== undefined)?.hour
    ?? hourOptions.find((item) => item.minute !== undefined)?.hour;
  const minuteTabStop = isAllowed(value) ? minute : minutes.find((item) => isAllowed(`${hour}:${item}`));

  function navigate(event: KeyboardEvent<HTMLButtonElement>, column: 'hour' | 'minute') {
    const list = column === 'hour' ? hourList.current : minuteList.current;
    const options = Array.from(list?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
    const index = options.indexOf(event.currentTarget);
    let target: HTMLButtonElement | undefined;
    if (event.key === 'ArrowUp') target = options[Math.max(0, index - 1)];
    else if (event.key === 'ArrowDown') target = options[Math.min(options.length - 1, index + 1)];
    else if (event.key === 'Home') target = options[0];
    else if (event.key === 'End') target = options[options.length - 1];
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const other = column === 'hour' ? minuteList.current : hourList.current;
      target = other?.querySelector<HTMLButtonElement>('[tabindex="0"]') ?? undefined;
    } else return;
    event.preventDefault();
    target?.focus();
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') target?.click();
    target?.scrollIntoView({ block: 'nearest' });
  }

  return <div ref={ref} className="period-picker-time-columns">
    <div>
      <div id={`${id}-hours-label`} className="period-picker-time-label">{t('pickerHours')}</div>
      <div ref={hourList} role="listbox" aria-labelledby={`${id}-hours-label`} className="period-picker-time-list">
        {hourOptions.map(({ hour: item, minute: nextMinute }) => {
          return <button key={item} type="button" role="option" aria-selected={item === hour} disabled={nextMinute === undefined} tabIndex={item === hourTabStop ? 0 : -1}
            className="component-menu-item" onKeyDown={(event) => navigate(event, 'hour')} onClick={() => { if (nextMinute !== undefined) onChange(`${item}:${nextMinute}`); }}>{item}</button>;
        })}
      </div>
    </div>
    <div>
      <div id={`${id}-minutes-label`} className="period-picker-time-label">{t('pickerMinutes')}</div>
      <div ref={minuteList} role="listbox" aria-labelledby={`${id}-minutes-label`} className="period-picker-time-list">
        {minutes.map((item) => <button key={item} type="button" role="option" aria-selected={item === minute} disabled={!isAllowed(`${hour}:${item}`)} tabIndex={item === minuteTabStop ? 0 : -1}
          className="component-menu-item" onKeyDown={(event) => navigate(event, 'minute')} onClick={() => onChange(`${hour}:${item}`)}>{item}</button>)}
      </div>
    </div>
  </div>;
}
