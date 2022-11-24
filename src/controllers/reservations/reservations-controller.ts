import { HttpRequest } from '@azure/functions';
import { v4 as uuidv4 } from 'uuid';

import { ReservationsRequest, ReservationsResponse } from '../../interfaces/reservations';
import { BadRequestError, ReservationConflictError, ReservationNotValidError } from '../../errors';
import checkForErrorTriggers from '../../utils/checkForErrorTriggers';
import { ErrorTrigger, RequestType } from '../../enums';
import {
  validateReservationRequest,
  isSlotReserved,
  validateReservationId,
  getSlotQuantity,
} from './validators';

export const makeReservation = (req: HttpRequest): ReservationsResponse[] => {
  if (!req.body) {
    throw new BadRequestError();
  }
  // This has been disabled because the HttpRequest.body has type of any.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const requests: ReservationsRequest[] = req.body;
  requests.forEach((request: ReservationsRequest) => {
    if (!validateReservationRequest(request)) {
      throw new BadRequestError();
    }
    if (isSlotReserved(request.startDateTime)) {
      throw new ReservationConflictError();
    }
    checkForErrorTriggers(request.testCentreId, RequestType.RESERVATIONS);
  });

  const reservations: ReservationsResponse[] = [];
  requests.forEach((request: ReservationsRequest) => {
    const slotQuantity = getSlotQuantity(request.startDateTime, request.quantity);
    for (let i = 0, j = slotQuantity; i < j; i++) {
      reservations.push({
        testCentreId: request.testCentreId,
        testTypes: request.testTypes,
        startDateTime: request.startDateTime,
        reservationId: uuidv4(),
      });
    }
  });

  return reservations;
};

export const deleteReservation = (req: HttpRequest): void => {
  if (!req.params) {
    throw new BadRequestError();
  }
  const reservationId = validateReservationId(req.params);
  // 404 Reservation not found thrown only on the DELETE endpoint
  if (reservationId === ErrorTrigger.NOT_FOUND) {
    throw new ReservationNotValidError();
  }
  checkForErrorTriggers(reservationId, RequestType.RESERVATIONS);
};
