import { dayjs } from '../date-picker/dates.ts';

export const urgencyLevels = ['low', 'normal', 'high', 'critical'] as const;
export type EventUrgency = (typeof urgencyLevels)[number];

export interface SchedulerEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  urgency: EventUrgency;
  description: string;
}

export const eventDateFormat = 'YYYY-MM-DDTHH:mm';

/** Calendar ranges include their start and exclude their end. */
export function schedulerEventsInRange(events: readonly SchedulerEvent[], start: Date, end: Date): SchedulerEvent[] {
  return events.filter((event) => dayjs(event.start).isBefore(end) && dayjs(event.end).isAfter(start));
}

export function parseSchedulerEvent(input: unknown): SchedulerEvent | null {
  if (!input || typeof input !== 'object') return null;
  const event = input as Record<string, unknown>;
  if (typeof event.id !== 'string' || !event.id.trim() || typeof event.title !== 'string' || !event.title.trim() || event.title.trim().length > 120
    || typeof event.start !== 'string' || typeof event.end !== 'string'
    || !urgencyLevels.includes(event.urgency as EventUrgency)
    || typeof event.description !== 'string' || event.description.length > 4000) return null;
  const start = dayjs(event.start, eventDateFormat, true);
  const end = dayjs(event.end, eventDateFormat, true);
  if (!start.isValid() || !end.isValid() || !end.isAfter(start)) return null;
  return { id: event.id, title: event.title.trim(), start: event.start, end: event.end, urgency: event.urgency as EventUrgency, description: event.description };
}

export function upsertSchedulerEvent(events: SchedulerEvent[], event: SchedulerEvent): SchedulerEvent[] {
  return events.some((item) => item.id === event.id) ? events.map((item) => item.id === event.id ? event : item) : [...events, event];
}
