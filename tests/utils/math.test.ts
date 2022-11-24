import { random, sample } from '../../src/utils/math';

describe('Math utils functions', () => {
  describe('random', () => {
    test('generates a random number between two given numbers', () => {
      const min = 8;
      const max = 14;

      const result = random(min, max);

      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
  });

  describe('sample', () => {
    test('randomly picks a value from an array', () => {
      const arr = [5, 10, 15, 20];

      const result = sample(arr);

      expect(arr).toContain(result);
    });
  });
});
