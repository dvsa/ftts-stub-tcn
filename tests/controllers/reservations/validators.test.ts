import { validateReservationRequest, validateReservationId, isSlotReserved } from '../../../src/controllers/reservations/validators';
import { BadRequestError } from '../../../src/errors';
import { ReservationsRequest } from '../../../src/interfaces/reservations';
import { KeyValue } from '../../../src/interfaces/slots';

const string72 = 'c'.repeat(72);
const string100 = 'c'.repeat(100);
describe('Reservations validators', () => {
  describe('validateReservationRequest', () => {
    let reservationRequest: ReservationsRequest;

    beforeEach(() => {
      reservationRequest = {
        testCentreId: 'test-centre',
        testTypes: ['Car'],
        startDateTime: '2020-07-02T09:06:22+0000',
        lockTime: 15,
        quantity: 1,
      };
    });

    describe('succesfully validates', () => {
      test('when the request contains valid data ', () => {
        expect(validateReservationRequest(reservationRequest)).toBe(true);
      });
    });

    describe('returns false', () => {
      test('when called with an empty object', () => {
        expect(validateReservationRequest({} as any)).toBe(false);
      });

      describe('for testCentreId', () => {
        test('when not a string', () => {
          reservationRequest.testCentreId = undefined;

          expect(validateReservationRequest(reservationRequest)).toBe(false);
        });

        test('when less than 1 characters', () => {
          reservationRequest.testCentreId = ' ';

          expect(validateReservationRequest(reservationRequest)).toBe(false);
        });

        test('when greater than 72 characters', () => {
          reservationRequest.testCentreId = string100;

          expect(validateReservationRequest(reservationRequest)).toBe(false);
        });
      });

      test('when startDateTime is invalid', () => {
        reservationRequest.startDateTime = '';

        expect(validateReservationRequest(reservationRequest)).toBe(false);
      });

      describe('for the testTypes array', () => {
        test('when missing from the request', () => {
          delete reservationRequest.testTypes;

          expect(validateReservationRequest(reservationRequest)).toBe(false);
        });

        test('when empty', () => {
          reservationRequest.testTypes = [];

          expect(validateReservationRequest(reservationRequest)).toBe(false);
        });
      });

      describe('for lockTime and quantity', () => {
        test('when lockTime is less than 1', () => {
          reservationRequest.lockTime = 0;

          expect(validateReservationRequest(reservationRequest)).toBe(false);
        });

        test('when quantity is less than 1', () => {
          reservationRequest.quantity = 0;

          expect(validateReservationRequest(reservationRequest)).toBe(false);
        });
      });
    });
  });

  describe('validateReservationId', () => {
    let params: KeyValue;
    beforeEach(() => {
      params = {
        reservationId: '0123456789',
      };
    });

    describe('returns a valid reservation id successfully', () => {
      test('when id is 10 characters', () => {
        params.reservationId = '0123456789';

        const result = validateReservationId(params);

        expect(result).toEqual(params.reservationId);
      });

      test('when id is 72 characters', () => {
        params.reservationId = string72;

        const result = validateReservationId(params);

        expect(result).toEqual(params.reservationId);
      });
    });

    describe('throws a Bad Request Error when reservation id is', () => {
      test('not a string', () => {
        params.reservationId = null;

        expect(() => validateReservationId(params)).toThrow(BadRequestError);
      });

      test('less than 10 characters', () => {
        params.reservationId = '123';

        expect(() => validateReservationId(params)).toThrow(BadRequestError);
      });
      test('greater than 72 characters', () => {
        params.reservationId = string100;

        expect(() => validateReservationId(params)).toThrow(BadRequestError);
      });
    });
  });

  describe('isSlotReserved', () => {
    test('returns true given a datetime with a time of 11am (reserved)', () => {
      const reservedStartDateTime = '2020-07-02T11:00:00+0000';

      expect(isSlotReserved(reservedStartDateTime)).toBe(true);
    });

    test('returns false given a datetime with a time different from 11am (not reserved)', () => {
      const notReservedStartDateTime = '2020-10-21T11:30:00+0000';

      expect(isSlotReserved(notReservedStartDateTime)).toBe(false);
    });
  });
});
