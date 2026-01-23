import { endOfWeek, format, startOfWeek, subWeeks } from "date-fns";

/**
 * Formats a duration in milliseconds to a human-readable string.
 * Examples:
 * - 45s (seconds only if < 1m)
 * - 45m (minutes only if < 1h)
 * - 1h, 1.5h (hours with decimals if >= 1h)
 */
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  if (totalSeconds >= 3600) {
    const hours = totalSeconds / 3600;
    return `${parseFloat(hours.toFixed(1))}h`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}m`;
};

/**
 * Formats a duration in milliseconds to a detailed human-readable string.
 * Format: "Xh Ym" or "Ym" (if < 1h)
 * Rounds minutes down.
 */
export const formatDurationDetailed = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

/**
 * Normalizes time components into total milliseconds.
 * Handles overflows (e.g., 90 seconds -> 1m 30s).
 */
export const normalizeTime = (hours: number, minutes: number, seconds: number): number => {
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
};

/**
 * Parses milliseconds into hours, minutes, and seconds.
 */
export const parseTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
};

/**
 * Returns the start date (Monday) of the week for the given date, adjusted by the offset.
 * @param date The reference date (usually today)
 * @param weekOffset 0 for current week, 1 for previous week, etc.
 */
export const getStartOfMondayWeek = (date: Date, weekOffset: number = 0): Date => {
  const currentWeekStart = startOfWeek(date, { weekStartsOn: 1 });
  return subWeeks(currentWeekStart, weekOffset);
};

/**
 * Returns a formatted string (e.g., "Jan 19 - Jan 25") representing the Monday-Sunday range.
 * @param date The reference date (usually today)
 * @param weekOffset 0 for current week, 1 for previous week, etc.
 */
export const getWeekRangeLabel = (date: Date, weekOffset: number = 0): string => {
  const start = getStartOfMondayWeek(date, weekOffset);
  const end = endOfWeek(start, { weekStartsOn: 1 });
  return `${format(start, "MMM d")} - ${format(end, "MMM d")}`;
};
