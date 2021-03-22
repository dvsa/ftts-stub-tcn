import { HttpRequest } from '@azure/functions';
import { BookingFullResponse, BookingRequest, BookingResponse } from '../../../src/interfaces/bookings';
import {
  confirmBooking,
  deleteBooking,
  getBooking,
  putBooking,
} from '../../../src/controllers/bookings/bookings-controller';
import {
  BadRequestError,
  UnauthorisedError,
  ForbiddenError,
  ReservationNotValidError,
  InternalServerError,
  ServiceUnavailableError,
  ApplicationError,
} from '../../../src/errors';
import { KeyValue } from '../../../src/interfaces/slots';
import { NotesBehaviouralMarkers, staticBookingResponseDetails } from '../../../src/controllers/bookings/validators';

const bookingErrorTriggers: [string, string, typeof ApplicationError][] = [
  ['Unauthorised', '123456-401', UnauthorisedError],
  ['Forbidden', '123456-403', ForbiddenError],
  ['Reservation Not Valid', '123456-404', ReservationNotValidError],
  ['Internal Server Error', '123456-500', InternalServerError],
  ['Service Unavailable', '123456-503', ServiceUnavailableError],
];

const httpReq = {} as HttpRequest;

describe('confirmBooking', () => {
  let bookingRequest;
  let bookingRequests: BookingRequest[];

  beforeEach(() => {
    bookingRequests = [];
    bookingRequest = {
      bookingReferenceId: '1234567890',
      reservationId: '1234567890',
      behaviouralMarkers: '',
      notes: '',
    };
    httpReq.body = bookingRequests;
  });

  describe('returns a successful response', () => {
    test('given multiple valid bookings', () => {
      bookingRequests.push(bookingRequest);
      bookingRequests.push({
        bookingReferenceId: '0123456789',
        reservationId: '0123456789',
        behaviouralMarkers: 'notes here',
        notes: '',
      });

      const result: BookingResponse[] = confirmBooking(httpReq);

      expect(result.length).toEqual(2);
      expect(result).toEqual([
        {
          reservationId: '1234567890',
          message: 'Success',
          status: '200',
        },
        {
          reservationId: '0123456789',
          message: 'Success',
          status: '200',
        },
      ]);
    });
  });

  describe('throws an error', () => {
    test('when called with an empty request', () => {
      expect(() => confirmBooking({} as HttpRequest)).toThrow(BadRequestError);
    });

    test('when called with an undefined body in the request', () => {
      delete httpReq.body;
      expect(() => confirmBooking(httpReq)).toThrow(BadRequestError);
    });

    test('if only one of multiple booking requests is invalid', () => {
      const invalidBookingRequest: BookingRequest = {
        bookingReferenceId: '0',
        reservationId: '1234567890',
        behaviouralMarkers: '',
        notes: '',
      };
      bookingRequests.push(bookingRequest);
      bookingRequests.push(invalidBookingRequest);

      expect(() => confirmBooking(httpReq)).toThrow(BadRequestError);
    });

    test.each(bookingErrorTriggers)('%s when triggered with the correct reservationId', (_, reservationId, error) => {
      bookingRequest.reservationId = reservationId;
      bookingRequests.push(bookingRequest);

      expect(() => confirmBooking(httpReq)).toThrow(error);
    });
  });
});

describe('deleteBooking', () => {
  let params: KeyValue;

  beforeEach(() => {
    params = {
      bookingReferenceId: '0123456789',
    };

    httpReq.params = params;
  });

  describe('succeeds', () => {
    test('given a valid booking reference id', () => {
      expect(() => deleteBooking(httpReq)).not.toThrow();
    });
  });

  describe('throws an error', () => {
    test('when called with no params in the request', () => {
      expect(() => deleteBooking({} as HttpRequest)).toThrow(BadRequestError);
    });

    test('when called with undefined params in the request', () => {
      httpReq.params = undefined;
      expect(() => deleteBooking(httpReq)).toThrow(BadRequestError);
    });

    test('given an invalid booking reference id', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore: Type 'number' is not assignable to type 'string'.
      params.bookingReferenceId = 123;
      expect(() => deleteBooking(httpReq)).toThrow(BadRequestError);
    });

    test.each(bookingErrorTriggers)('%s when triggered with the correct booking reference id', (_, bookingReferenceId, error) => {
      params.bookingReferenceId = bookingReferenceId;

      expect(() => deleteBooking(httpReq)).toThrow(error);
    });
  });
});

describe('getBooking', () => {
  let params: KeyValue;

  beforeEach(() => {
    params = {
      bookingReferenceId: '0123456789',
    };

    httpReq.params = params;
  });

  describe('succesfully retrieves information about a booking', () => {
    test('given a valid booking reference id', () => {
      const result: BookingFullResponse = getBooking(httpReq);

      expect(result).toEqual({
        bookingReferenceId: params.bookingReferenceId,
        notes: '',
        behaviouralMarkers: '',
        ...staticBookingResponseDetails,
      });
    });
  });

  describe('throws an error retrieving information about a booking', () => {
    test('when called with no params in the request', () => {
      expect(() => getBooking({} as HttpRequest)).toThrow(BadRequestError);
    });

    test('when called with undefined params in the request', () => {
      httpReq.params = undefined;
      expect(() => getBooking(httpReq)).toThrow(BadRequestError);
    });

    test('given an invalid booking reference id', () => {
      params.bookingReferenceId = undefined;
      expect(() => getBooking(httpReq)).toThrow(BadRequestError);
    });

    test.each(bookingErrorTriggers)('%s when triggered with the correct booking reference id', (_, bookingReferenceId, error) => {
      params.bookingReferenceId = bookingReferenceId;

      expect(() => getBooking(httpReq)).toThrow(error);
    });
  });
});

describe('putBooking', () => {
  let params: KeyValue;
  let requestBody: NotesBehaviouralMarkers;

  beforeEach(() => {
    params = {
      bookingReferenceId: '0123456789',
    };

    requestBody = {
      notes: 'some notes about the candidate',
      behaviouralMarkers: 'candidate behaviour',
    };

    httpReq.params = params;
    httpReq.body = requestBody;
  });

  describe('succesfully amends information on a booking', () => {
    test('given a valid booking reference id and request', () => {
      const result: BookingFullResponse = putBooking(httpReq);

      expect(result).toEqual({
        bookingReferenceId: params.bookingReferenceId,
        notes: requestBody.notes,
        behaviouralMarkers: requestBody.behaviouralMarkers,
        ...staticBookingResponseDetails,
      });
    });
    test('given a request body with empty values', () => {
      requestBody.notes = '';
      requestBody.behaviouralMarkers = '';

      const result: BookingFullResponse = putBooking(httpReq);

      expect(result).toEqual({
        bookingReferenceId: params.bookingReferenceId,
        notes: '',
        behaviouralMarkers: '',
        ...staticBookingResponseDetails,
      });
    });
  });

  describe('throws an error amending information about a booking', () => {
    test('when called with no params in the request', () => {
      expect(() => putBooking({} as HttpRequest)).toThrow(BadRequestError);
    });

    test('when called with undefined params in the request', () => {
      httpReq.params = undefined;
      expect(() => putBooking(httpReq)).toThrow(BadRequestError);
    });

    test('when called with no params in the request', () => {
      delete httpReq.params;

      expect(() => putBooking(httpReq)).toThrow(BadRequestError);
    });

    test('when called with no body in the request', () => {
      delete httpReq.body;

      expect(() => putBooking(httpReq)).toThrow(BadRequestError);
    });

    test('when given an invalid booking reference id', () => {
      params.bookingReferenceId = undefined;

      expect(() => putBooking(httpReq)).toThrow(BadRequestError);
    });

    test('when given an incomplete/invalid request body', () => {
      delete requestBody.notes;
      delete requestBody.behaviouralMarkers;

      expect(() => putBooking(httpReq)).toThrow(BadRequestError);
    });
  });
});
