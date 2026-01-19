/**
 * Formats a duration in milliseconds to a human-readable string.
 * Examples: 
 * - < 1m (less than a minute)
 * - 45m (minutes only)
 * - 1h, 1.5h (hours with decimals if >= 1h)
 */
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds < 60) return "< 1m";
  
  if (totalSeconds >= 3600) {
    const hours = totalSeconds / 3600;
    return `${parseFloat(hours.toFixed(1))}h`;
  }
  
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}m`;
};
