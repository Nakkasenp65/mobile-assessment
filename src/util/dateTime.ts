// src/util/dateTime.ts

/**
 * Combines appointment date and time into ISO 8601 UTC format for queue booking API
 *
 * @param date - Date string in format "YYYY-MM-DD" or Date object
 * @param time - Time string in format "HH:mm"
 * @returns ISO 8601 datetime string in UTC format (e.g., "2025-01-31T14:30:00.000Z")
 *
 * @example
 * combineDateTime("2025-01-31", "14:30") // Returns "2025-01-31T14:30:00.000Z"
 */
export function combineDateTime(date: string | Date, time: string): string {
  // Convert date to string if it's a Date object
  const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;

  // Ensure time is in HH:mm format
  const timeStr = time.includes(":") ? time : `${time}:00`;

  // Combine date and time in UTC format with .000Z
  return `${dateStr}T${timeStr}:00.000Z`;
}

/**
 * Validates if a date string is in the correct format
 *
 * @param date - Date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDateString(date: string | Date): boolean {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

/**
 * Validates if a time string is in the correct format
 *
 * @param time - Time string to validate (HH:mm format)
 * @returns true if valid, false otherwise
 */
export function isValidTimeString(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}
