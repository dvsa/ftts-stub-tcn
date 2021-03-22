import checkForErrorTriggers from '../../src/utils/error';
import {
  UnauthorisedError, ForbiddenError, TestCentreNotFoundError, InternalServerError, ReservationNotValidError,
} from '../../src/errors';
import { REQUEST_TYPE } from '../../src/enums';

describe('Error', () => {
  describe('checkForErrorTriggers', () => {
    test('should not throw an error if testCentreId if not a error trigger', () => {
      try {
        // Act
        checkForErrorTriggers('123456789-123', REQUEST_TYPE.SLOTS);
      } catch (e) {
        // Assert
        fail('should not throw an error');
      }
    });

    test('should throw an UnauthorisedError if the correct trigger is provided', () => {
      try {
        // Act
        checkForErrorTriggers('123456-401', REQUEST_TYPE.SLOTS);
        fail('should not reach this point');
      } catch (e) {
        // Assert
        expect(e instanceof UnauthorisedError).toEqual(true);
      }
    });

    test('should throw an ForbiddenError if the correct trigger is provided', () => {
      try {
        // Act
        checkForErrorTriggers('123456-403', REQUEST_TYPE.SLOTS);
        fail('should not reach this point');
      } catch (e) {
        // Assert
        expect(e instanceof ForbiddenError).toEqual(true);
      }
    });

    test('should throw an TestCentreNotFoundError if the correct trigger is provided and Request Type is slots', () => {
      try {
        // Act
        checkForErrorTriggers('123456-404', REQUEST_TYPE.SLOTS);
        fail('should not reach this point');
      } catch (e) {
        // Assert
        expect(e instanceof TestCentreNotFoundError).toEqual(true);
      }
    });

    test('should not throw a TestCentreNotFoundError if the correct trigger is provided and Request Type is not slots', () => {
      try {
        // Act
        checkForErrorTriggers('123456-404', REQUEST_TYPE.RESERVATIONS);
      } catch (e) {
        // Assert
        fail('should not throw an error');
      }
    });

    test('should throw an ReservationNotValidError if the correct trigger is provided and Request Type is confirm booking', () => {
      try {
        // Act
        checkForErrorTriggers('123456-404', REQUEST_TYPE.CONFIRM_BOOKING);
        fail('should not reach this point');
      } catch (e) {
        // Assert
        expect(e instanceof ReservationNotValidError).toEqual(true);
      }
    });

    test('should not throw a ReservationNotValidError if the correct trigger is provided and Request Type is not confirm booking', () => {
      try {
        // Act
        checkForErrorTriggers('123456-404', REQUEST_TYPE.RESERVATIONS);
      } catch (e) {
        // Assert
        fail('should not throw an error');
      }
    });

    test('should throw an InternalServerError if the correct trigger is provided', () => {
      try {
        // Act
        checkForErrorTriggers('123456-500', REQUEST_TYPE.SLOTS);
        fail('should not reach this point');
      } catch (e) {
        // Assert
        expect(e instanceof InternalServerError).toEqual(true);
      }
    });
  });
});
