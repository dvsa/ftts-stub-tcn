import { Context, HttpRequest } from '@azure/functions';

import httpTrigger from '../../../src/controllers/reservations/index';
import * as reservationsController from '../../../src/controllers/reservations/reservations-controller';
import { ReservationsResponse } from '../../../src/interfaces/reservations';
import { BadRequestError, ReservationNotValidError } from '../../../src/errors';

describe('httpTrigger', () => {
  const httpReq = {} as HttpRequest;
  const context = {} as Context;

  const mockMakeReservation = jest.spyOn(reservationsController, 'makeReservation');
  const mockDeleteReservation = jest.spyOn(reservationsController, 'deleteReservation');

  beforeEach(() => {
    context.res = {};
    context.done = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when called with POST - to make a reservation', () => {
    beforeEach(() => {
      httpReq.method = 'POST';
      httpReq.body = [];
    });

    test('when successful results in a 200 response with the correct format', async () => {
      const response: ReservationsResponse[] = [
        {
          reservationId: '1234567890',
          startDateTime: '2020-07-02T09:06:22+0000',
          testCentreId: '1234567890',
          testTypes: ['CAR'],
        },
      ];

      mockMakeReservation.mockReturnValue(response);

      await httpTrigger(context, httpReq);

      expect(context.res.status).toBe(200);
      expect(context.res.body).toEqual(response);
    });

    test('handles applciation errors with the correct response and format', async () => {
      mockMakeReservation.mockImplementation(() => {
        throw new BadRequestError();
      });

      await httpTrigger(context, httpReq);

      expect(context.res.status).toBe(400);
      expect(context.res.body).toEqual({ code: 400, message: 'Bad Request' });
    });

    test('throws an error when encountering one that is unknown', async () => {
      mockMakeReservation.mockImplementation(() => {
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

  describe('when called with DELETE - to delete a reservation', () => {
    beforeEach(() => {
      httpReq.params = {
        reservationId: '0123456789',
      };
      httpReq.method = 'DELETE';
      httpReq.body = [];
    });

    test('when successful results in a 204 empty response', async () => {
      await httpTrigger(context, httpReq);

      expect(context.res.status).toBe(204);
      expect(context.res.body).toBeUndefined();
    });

    test('handles applciation errors with the correct response and format', async () => {
      mockDeleteReservation.mockImplementation(() => {
        throw new ReservationNotValidError();
      });

      await httpTrigger(context, httpReq);

      expect(context.res.status).toBe(404);
      expect(context.res.body).toEqual({ code: 404, message: 'Reservation no longer valid' });
    });

    test('throws an error when encountering one that is unknown', async () => {
      mockDeleteReservation.mockImplementation(() => {
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
