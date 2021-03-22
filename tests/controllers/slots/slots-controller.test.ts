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
  let req;
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
    };
  });

  test('returns array of slots given a valid request', () => {
    const response = getSlots(req);

    expect(response).toBeInstanceOf(Array);
    expect(response).not.toHaveLength(0);
  });

  test('throws a BadRequestError given an invalid request', () => {
    req.query.dateFrom = 'NOT-A-DATE';

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
