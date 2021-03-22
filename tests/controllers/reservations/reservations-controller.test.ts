import { HttpRequest } from '@azure/functions';
import { makeReservation, deleteReservation } from '../../../src/controllers/reservations/reservations-controller';
import { ReservationsRequest, ReservationsResponse } from '../../../src/interfaces/reservations';
import {
  BadRequestError,
  ReservationConflictError,
  UnauthorisedError,
  ForbiddenError,
  InternalServerError,
  ServiceUnavailableError,
  ApplicationError,
  ReservationNotValidError,
} from '../../../src/errors';
import { KeyValue } from '../../../src/interfaces/slots';

const makeReservationsErrorTriggers: [string, string, typeof ApplicationError][] = [
  ['Unauthorised', '123456-401', UnauthorisedError],
  ['Forbidden', '123456-403', ForbiddenError],
  ['Internal Server Error', '123456-500', InternalServerError],
  ['Service Unavailable', '123456-503', ServiceUnavailableError],
];

const deleteReservationsErrorTriggers = makeReservationsErrorTriggers.slice();
deleteReservationsErrorTriggers.push(
  ['Reservation Not Valid', '123456-404', ReservationNotValidError],
);

let reservationsRequest: ReservationsRequest;
let reservationsRequests: ReservationsRequest[];
const httpReq = {} as HttpRequest;

describe('makeReservation', () => {
  beforeEach(() => {
    reservationsRequests = [];
    reservationsRequest = {
      testCentreId: 'test-centre',
      testTypes: ['Car'],
      startDateTime: '2020-07-02T09:06:22+0000',
      lockTime: 15,
      quantity: 1,
    };
    httpReq.body = reservationsRequests;
  });

  describe('returns a successful response', () => {
    test('givevn a valid reservations request', () => {
      reservationsRequests.push(reservationsRequest);

      const result: ReservationsResponse[] = makeReservation(httpReq);

      expect(result).toEqual([{
        testCentreId: 'test-centre',
        testTypes: ['Car'],
        startDateTime: '2020-07-02T09:06:22+0000',
        reservationId: '5050302b-e9f5-476e-b22b-6856a8026e81',
      }]);
    });

    test('given multiple valid reservations requests with multiple quantities', () => {
      reservationsRequests.push(reservationsRequest);
      reservationsRequests.push({
        testCentreId: 'test-centre',
        testTypes: ['Car', 'Motorcycle'],
        startDateTime: '2020-07-02T15:06:22+0000',
        lockTime: 15,
        quantity: 4,
      });

      const result: ReservationsResponse[] = makeReservation(httpReq);

      expect(result.length).toEqual(5);
    });
  });

  describe('throws', () => {
    describe('a BadRequestError', () => {
      test('when called with an empty request', () => {
        expect(() => makeReservation({} as HttpRequest)).toThrow(BadRequestError);
      });

      test('when called with an undefined body in the request', () => {
        delete httpReq.body;

        expect(() => makeReservation(httpReq)).toThrow(BadRequestError);
      });

      test('when called with an invalid reservations request', () => {
        const invalidReservationsRequest: ReservationsRequest = {
          testCentreId: 'invalid',
          testTypes: ['Horse'],
          startDateTime: '2020-07-02T09:06:22+0000',
          lockTime: 0,
          quantity: 1,
        };
        reservationsRequests.push(invalidReservationsRequest);

        expect(() => makeReservation(httpReq)).toThrow(BadRequestError);
      });
    });

    test('a ReservationConflictError if the startDateTime is 11:00 (slot is reserved)', () => {
      reservationsRequest.startDateTime = '2020-07-02T11:00:00+0000';
      reservationsRequests.push(reservationsRequest);

      expect(() => makeReservation(httpReq)).toThrow(ReservationConflictError);
    });

    test.each(makeReservationsErrorTriggers)('%s when triggered with the correct test centre id', (_, testCentreId, error) => {
      reservationsRequest.testCentreId = testCentreId;
      reservationsRequests.push(reservationsRequest);

      expect(() => makeReservation(httpReq)).toThrow(error);
    });
  });
});

describe('deleteReservation', () => {
  let params: KeyValue;

  beforeEach(() => {
    params = {
      reservationId: '0123456789',
    };

    httpReq.params = params;
  });

  describe('succeeds', () => {
    test('given a valid reservationId', () => {
      expect(() => deleteReservation(httpReq)).not.toThrow();
    });
  });

  describe('throws an error', () => {
    test('when called with no params in the request', () => {
      expect(() => deleteReservation({} as HttpRequest)).toThrow(BadRequestError);
    });

    test('when called with undefined params in the request', () => {
      httpReq.params = undefined;
      expect(() => deleteReservation(httpReq)).toThrow(BadRequestError);
    });

    test('given an invalid booking reference id', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore: Type 'number' is not assignable to type 'string'.
      params.reservationId = true;
      expect(() => deleteReservation(httpReq)).toThrow(BadRequestError);
    });

    test.each(deleteReservationsErrorTriggers)('%s when triggered with the correct reservationId', (_, reservationId, error) => {
      params.reservationId = reservationId;

      expect(() => deleteReservation(httpReq)).toThrow(error);
    });
  });
});
