import { Context, HttpRequest } from '@azure/functions';

import httpTrigger from '../../../src/controllers/bookings/index';
import { BadRequestError, InternalServerError, ReservationNotValidError } from '../../../src/errors';
import { BookingFullResponse, BookingResponse } from '../../../src/interfaces/bookings';

import * as bookingsController from '../../../src/controllers/bookings/bookings-controller';
import { KeyValue } from '../../../src/interfaces/slots';
import { NotesBehaviouralMarkers, staticBookingResponseDetails } from '../../../src/controllers/bookings/validators';

describe('httpTrigger', () => {
  const httpReq = {} as HttpRequest;
  const context = {} as Context;

  const mockGetBooking = jest.spyOn(bookingsController, 'getBooking');
  const mockPostBooking = jest.spyOn(bookingsController, 'confirmBooking');
  const mockPutBooking = jest.spyOn(bookingsController, 'putBooking');
  const mockDeleteBooking = jest.spyOn(bookingsController, 'deleteBooking');

  const params: KeyValue = {
    bookingReferenceId: '0123456789',
  };

  beforeEach(() => {
    context.res = {};
    context.done = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when called with POST - to confirm a booking', () => {
    beforeEach(() => {
      httpReq.method = 'POST';
      httpReq.body = [];
    });

    test('when successful results in a 200 response with the correct format', async () => {
      const response: BookingResponse[] = [
        {
          reservationId: '1234567890',
          message: 'Success',
          status: '200',
        },
      ];
      mockPostBooking.mockReturnValue(response);

      await httpTrigger(context, httpReq);

      expect(context.res.status).toBe(200);
      expect(context.res.body).toEqual(response);
    });
    test('handles applciation errors with the correct response and format', async () => {
      mockPostBooking.mockImplementation(() => {
        throw new ReservationNotValidError();
      });

      await httpTrigger(context, httpReq);

      expect(context.res.status).toBe(404);
      expect(context.res.body).toEqual({ code: 404, message: 'Reservation no longer valid' });
    });
    test('throws an error when encountering one that is unknown', async () => {
      mockPostBooking.mockImplementation(() => {
        throw new Error('Unknown Error');
      });

      try {
        await httpTrigger(context, httpReq);
        fail('should have thrown an error');
      } catch (e) {
        expect(e.message).toEqual('Unknown Error');
      }
    });
  });

  describe('when called with DELETE/GET/PUT', () => {
    beforeEach(() => {
      httpReq.params = params;
    });

    describe('DELETE - to release a booking', () => {
      beforeEach(() => {
        httpReq.method = 'DELETE';
      });

      test('when successful results in a 204 empty response', async () => {
        await httpTrigger(context, httpReq);

        expect(context.res.status).toBe(204);
        expect(context.res.body).toBeUndefined();
      });

      test('handles application errors with the correct response and format', async () => {
        mockDeleteBooking.mockImplementation(() => {
          throw new InternalServerError();
        });

        await httpTrigger(context, httpReq);

        expect(context.res.status).toBe(500);
        expect(context.res.body).toEqual({ code: 500, message: 'Internal Server Error' });
      });

      test('throws an error when encountering one that is unknown', async () => {
        mockDeleteBooking.mockImplementation(() => {
          throw new Error('Unknown Error');
        });

        try {
          await httpTrigger(context, httpReq);
          fail('should have thrown an error');
        } catch (e) {
          expect(e.message).toEqual('Unknown Error');
        }
      });
    });

    describe('GET - to get booking information', () => {
      beforeEach(() => {
        httpReq.method = 'GET';
      });

      test('when successful results in a 200 response with the correct format', async () => {
        const response: BookingFullResponse = {
          bookingReferenceId: '0123456789',
          notes: 'notes here',
          behaviouralMarkers: 'observations about the candidate',
          ...staticBookingResponseDetails,
        };

        mockGetBooking.mockReturnValue(response);

        await httpTrigger(context, httpReq);

        expect(context.res.status).toBe(200);
        expect(context.res.body).toEqual(response);
      });

      test('handles application errors with the correct response and format', async () => {
        mockGetBooking.mockImplementation(() => {
          throw new BadRequestError();
        });

        await httpTrigger(context, httpReq);

        expect(context.res.status).toBe(400);
        expect(context.res.body).toEqual({ code: 400, message: 'Bad Request' });
      });

      test('throws an error when encountering one that is unknown', async () => {
        jest.spyOn(bookingsController, 'getBooking').mockImplementation(() => {
          throw new Error('Unknown Error');
        });

        try {
          await httpTrigger(context, httpReq);
          fail('should have thrown an error');
        } catch (e) {
          expect(e.message).toEqual('Unknown Error');
        }
      });
    });

    describe('PUT - to update notes or behavioural markers on a booking', () => {
      const notesAndBehaviouralMarkers: NotesBehaviouralMarkers = {
        notes: 'notes here',
        behaviouralMarkers: 'observations about the candidate',
      };

      beforeEach(() => {
        httpReq.method = 'PUT';
        httpReq.body = notesAndBehaviouralMarkers;
      });

      test('when successful results in a 200 response with the correct format', async () => {
        const response: BookingFullResponse = {
          bookingReferenceId: '0123456789',
          notes: 'notes here',
          behaviouralMarkers: 'observations about the candidate',
          ...staticBookingResponseDetails,
        };

        mockPutBooking.mockReturnValue(response);

        await httpTrigger(context, httpReq);

        expect(context.res.status).toBe(200);
        expect(context.res.body).toEqual(response);
      });

      test('handles application errors with the correct response and format', async () => {
        mockPutBooking.mockImplementation(() => {
          throw new ReservationNotValidError();
        });

        await httpTrigger(context, httpReq);

        expect(context.res.status).toBe(404);
        expect(context.res.body).toEqual({ code: 404, message: 'Reservation no longer valid' });
      });

      test('throws an error when encountering one that is unknown', async () => {
        mockPutBooking.mockImplementation(() => {
          throw new Error('Unknown Error');
        });

        try {
          await httpTrigger(context, httpReq);
          fail('should have thrown an error');
        } catch (e) {
          expect(e.message).toEqual('Unknown Error');
        }
      });
    });
  });
});
