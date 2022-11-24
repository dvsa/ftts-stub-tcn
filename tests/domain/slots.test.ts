import Slots from '../../src/domain/slots';
import Slot from '../../src/domain/slot';
import config from '../../src/config';

describe('Slots class representing a set of slots for a test centre', () => {
  const mockTestCentreId = '123-456';
  const mockTestTypes = ['CAR'];

  describe('generateRandomBetween()', () => {
    test('populates random set of slots within the given date range', () => {
      const dateFrom = new Date('2020-06-20 00:00');
      const dateTo = new Date('2020-06-27 23:59');
      const slots = new Slots(
        mockTestCentreId,
        mockTestTypes,
        [],
      );

      slots.generateRandomBetween(dateFrom, dateTo);

      const slotsArray = slots.asArray();
      expect(slotsArray).toBeInstanceOf(Array);
      slotsArray.forEach((slot) => {
        expect(slot.startTime.getTime()).toBeGreaterThanOrEqual(dateFrom.getTime());
        expect(slot.startTime.getTime()).toBeLessThanOrEqual(dateTo.getTime());
        expect(config.slots.skipDays).not.toContain(slot.startTime.getDay());
      });
    });
  });

  describe('sortByDateTime()', () => {
    test('sorts the slots by date time', () => {
      const slot1 = new Slot(new Date('2020-06-19 09:30'), 5);
      const slot2 = new Slot(new Date('2020-06-20 09:30'), 2);
      const slot3 = new Slot(new Date('2020-06-20 14:00'), 4);
      const mockUnorderedSlots = [slot3, slot2, slot1];
      const slots = new Slots(
        mockTestCentreId,
        mockTestTypes,
        mockUnorderedSlots,
      );

      slots.sortByDateTime();

      expect(slots.asArray()).toStrictEqual([slot1, slot2, slot3]);
    });
  });

  describe('toResponse()', () => {
    // Set date inputs in UTC to avoid BST issues
    const slot1 = new Slot(new Date(Date.UTC(2020, 5, 24, 10, 30)), 5);
    const slot2 = new Slot(new Date(Date.UTC(2020, 5, 25, 14, 0)), 3);
    const slots = new Slots(
      mockTestCentreId,
      mockTestTypes,
      [slot1, slot2],
    );

    test('maps slots to json response body given no availability object', () => {
      const response = slots.toResponse();

      expect(response).toStrictEqual([
        {
          testCentreId: mockTestCentreId,
          testTypes: mockTestTypes,
          startDateTime: '2020-06-24T10:30:00.000Z',
          quantity: 5,
        },
        {
          testCentreId: mockTestCentreId,
          testTypes: mockTestTypes,
          startDateTime: '2020-06-25T14:00:00.000Z',
          quantity: 3,
        },
      ]);
    });

    test('maps slots to json response body given an availability object', () => {
      const response = slots.toResponse({
        dateAvailableOnOrAfterToday: slot1.startTime.toISOString(),
        dateAvailableOnOrAfterPreferredDate: slot1.startTime.toISOString(),
      });

      expect(response).toStrictEqual([
        {
          testCentreId: mockTestCentreId,
          testTypes: mockTestTypes,
          startDateTime: '2020-06-24T10:30:00.000Z',
          quantity: 5,
          dateAvailableOnOrAfterToday: '2020-06-24T10:30:00.000Z',
          dateAvailableOnOrAfterPreferredDate: '2020-06-24T10:30:00.000Z',
        },
        {
          testCentreId: mockTestCentreId,
          testTypes: mockTestTypes,
          startDateTime: '2020-06-25T14:00:00.000Z',
          quantity: 3,
          dateAvailableOnOrAfterToday: '2020-06-24T10:30:00.000Z',
          dateAvailableOnOrAfterPreferredDate: '2020-06-24T10:30:00.000Z',
        },
      ]);
    });
  });
});
