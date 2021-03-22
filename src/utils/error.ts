import { ERROR_TRIGGER, REQUEST_TYPE } from '../enums';
import {
  UnauthorisedError,
  TestCentreNotFoundError,
  InternalServerError,
  ForbiddenError,
  ReservationNotValidError,
  ServiceUnavailableError,
} from '../errors';

const checkForErrorTriggers = (testCentreId: string, requestType: REQUEST_TYPE): void => {
  switch (testCentreId) {
    case ERROR_TRIGGER.UNAUTHORISED:
      throw new UnauthorisedError();
    case ERROR_TRIGGER.FORBIDDEN:
      throw new ForbiddenError();
    case ERROR_TRIGGER.INTERNAL_SERVER_ERROR:
      throw new InternalServerError();
    case ERROR_TRIGGER.SERVICE_UNAVAILABLE:
      throw new ServiceUnavailableError();
    default:
      break;
  }

  if (requestType === REQUEST_TYPE.SLOTS && testCentreId === ERROR_TRIGGER.NOT_FOUND) {
    throw new TestCentreNotFoundError();
  }

  if (requestType === REQUEST_TYPE.CONFIRM_BOOKING && testCentreId === ERROR_TRIGGER.NOT_FOUND) {
    throw new ReservationNotValidError();
  }
};

export default checkForErrorTriggers;
