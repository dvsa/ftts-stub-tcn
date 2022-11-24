import { Context } from '@azure/functions';

import httpTrigger from '../../../src/controllers/slots/index';
import * as slotsController from '../../../src/controllers/slots/slots-controller';
import { SlotResponse } from '../../../src/interfaces/slots';
import { InternalServerError, TooManyRequestsError } from '../../../src/errors';

describe('httpTrigger', () => {
  const context = {} as Context;

  beforeEach(() => {
    context.res = {};
    context.done = jest.fn();
  });

  test('get slots request responds with a 200', async () => {
    // Arrange
    const response: SlotResponse[] = [
      {
        quantity: 1,
        startDateTime: '2020-07-02T09:06:22+0000',
        testCentreId: '1234567890',
        testTypes: ['CAR'],
      },
    ];
    slotsController.getSlots = jest.fn().mockReturnValue(response);

    // Act
    await httpTrigger(context, { body: [] });

    // Assert
    expect(context.res.body).toEqual(response);
  });

  test('get slots request error is handled', async () => {
    // Arrange
    slotsController.getSlots = jest.fn().mockImplementation(() => {
      throw new InternalServerError();
    });

    // Act
    await httpTrigger(context, { body: [] });

    // Assert
    expect(context.res.status).toBe(500);
    expect(context.res.body).toEqual({ code: 500, message: 'Internal Server Error' });
  });

  test('handles application 429 error with the correct response and format', async () => {
    // Arrange
    slotsController.getSlots = jest.fn().mockImplementation(() => {
      throw new TooManyRequestsError();
    });

    await httpTrigger(context, { body: [] });

    expect(context.res.status).toBe(429);
    expect(context.res.headers).toEqual({
      'Content-Type': 'application/json',
      'Retry-After': 3600,
    });
    expect(context.res.body).toEqual({ code: 429, message: 'Too Many Requests' });
  });

  test('should throw an error if its not a known error', () => {
    // Arrange
    slotsController.getSlots = jest.fn().mockImplementation(() => {
      throw new Error('Unknown Error');
    });

    expect(() => httpTrigger(context, { body: [] })).toThrow(Error('Unknown Error'));
  });
});
