import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSchedulerEvent, schedulerEventsInRange, upsertSchedulerEvent, urgencyLevels } from '../src/lib/components/scheduler/events.ts';

const event = { id: 'one', title: 'Planning', start: '2026-10-21T09:00', end: '2026-10-21T10:00', urgency: 'normal', description: '' };

test('scheduler counts the displayed period rather than all events', () => {
  const events = [
    event,
    { ...event, id: 'two', start: '2026-10-21T14:00', end: '2026-10-21T15:00', urgency: 'high' },
    { ...event, id: 'three', start: '2026-10-22T09:00', end: '2026-10-22T10:00' },
    { ...event, id: 'four', start: '2026-10-23T09:00', end: '2026-10-23T10:00' },
    { ...event, id: 'five', start: '2026-11-01T09:00', end: '2026-11-01T10:00' },
  ];
  const start = new Date('2026-10-21T00:00');
  const end = new Date('2026-10-22T00:00');
  assert.deepEqual(schedulerEventsInRange(events, start, end).map(item => item.id), ['one', 'two']);
  assert.equal(schedulerEventsInRange(events, new Date('2026-10-18T00:00'), new Date('2026-10-25T00:00')).length, 4);
  assert.equal(schedulerEventsInRange(events, new Date('2026-10-24T00:00'), new Date('2026-10-25T00:00')).length, 0);
  assert.equal(schedulerEventsInRange(events.filter(item => item.urgency === 'high'), start, end).length, 1);
});

test('scheduler counts overlapping and overnight events once, with exclusive range ends', () => {
  const events = [
    { ...event, id: 'ends-at-start', start: '2026-10-20T23:00', end: '2026-10-21T00:00' },
    { ...event, id: 'overnight', start: '2026-10-20T23:30', end: '2026-10-21T00:30' },
    { ...event, id: 'spanning', start: '2026-10-20T10:00', end: '2026-10-23T10:00' },
    { ...event, id: 'starts-at-start', start: '2026-10-21T00:00', end: '2026-10-21T01:00' },
    { ...event, id: 'starts-at-end', start: '2026-10-22T00:00', end: '2026-10-22T01:00' },
  ];
  assert.deepEqual(schedulerEventsInRange(events, new Date('2026-10-21T00:00'), new Date('2026-10-22T00:00')).map(item => item.id),
    ['overnight', 'spanning', 'starts-at-start']);
});

test('scheduler validates urgency, titles, dates and strictly increasing event times', () => {
  for (const urgency of urgencyLevels) assert.equal(parseSchedulerEvent({ ...event, urgency }).urgency, urgency);
  assert.equal(parseSchedulerEvent({ ...event, title: '  Planning  ' }).title, 'Planning');
  for (const overrides of [
    { title: '   ' }, { title: 'x'.repeat(121) }, { start: '2026-02-30T09:00' },
    { start: 'invalid' }, { end: event.start }, { end: '2026-10-21T08:00' },
    { urgency: 'unknown' }, { description: null }, { id: '' },
  ]) assert.equal(parseSchedulerEvent({ ...event, ...overrides }), null);
});

test('scheduler supports events crossing midnight and year boundaries', () => {
  assert.ok(parseSchedulerEvent({ ...event, start: '2026-12-31T23:30', end: '2027-01-01T01:00' }));
  assert.ok(parseSchedulerEvent({ ...event, start: '2024-02-29T23:30', end: '2024-03-01T00:30' }));
});

test('editing or dragging an event preserves the other events and never mutates caller state', () => {
  const second = { ...event, id: 'two', urgency: 'critical' };
  const source = Object.freeze([Object.freeze({ ...event }), Object.freeze({ ...second })]);
  const updated = { ...event, start: '2026-10-22T11:00', end: '2026-10-22T12:00' };
  assert.deepEqual(upsertSchedulerEvent(source, updated), [updated, second]);
  assert.equal(source[0].start, '2026-10-21T09:00');
  const added = { ...event, id: 'three' };
  assert.deepEqual(upsertSchedulerEvent(source, added), [event, second, added]);
});
