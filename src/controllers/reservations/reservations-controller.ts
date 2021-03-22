import { HttpRequest } from '@azure/functions';

import { ReservationsRequest, ReservationsResponse } from '../../interfaces/reservations';
import { BadRequestError, ReservationConflictError, ReservationNotValidError } from '../../errors';
import checkForErrorTriggers from '../../utils/error';
import { ERROR_TRIGGER, REQUEST_TYPE } from '../../enums';
import { validateReservationRequest, isSlotReserved, validateReservationId } from './validators';

export const makeReservation = (req: HttpRequest): ReservationsResponse[] => {
  if (!req.body) {
    throw new BadRequestError();
  }
  const requests: ReservationsRequest[] = req.body;
  requests.forEach((request: ReservationsRequest) => {
    if (!validateReservationRequest(request)) {
      throw new BadRequestError();
    }
    if (isSlotReserved(request.startDateTime)) {
      throw new ReservationConflictError();
    }
    checkForErrorTriggers(request.testCentreId, REQUEST_TYPE.RESERVATIONS);
  });

  const reservations: ReservationsResponse[] = [];
  requests.forEach((request: ReservationsRequest) => {
    for (let i = 0, j = request.quantity; i < j; i++) {
      reservations.push({
        testCentreId: request.testCentreId,
        testTypes: request.testTypes,
        startDateTime: request.startDateTime,
        reservationId: '5050302b-e9f5-476e-b22b-6856a8026e81',
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
  if (reservationId === ERROR_TRIGGER.NOT_FOUND) {
    throw new ReservationNotValidError();
  }
  checkForErrorTriggers(reservationId, REQUEST_TYPE.RESERVATIONS);
};
