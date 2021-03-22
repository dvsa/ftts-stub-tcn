import Slot from '../../src/domain/slot';
import config from '../../src/config';

const { dayEndHour, dayStartHour, maxSlotQuantity } = config.slots;

describe('Slot class representing a single slot with start time and quantity', () => {
  test('can be constructed', () => {
    const startTime = new Date('01-01-2020 14:00');
    const quantity = 3;

    const slot = new Slot(startTime, quantity);

    expect(slot).toBeInstanceOf(Slot);
  });

  describe('randomiseStartTime()', () => {
    test('gives the slot a random start time within the working day', () => {
      const slot = new Slot(new Date('01-01-2020 14:00'), 10);

      slot.randomiseStartTime();

      const slotHour = slot.startTime.getHours();
      expect(slotHour).toBeGreaterThanOrEqual(dayStartHour);
      expect(slotHour).toBeLessThanOrEqual(dayEndHour);
    });
  });

  describe('randomiseQuantity()', () => {
    test('gives the slot a random quantity within the max slot quantity', () => {
      const slot = new Slot(new Date('01-01-2020 14:00'), 10);

      slot.randomiseQuantity();

      expect(slot.quantity).toBeGreaterThanOrEqual(1);
      expect(slot.quantity).toBeLessThanOrEqual(maxSlotQuantity);
    });
  });

  describe('equals()', () => {
    test('returns true if slot has same start time as another slot', () => {
      const sameDateTime = '01-01-2020 9:30';
      const slot1 = new Slot(new Date(sameDateTime), 3);
      const slot2 = new Slot(new Date(sameDateTime), 1);

      const result = slot1.equals(slot2);

      expect(result).toBe(true);
    });

    test('returns false if slot has different start time to another slot', () => {
      const slot1 = new Slot(new Date('01-01-2020 9:30'), 2);
      const slot2 = new Slot(new Date('01-01-2020 9:45'), 2);

      const result = slot1.equals(slot2);

      expect(result).toBe(false);
    });
  });

  describe('isBefore()', () => {
    test('returns true if slot date time is earlier than another slot', () => {
      const slot1 = new Slot(new Date('01-01-2020 9:30'), 3);
      const slot2 = new Slot(new Date('01-01-2020 9:45'), 1);

      const result = slot1.isBefore(slot2);

      expect(result).toBe(true);
    });

    test('returns false if slot date time is later than another slot', () => {
      const slot1 = new Slot(new Date('01-01-2020 14:30'), 2);
      const slot2 = new Slot(new Date('01-01-2020 9:45'), 2);

      const result = slot1.isBefore(slot2);

      expect(result).toBe(false);
    });
  });
});
