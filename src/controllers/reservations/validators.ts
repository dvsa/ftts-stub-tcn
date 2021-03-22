import { DateTime } from 'luxon';
import { BadRequestError } from '../../errors';
import { ReservationsRequest } from '../../interfaces/reservations';
import { KeyValue } from '../../interfaces/slots';

export const isSlotReserved = (startDateTime: string): boolean => startDateTime.search('11:00') !== -1;

export const validateReservationRequest = (reservation: ReservationsRequest): boolean => {
  if (!reservation) {
    return false;
  }
  const istestCentreIdValid: boolean = reservation.testCentreId !== undefined
    && reservation.testCentreId.trim().length >= 1
    && reservation.testCentreId.length <= 72;

  const isDateValid: boolean = DateTime.fromISO(reservation.startDateTime).isValid;

  const istestTypesValid: boolean = Array.isArray(reservation.testTypes) && reservation.testTypes.length >= 1;

  return (
    istestCentreIdValid
    && isDateValid
    && istestTypesValid
    && reservation.lockTime >= 1
    && reservation.quantity >= 1
  );
};

export const validateReservationId = (params: KeyValue): string => {
  const { reservationId } = params;
  if (typeof reservationId !== 'string' || reservationId.length < 10 || reservationId.length > 72) {
    throw new BadRequestError();
  }
  return reservationId;
};
