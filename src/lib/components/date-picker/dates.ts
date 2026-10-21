import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';

dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

export type PickerMode = 'year' | 'month' | 'week' | 'day' | 'time';

export function startOfPickerWeek(date: Dayjs): Dayjs {
  return date.startOf('day').subtract(date.day(), 'day');
}

export function toPickerValue(date: Dayjs, mode: PickerMode, includeTime = false): string {
  if (mode === 'time') return date.format('HH:mm');
  // Use the following Monday's week number for each Sunday–Saturday period.
  if (mode === 'week') {
    const monday = date.add(1, 'day');
    return `${monday.isoWeekYear()}-W${String(monday.isoWeek()).padStart(2, '0')}`;
  }
  return date.format(mode === 'year' ? 'YYYY' : mode === 'month' ? 'YYYY-MM' : includeTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD');
}

export function parsePickerValue(value: string, mode: PickerMode, includeTime = false): Dayjs | null {
  if (mode === 'time') {
    const date = dayjs(`2000-01-01T${value}`, 'YYYY-MM-DDTHH:mm', true);
    return date.isValid() && date.format('HH:mm') === value ? date : null;
  }
  if (mode === 'week') {
    const match = /^(\d{4})-W(\d{2})$/.exec(value);
    if (!match) return null;
    const week = Number(match[2]);
    if (week < 1 || week > 53) return null;
    const date = dayjs(`${match[1]}-01-04`, 'YYYY-MM-DD', true).startOf('isoWeek').subtract(1, 'day').add(week - 1, 'week');
    return date.isValid() && toPickerValue(date, mode) === value ? date : null;
  }
  const format = mode === 'year' ? 'YYYY' : mode === 'month' ? 'YYYY-MM' : includeTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
  const date = dayjs(value, format, true);
  return date.isValid() && date.format(format) === value ? date : null;
}

export function calendarDays(date: Dayjs): Dayjs[] {
  const start = startOfPickerWeek(date.startOf('month'));
  return Array.from({ length: 42 }, (_, index) => start.add(index, 'day'));
}

/** Time-only limits can cross midnight, like native time inputs. */
export function pickerTimeInRange(value: string, min?: string, max?: string): boolean {
  if (!parsePickerValue(value, 'time')) return false;
  const lower = min && parsePickerValue(min, 'time') ? min : undefined;
  const upper = max && parsePickerValue(max, 'time') ? max : undefined;
  return lower && upper && lower > upper ? value >= lower || value <= upper
    : (!lower || value >= lower) && (!upper || value <= upper);
}

/** Convert native date fallbacks to the same value used by desktop pickers. */
export function fromNativeValue(value: string, mode: PickerMode, nativeType: string, includeTime = false): string {
  if (!value) return '';
  const date = parsePickerValue(value, nativeType === 'date' ? 'day' : mode, nativeType === 'datetime-local');
  return date ? toPickerValue(date, mode, includeTime) : '';
}

export { dayjs };
