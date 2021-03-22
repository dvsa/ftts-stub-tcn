import { isInvalid, spansMoreThan6Months } from '../../src/utils/date';

describe('Date utils functions', () => {
  describe('isInvalid', () => {
    test('returns true if the given date is an invalid date', () => {
      const invalidDate = new Date('22.02.21');

      const result = isInvalid(invalidDate);

      expect(result).toBe(true);
    });

    test('returns false if the given date is not an invalid date', () => {
      const validDate = new Date('2021-02-22');

      const result = isInvalid(validDate);

      expect(result).toBe(false);
    });
  });

  describe('spansMoreThan6Months', () => {
    test('returns true if the given date range spans roughly more than 6 months', () => {
      const dateFrom = new Date('2020-01-01');
      const dateTo = new Date('2020-07-10');

      const result = spansMoreThan6Months(dateFrom, dateTo);

      expect(result).toBe(true);
    });

    test('returns false if the given date range spans roughly less than 6 months', () => {
      const dateFrom = new Date('2020-01-01');
      const dateTo = new Date('2020-06-30');

      const result = spansMoreThan6Months(dateFrom, dateTo);

      expect(result).toBe(false);
    });
  });
});
