export function calculateTimeDifference(startDateTime: string, endDateTime: string) {
  // Parse the date-time strings into Date objects
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  // Calculate the difference in milliseconds
  const diffInMs = endDate.getTime() - startDate.getTime();

  // Calculate difference in days, hours, minutes, and seconds
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  return {
    days: diffInDays,
    hours: diffInHours % 24,
    minutes: diffInMinutes % 60,
    seconds: diffInSeconds % 60,
  };
}
