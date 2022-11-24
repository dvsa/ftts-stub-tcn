import { DateAvailability } from '../interfaces/slots';

export const isInvalid = (date: Date): boolean => Number.isNaN(date.getTime());

export const spansMoreThan6Months = (dateFrom: Date, dateTo: Date): boolean => {
  // Warning this is not precise and is not intended to be, just need a rough calculation
  const monthInMs = 1000 * 60 * 60 * 24 * 31;
  const diffInMonths = (dateTo.getTime() - dateFrom.getTime()) / monthInMs;
  return diffInMonths > 6;
};

/**
 * Create an availability object *loosely* based on some of the TCN rules.
 * @param preferredDate preferred date as given in the request
 * @returns an optional date availability object with all three paramaters set
 */
export const generateAvailabilityBasedOnPreferredDate = (preferredDate: Date): DateAvailability => {
  const today = new Date().toISOString();

  // The first date on or before the preferred date that has slots available for the particular test type(s) and test centre selected.
  const dateAvailableOnOrBeforePreferredDate: string = today;

  // The first date on or after the preferred date that has slots available for the particular test type(s) and test centre selected.
  const dateAvailableOnOrAfterPreferredDate: string = preferredDate.toISOString();

  // The first date on or after or on today that has slots available for the particular test type(s) and test centre selected.
  const dateAvailableOnOrAfterToday = today;

  return {
    dateAvailableOnOrBeforePreferredDate,
    dateAvailableOnOrAfterPreferredDate,
    dateAvailableOnOrAfterToday,
  };
};
