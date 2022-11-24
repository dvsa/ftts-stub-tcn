import { ErrorTrigger, RequestType } from '../enums';
import {
  UnauthorisedError,
  TestCentreNotFoundError,
  InternalServerError,
  ForbiddenError,
  ReservationNotValidError,
  ServiceUnavailableError,
  TooManyRequestsError,
} from '../errors';

const checkForErrorTriggers = (testCentreId: string, requestType: RequestType): boolean => {
  switch (testCentreId) {
    case ErrorTrigger.UNAUTHORISED:
      throw new UnauthorisedError();
    case ErrorTrigger.FORBIDDEN:
      throw new ForbiddenError();
    case ErrorTrigger.TOO_MANY_REQUESTS:
      throw new TooManyRequestsError();
    case ErrorTrigger.INTERNAL_SERVER_ERROR:
      throw new InternalServerError();
    case ErrorTrigger.SERVICE_UNAVAILABLE:
      throw new ServiceUnavailableError();
    default:
      break;
  }

  if (requestType === RequestType.SLOTS && testCentreId === ErrorTrigger.NOT_FOUND) {
    throw new TestCentreNotFoundError();
  }

  if ((requestType === RequestType.CONFIRM_BOOKING || requestType === RequestType.GET_BOOKING)
    && testCentreId === ErrorTrigger.NOT_FOUND) {
    throw new ReservationNotValidError();
  }

  if (requestType === RequestType.CONFIRM_BOOKING && testCentreId === ErrorTrigger.CONFIRM_NOT_FOUND) {
    throw new TestCentreNotFoundError();
  }

  if ((testCentreId === ErrorTrigger.CONFIRM_BLANK_GET_NOT_FOUND || testCentreId === ErrorTrigger.CONFIRM_BLANK)
    && requestType === RequestType.CONFIRM_BOOKING) {
    return false;
  }

  if (testCentreId === ErrorTrigger.CONFIRM_BLANK_GET_NOT_FOUND && requestType === RequestType.GET_BOOKING) {
    throw new TestCentreNotFoundError();
  }

  return true;
};

export default checkForErrorTriggers;
