export const isInvalid = (date: Date): boolean => Number.isNaN(date.getTime());

export const spansMoreThan6Months = (dateFrom: Date, dateTo: Date): boolean => {
  // Warning this is not precise and is not intended to be, just need a rough calculation
  const monthInMs = 1000 * 60 * 60 * 24 * 31;
  const diffInMonths = (dateTo.getTime() - dateFrom.getTime()) / monthInMs;
  return diffInMonths > 6;
};
