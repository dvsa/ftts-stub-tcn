import checkForErrorTriggers from '../../src/utils/checkForErrorTriggers';
import {
  UnauthorisedError, ForbiddenError, TestCentreNotFoundError, InternalServerError, ReservationNotValidError, TooManyRequestsError,
} from '../../src/errors';
import { RequestType } from '../../src/enums';

describe('checkForErrorTriggers', () => {
  test('should not throw an error if testCentreId if not a error trigger', () => {
    expect(() => checkForErrorTriggers('123456789-123', RequestType.SLOTS)).not.toThrow();
  });

  test('should throw an UnauthorisedError if the correct trigger is provided', () => {
    const expectedError = new UnauthorisedError();
    expect(() => checkForErrorTriggers('123456-401', RequestType.SLOTS)).toThrow(expectedError);
  });

  test('should throw an ForbiddenError if the correct trigger is provided', () => {
    const expectedError = new ForbiddenError();
    expect(() => checkForErrorTriggers('123456-403', RequestType.SLOTS)).toThrow(expectedError);
  });

  test('should throw an TestCentreNotFoundError if the correct trigger is provided and Request Type is slots', () => {
    const expectedError = new TestCentreNotFoundError();
    expect(() => checkForErrorTriggers('123456-404', RequestType.SLOTS)).toThrow(expectedError);
  });

  test('should not throw a TestCentreNotFoundError if the correct trigger is provided and Request Type is not slots', () => {
    expect(() => checkForErrorTriggers('123456-404', RequestType.RESERVATIONS)).not.toThrow();
  });

  test('should throw an ReservationNotValidError if the correct trigger is provided and Request Type is confirm booking', () => {
    const expectedError = new ReservationNotValidError();
    expect(() => checkForErrorTriggers('123456-404', RequestType.CONFIRM_BOOKING)).toThrow(expectedError);
  });

  test('should not throw a ReservationNotValidError if the correct trigger is provided and Request Type is not confirm booking', () => {
    expect(() => checkForErrorTriggers('123456-404', RequestType.RESERVATIONS)).not.toThrow();
  });

  test('should throw an TooManyRequestsError if the correct trigger is provided', () => {
    const expectedError = new TooManyRequestsError();
    expect(() => checkForErrorTriggers('123456-429', RequestType.SLOTS)).toThrow(expectedError);
  });

  test('should throw an InternalServerError if the correct trigger is provided', () => {
    const expectedError = new InternalServerError();
    expect(() => checkForErrorTriggers('123456-500', RequestType.SLOTS)).toThrow(expectedError);
  });
});
