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
