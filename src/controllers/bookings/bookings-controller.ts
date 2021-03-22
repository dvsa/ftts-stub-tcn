import { HttpRequest } from '@azure/functions';
import { BookingResponse, BookingRequest, BookingFullResponse } from '../../interfaces/bookings';
import checkForErrorTriggers from '../../utils/error';
import { REQUEST_TYPE } from '../../enums';
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
  const requests: BookingRequest[] = req.body;
  const bookings: BookingResponse[] = [];

  requests.forEach((booking: BookingRequest) => {
    validateBookingRequest(booking);
    checkForErrorTriggers(booking.reservationId, REQUEST_TYPE.CONFIRM_BOOKING);

    bookings.push({
      reservationId: booking.reservationId,
      message: 'Success',
      status: '200',
    });
  });

  return bookings;
};

export const getBooking = (req: HttpRequest): BookingFullResponse => {
  if (!req.params) {
    throw new BadRequestError();
  }
  const bookingReferenceId = validateBookingReferenceId(req.params);
  checkForErrorTriggers(bookingReferenceId, REQUEST_TYPE.CONFIRM_BOOKING);
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
  checkForErrorTriggers(bookingReferenceId, REQUEST_TYPE.CONFIRM_BOOKING);

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
  checkForErrorTriggers(bookingReferenceId, REQUEST_TYPE.CONFIRM_BOOKING);
};
