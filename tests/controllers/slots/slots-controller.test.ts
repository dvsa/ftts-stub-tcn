import { HttpRequest } from '@azure/functions';
import { getSlots } from '../../../src/controllers/slots/slots-controller';
import {
  TestCentreNotFoundError,
  BadRequestError,
  UnauthorisedError,
  ServiceUnavailableError,
  ForbiddenError,
  InternalServerError,
} from '../../../src/errors';

describe('Slots controller', () => {
  let req: HttpRequest;
  beforeEach(() => {
    req = {
      params: {
        testCentreId: '123-456',
      },
      query: {
        testTypes: '["CAR"]',
        dateFrom: '2020-06-23',
        dateTo: '2020-06-30',
      },
    } as unknown as HttpRequest;
  });

  test('returns array of slots given a valid request', () => {
    const response = getSlots(req);

    expect(response).toBeInstanceOf(Array);
    expect(response).not.toHaveLength(0);
    response.forEach((slot) => {
      expect(slot).not.toHaveProperty('dateAvailableOnOrBeforePreferredDate');
      expect(slot).not.toHaveProperty('dateAvailableOnOrAfterPreferredDate');
      expect(slot).not.toHaveProperty('dateAvailableOnOrAfterToday');
    });
  });

  test('returns array of slots with the optional availability properties given a valid request containing a preferred date', () => {
    // preferred date is before dateTo so we expect only the dateAvailableOnOrBeforePreferredDate property
    req.query.preferredDate = '2020-07-02';
    const response = getSlots(req);

    expect(response).toBeInstanceOf(Array);
    expect(response).not.toHaveLength(0);
    response.forEach((slot) => {
      expect(slot).toHaveProperty('dateAvailableOnOrBeforePreferredDate');
      expect(slot).toHaveProperty('dateAvailableOnOrAfterPreferredDate');
      expect(slot).toHaveProperty('dateAvailableOnOrAfterToday');
    });
  });

  test('throws a BadRequestError if there is no testTypes query param', () => {
    req.query.testTypes = undefined;
    expect(() => getSlots(req)).toThrow(BadRequestError);
  });

  test('throws a BadRequestError if there is no dateTo  query param', () => {
    req.query.dateTo = undefined;
    expect(() => getSlots(req)).toThrow(BadRequestError);
  });

  test('throws a BadRequestError if there is no dateFrom query param', () => {
    req.query.dateFrom = undefined;
    expect(() => getSlots(req)).toThrow(BadRequestError);
  });

  test('throws a BadRequestError given an invalid request', () => {
    req.query.dateFrom = 'NOT-A-DATE';
    expect(() => getSlots(req)).toThrow(BadRequestError);
  });

  test('throws a BadRequestError if there is no testcentreid param', () => {
    req.params.testCentreId = undefined;
    expect(() => getSlots(req)).toThrow(BadRequestError);
  });

  test('throws an UnauthorisedError given the defined trigger input', () => {
    req.params.testCentreId = '123456-401';
    expect(() => getSlots(req)).toThrow(UnauthorisedError);
  });

  test('throws a TestCentreNotFoundError given the defined trigger input', () => {
    req.params.testCentreId = '123456-404';
    expect(() => getSlots(req)).toThrow(TestCentreNotFoundError);
  });

  test('throws a generic internal server error given the defined trigger input', () => {
    req.params.testCentreId = '123456-500';
    expect(() => getSlots(req)).toThrow(InternalServerError);
  });

  test('throws a Forbidden error given the defined trigger input', () => {
    req.params.testCentreId = '123456-403';
    expect(() => getSlots(req)).toThrow(ForbiddenError);
  });

  test('throws a Service Unavailable error given the defined trigger input', () => {
    req.params.testCentreId = '123456-503';
    expect(() => getSlots(req)).toThrow(ServiceUnavailableError);
  });
});
