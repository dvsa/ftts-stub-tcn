import {
  ApplicationError,
  BadRequestError,
  UnauthorisedError,
  ForbiddenError,
  TestCentreNotFoundError,
  ReservationConflictError,
  InternalServerError,
  ReservationNotValidError,
  ServiceUnavailableError,
} from '../../src/errors';

describe('ApplicationError', () => {
  describe('toResponse', () => {
    test('should return the correct response', () => {
      const error = new ApplicationError(1, 'error');

      expect(error.toResponse()).toEqual({ code: 1, message: 'error' });
    });
  });
});

describe('BadRequestError', () => {
  describe('toResponse', () => {
    test('should return the correct response', () => {
      const error = new BadRequestError();

      expect(error.toResponse()).toEqual({ code: 400, message: 'Bad Request' });
    });
  });
});

describe('UnauthorisedError', () => {
  describe('toResponse', () => {
    test('should return the correct response', () => {
      const error = new UnauthorisedError();

      expect(error.toResponse()).toEqual({ code: 401, message: 'Unauthorised' });
    });
  });
});

describe('ForbiddenError', () => {
  describe('toResponse', () => {
    test('should return the correct response', () => {
      const error = new ForbiddenError();

      expect(error.toResponse()).toEqual({ code: 403, message: 'Forbidden' });
    });
  });
});

describe('TestCentreNotFoundError', () => {
  describe('toResponse', () => {
    test('should return the correct response', () => {
      const error = new TestCentreNotFoundError();

      expect(error.toResponse()).toEqual({ code: 404, message: 'Test centre with given id not found' });
    });
  });
});

describe('ReservationConflictError', () => {
  describe('toResponse', () => {
    test('should return the correct response', () => {
      const error = new ReservationConflictError();

      expect(error.toResponse()).toEqual({ code: 409, message: 'Conflict - slot no longer available' });
    });
  });
});

describe('InternalServerError', () => {
  describe('toResponse', () => {
    test('should return the correct response', () => {
      const error = new InternalServerError();

      expect(error.toResponse()).toEqual({ code: 500, message: 'Internal Server Error' });
    });
  });
});

describe('ReservationNotValidError', () => {
  describe('toResponse', () => {
    test('should return the correct response', () => {
      const error = new ReservationNotValidError();

      expect(error.toResponse()).toEqual({ code: 404, message: 'Reservation no longer valid' });
    });
  });
});

describe('ServiceUnavailableError', () => {
  describe('toResponse', () => {
    test('should return the correct response', () => {
      const error = new ServiceUnavailableError();

      expect(error.toResponse()).toEqual({ code: 503, message: 'Service Unavailable' });
    });
  });
});
