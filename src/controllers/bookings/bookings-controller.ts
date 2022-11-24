import { HttpRequest } from '@azure/functions';
import { BookingResponse, BookingRequest, BookingFullResponse } from '../../interfaces/bookings';
import checkForErrorTriggers from '../../utils/checkForErrorTriggers';
import { RequestType } from '../../enums';
import {
  NotesBehaviouralMarkers,
  staticBookingResponseDetails,
  validateBookingReferenceId,
  validateBookingRequest,
  validateNotesAndBehaviouralMarkers,
} from './validators';
import { BadRequestError } from '../../errors';

export const confirmBooking = (req: HttpRequest): BookingResponse[] => {
  if (!req.body) {
    throw new BadRequestError();
  }
  // This has been disabled because the HttpRequest.body has type of any.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const requests: BookingRequest[] = req.body;
  const bookings: BookingResponse[] = [];

  requests.forEach((booking: BookingRequest) => {
    validateBookingRequest(booking);
    try {
      const shouldAddToResponse = checkForErrorTriggers(booking.reservationId, RequestType.CONFIRM_BOOKING);

      if (shouldAddToResponse) {
        bookings.push({
          reservationId: booking.reservationId,
          message: 'Success',
          status: '200',
        });
      }
    } catch (error) {
      if (requests.length === 1) {
        throw error;
      }
      console.error(error, 'Stub::confirmBooking: Multiple request confirm booking request produced a TCN error');
    }
  });

  return bookings;
};

export const getBooking = (req: HttpRequest): BookingFullResponse => {
  if (!req.params) {
    throw new BadRequestError();
  }
  const bookingReferenceId = validateBookingReferenceId(req.params);
  checkForErrorTriggers(bookingReferenceId, RequestType.GET_BOOKING);
  return {
    bookingReferenceId,
    notes: '',
    behaviouralMarkers: '',
    ...staticBookingResponseDetails,
  };
};

export const putBooking = (req: HttpRequest): BookingFullResponse => {
  if (!req.params || !req.body) {
    throw new BadRequestError();
  }
  const bookingReferenceId = validateBookingReferenceId(req.params);
  checkForErrorTriggers(bookingReferenceId, RequestType.CONFIRM_BOOKING);

  const { notes, behaviouralMarkers } = req.body as NotesBehaviouralMarkers;
  validateNotesAndBehaviouralMarkers({ notes, behaviouralMarkers });

  return {
    bookingReferenceId,
    notes,
    behaviouralMarkers,
    ...staticBookingResponseDetails,
  };
};

export const deleteBooking = (req: HttpRequest): void => {
  if (!req.params) {
    throw new BadRequestError();
  }

  const bookingReferenceId = validateBookingReferenceId(req.params);
  checkForErrorTriggers(bookingReferenceId, RequestType.CONFIRM_BOOKING);
};
