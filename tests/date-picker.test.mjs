import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarDays, dayjs, fromNativeValue, parsePickerValue, pickerTimeInRange, toPickerValue } from '../src/lib/components/date-picker/dates.ts';

test('picker values validate leap dates, month bounds and complete year formats', () => {
  for (const [value, mode] of [['2024-02-29', 'day'], ['2026-10', 'month'], ['2026', 'year']]) {
    assert.equal(toPickerValue(parsePickerValue(value, mode), mode), value);
  }
  for (const [value, mode] of [['2025-02-29', 'day'], ['2026-02-30', 'day'], ['2026-13', 'month'], ['26', 'year'], ['', 'day']]) {
    assert.equal(parsePickerValue(value, mode), null);
  }
});

test('Sunday-first weeks retain consistent week numbering across December and January', () => {
  assert.equal(toPickerValue(dayjs('2021-01-01'), 'week'), '2020-W53');
  assert.equal(toPickerValue(dayjs('2025-12-29'), 'week'), '2026-W01');
  assert.equal(parsePickerValue('2020-W53', 'week').format('YYYY-MM-DD'), '2020-12-27');
  assert.equal(parsePickerValue('2026-W01', 'week').format('YYYY-MM-DD'), '2025-12-28');
  assert.equal(toPickerValue(dayjs('2025-12-28'), 'week'), '2026-W01');
  assert.equal(toPickerValue(dayjs('2026-10-24'), 'week'), '2026-W43');
  assert.equal(toPickerValue(dayjs('2026-10-25'), 'week'), '2026-W44');
  const start = parsePickerValue('2026-W43', 'week');
  assert.equal(start.day(), 0);
  for (let offset = 0; offset < 7; offset++) assert.equal(toPickerValue(start.add(offset, 'day'), 'week'), '2026-W43');
  assert.equal(toPickerValue(start.add(7, 'day'), 'week'), '2026-W44');
  for (const value of ['2021-W53', '2026-W00', '2026-W54', '2026-W1']) assert.equal(parsePickerValue(value, 'week'), null);
});

test('calendar contains six full Sunday-first weeks through leap days and DST changes', () => {
  for (const month of ['2024-02-01', '2026-03-01', '2026-10-01', '2026-12-01']) {
    const days = calendarDays(dayjs(month));
    assert.equal(days.length, 42);
    assert.equal(days[0].day(), 0);
    assert.equal(days[41].day(), 6);
    assert.equal(new Set(days.map((date) => date.format('YYYY-MM-DD'))).size, 42);
    for (let index = 1; index < days.length; index++) assert.equal(days[index].diff(days[index - 1], 'day'), 1);
    assert.equal(days.filter((date) => date.month() === dayjs(month).month()).length, dayjs(month).daysInMonth());
  }
});

test('native fallback preserves month and week values and handles clearing', () => {
  assert.equal(fromNativeValue('2021-01-01', 'week', 'date'), '2020-W53');
  assert.equal(fromNativeValue('2026-10-21', 'month', 'date'), '2026-10');
  assert.equal(fromNativeValue('2026-W43', 'week', 'week'), '2026-W43');
  assert.equal(fromNativeValue('', 'month', 'month'), '');
  assert.equal(fromNativeValue('invalid', 'week', 'date'), '');
});

test('optional time uses local minutes and strictly validates dates and hours', () => {
  for (const value of ['2024-02-29T00:00', '2026-10-21T14:35', '2026-12-31T23:59']) {
    const date = parsePickerValue(value, 'day', true);
    assert.ok(date);
    assert.equal(toPickerValue(date, 'day', true), value);
    assert.equal(fromNativeValue(value, 'day', 'datetime-local', true), value);
  }
  for (const value of ['2025-02-29T10:00', '2026-10-21T24:00', '2026-10-21T14:60', '2026-10-21', '2026-10-21T1:30', '2026-10-21T14:35Z']) {
    assert.equal(parsePickerValue(value, 'day', true), null);
    assert.equal(fromNativeValue(value, 'day', 'datetime-local', true), '');
  }
  assert.equal(parsePickerValue('2026-10-21T14:35', 'day'), null);
  assert.equal(fromNativeValue('', 'day', 'datetime-local', true), '');
  assert.equal(toPickerValue(dayjs('2026-10-21T14:35'), 'day'), '2026-10-21');
  assert.equal(toPickerValue(dayjs('2026-10-21T14:35'), 'month', true), '2026-10');
});

test('time-only values use HH:mm without a date or time zone', () => {
  for (const value of ['00:00', '02:30', '12:00', '14:35', '23:59']) {
    const date = parsePickerValue(value, 'time');
    assert.ok(date);
    assert.equal(date.format('YYYY-MM-DD'), '2000-01-01');
    assert.equal(toPickerValue(date, 'time'), value);
    assert.equal(toPickerValue(date, 'time', true), value);
    assert.equal(fromNativeValue(value, 'time', 'time'), value);
  }
  for (const value of ['', '24:00', '12:60', '9:00', '12:0', '12:00:00', '2026-10-21T12:00', '12:00Z']) {
    assert.equal(parsePickerValue(value, 'time'), null);
    assert.equal(fromNativeValue(value, 'time', 'time'), '');
  }
});

test('time-only bounds include endpoints and support intervals crossing midnight', () => {
  for (const value of ['09:30', '12:00', '17:00']) assert.equal(pickerTimeInRange(value, '09:30', '17:00'), true);
  for (const value of ['09:29', '17:01']) assert.equal(pickerTimeInRange(value, '09:30', '17:00'), false);
  for (const value of ['22:00', '23:59', '00:00', '02:00']) assert.equal(pickerTimeInRange(value, '22:00', '02:00'), true);
  for (const value of ['02:01', '12:00', '21:59']) assert.equal(pickerTimeInRange(value, '22:00', '02:00'), false);
  assert.equal(pickerTimeInRange('00:00'), true);
  assert.equal(pickerTimeInRange('09:00', '09:00', '09:00'), true);
  assert.equal(pickerTimeInRange('09:01', '09:00', '09:00'), false);
  assert.equal(pickerTimeInRange('24:00'), false);
});
